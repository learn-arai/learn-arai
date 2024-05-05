import Elysia, { t } from 'elysia';

import { sql, uploadFile } from '@/lib/db';
import e from '@/lib/error';
import {
    convertStatusToType,
    createSubmission,
    getSubmission,
} from '@/lib/judge0';
import { generateSlug } from '@/lib/utils';

import { middleware } from '../middleware';

export const graderRoute = new Elysia({ prefix: '/c' })
    .use(middleware)
    .derive({ as: 'local' }, async ({ user, session, params }) => {
        if (!user || !session) {
            return {
                teacher: null,
                student: null,
            };
        }

        const { slug } = params;
        if (slug === undefined) {
            return {
                teacher: null,
                student: null,
            };
        }

        const [teacher] = await sql`
        SELECT
            classroom.id, classroom.default_group
        FROM teach
        INNER JOIN classroom
            ON teach.classroom_id = classroom.id
        WHERE
            classroom.slug = ${slug} AND
            teach.user_id = ${user.id}
        `;

        const [student] = await sql`
        SELECT
            classroom.id, classroom.default_group
        FROM study
        INNER JOIN classroom
            ON study.classroom_id = classroom.id
        WHERE
            classroom.slug = ${slug} AND
            study.user_id = ${user.id}
        `;

        return {
            teacher,
            student,
        };
    })
    .get(
        '/:slug/gd/list',
        async (context) => {
            const { set } = context;
            const { user, session, teacher, student } = context;

            if (!user || !session) {
                set.status = 401;
                return {
                    status: 'error',
                    message: e.UNAUTHORIZED,
                };
            }

            if (!student && !teacher) {
                set.status = 403;
                return {
                    status: 'error',
                    message:
                        'You are not authorized to view grader in this classroom',
                };
            }

            const { id: classroomId } = teacher || student;

            const graders = await sql<{ slug: string; name: string }[]>`
            SELECT
                title AS name,
                slug
            FROM grader
            WHERE classroom_id = ${classroomId}
            `;

            return {
                status: 'success',
                data: graders,
            };
        },
        {
            response: t.Union([
                t.Object({
                    status: t.Literal('success'),
                    data: t.Array(
                        t.Object({
                            name: t.String(),
                            slug: t.String(),
                        }),
                    ),
                }),
                t.Object({
                    status: t.Literal('error'),
                    message: t.String(),
                }),
            ]),
        },
    )
    .post(
        '/:slug/gd/:graderSlug/submit',
        async (context) => {
            //TODO : Still cannot called from UI. It display pending status.
            const { set, body, params } = context;
            const { user, session, teacher, student } = context;

            if (!user || !session) {
                set.status = 401;
                return {
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                };
            }

            if (!student && !teacher) {
                set.status = 403;
                return {
                    status: 'error',
                    message:
                        'You are not authorized to submit grader in this classroom',
                };
            }

            const { id: classroomId } = teacher || student;

            const [grader] = await sql`
            SELECT id
            FROM grader
            WHERE slug = ${params.graderSlug}
            AND classroom_id = ${classroomId}
            `;

            const testCase = await sql`
            SELECT input, output, id
            FROM grader_test_case
            WHERE grader_id = ${grader.id}
            `;

            let submissionId: string;
            try {
                submissionId = await sql.begin(async (tx) => {
                    const { source_code: sourceCode } = body;

                    const [submission] = await tx`
                    INSERT INTO grader_submission
                        (grader_id, submitted_by, source_code)
                    VALUES
                        (${grader.id}, ${user.id}, ${sourceCode})
                    RETURNING id;`;

                    for (let i = 0; i < testCase.length; i++) {
                        const stdin = testCase[i].input;
                        const testCaseId = testCase[i].id;

                        let token: string;
                        try {
                            const submitStatus = await createSubmission({
                                sourceCode,
                                languageId: 54,
                                stdin: stdin,
                            });
                            token = submitStatus.token;
                        } catch (error: any) {
                            if (error.code === 'ConnectionRefused')
                                throw new Error(
                                    'Grader engine is not running, please contact administrator',
                                );

                            throw new Error('Internal Server Error');
                        }

                        await tx`
                        INSERT INTO grader_submission_token
                            (token, submission_id, test_case_id) 
                        VALUES 
                            (${token}, ${submission.id}, ${testCaseId});
                        `;
                    }

                    return submission.id;
                });
            } catch (error: any) {
                set.status = 500;
                return {
                    status: 'error',
                    message: error.message,
                };
            }

            return {
                status: 'success',
                data: {
                    submission_id: submissionId,
                },
            };
        },
        {
            body: t.Object({
                source_code: t.String(),
            }),
            params: t.Object({
                graderSlug: t.String(),
                slug: t.String(),
            }),
        },
    )
    .get('/:slug/gd/:graderSlug/s/:subId/status', async (context) => {
        const { set } = context;
        const { user, session, teacher, student } = context;
        if (!user || !session) {
            set.status = 401;
            return {
                status: 'error',
                message: 'Unauthenticated, Please sign in and try again',
            };
        }

        if (!student && !teacher) {
            set.status = 403;
            return {
                status: 'error',
                message: 'You are not authorized to access this resource',
            };
        }

        const { id: classroomId } = teacher || student;
        const { graderSlug, subId } = context.params;

        const tokens = await sql`
        SELECT
            grader_submission_token.status,
            grader_submission_token.token,
            grader_submission_token.compile_output,
            grader_submission.is_completed,
            grader_test_case.output,
            grader_test_case.score
        FROM grader_submission_token
        INNER JOIN grader_submission
            ON grader_submission.id = grader_submission_token.submission_id
        INNER JOIN grader
            ON grader_submission.grader_id = grader.id
        INNER JOIN grader_test_case
            ON grader_test_case.id = grader_submission_token.test_case_id
        WHERE
            grader_submission_token.submission_id = ${subId} AND
            grader.slug = ${graderSlug} AND
            grader.classroom_id = ${classroomId}
        `;

        let allDone = true;

        const result: {
            status: string;
            score: number;
            compileOutput: string;
        }[] = [];

        for (let i = 0; i < tokens.length; i++) {
            if (
                tokens[i].status === 'processing' ||
                tokens[i].status === 'in_queue'
            ) {
                const status = await getSubmission(tokens[i].token);
                let subStatus: string = convertStatusToType(
                    status.status.description,
                );
                let score = 0;

                const CPUTime = status.time ? Number(status.time) * 1000 : null;
                const memory = status.memory
                    ? Number(status.memory) / 1000
                    : null;
                const stdout = atob(status.stdout ?? '');
                const stderr = atob(status.stderr ?? '');
                const compileOutput = atob(status.compile_output ?? '');

                if (subStatus === 'accepted') {
                    if (stdout.trim() !== tokens[i].output.trim()) {
                        subStatus = 'wrong_answer';
                    } else {
                        score = tokens[i].score;
                    }
                }

                await sql`
                UPDATE grader_submission_token
                SET
                    status = ${subStatus},
                    stdout = ${stdout},
                    stderr = ${stderr},
                    compile_output = ${compileOutput},
                    cpu = ${CPUTime},
                    memory = ${memory}
                WHERE token = ${tokens[i].token}
                `;

                allDone = false;

                result.push({
                    status: subStatus,
                    score,
                    compileOutput,
                });
            } else {
                const subStatus = tokens[i].status;
                const score = tokens[i].score;
                const compileOutput = tokens[i].compile_output;

                result.push({
                    status: subStatus,
                    score,
                    compileOutput,
                });
            }
        }

        // console.log(allDone);

        await sql`
        UPDATE grader_submission
        SET is_completed = ${allDone}
        WHERE id = ${subId}
        `;

        return {
            status: 'success',
            data: { test_cases: result, is_completed: allDone },
        };
    })
    .post(
        '/:slug/gd/create',
        async (context) => {
            const { set, body } = context;
            const { user, session, teacher } = context;

            if (!user || !session) {
                set.status = 401;
                return {
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                };
            }

            if (!teacher) {
                set.status = 403;
                return {
                    status: 'error',
                    message:
                        'You are not authorized to create assignment in this classroom',
                };
            }

            const {
                name: title,
                cpu_limit: rawCpuLimit,
                mem_limit: rawMemLimit,
                instruction_file: instructionFile,
            } = body;

            if (isNaN(Number(rawCpuLimit)) || isNaN(Number(rawMemLimit))) {
                set.status = 400;
                return {
                    status: 'error',
                    message: 'CPU limit and Memory limit must be a number',
                };
            }

            const cpuLimit = Number(rawCpuLimit);
            const memLimit = Number(rawMemLimit);

            if (cpuLimit <= 0 || memLimit <= 0) {
                set.status = 400;
                return {
                    status: 'error',
                    message:
                        'CPU limit and Memory limit must be greater than 0',
                };
            }

            const MAX_CPU_LIMIT = 60 * 1000; // in ms (1 minute)
            const MAX_MEM_LIMIT = 512; // in MB (512 MB)

            if (cpuLimit > MAX_CPU_LIMIT || memLimit > MAX_MEM_LIMIT) {
                set.status = 400;
                return {
                    status: 'error',
                    message: `CPU limit must be less than ${MAX_CPU_LIMIT} ms and Memory limit must be less than ${MAX_MEM_LIMIT} MB`,
                };
            }

            const { id: classroomId, default_group: defaultGroup } = teacher;
            const graderSlug = generateSlug();

            await sql.begin(async (tx) => {
                const fileStatus = await uploadFile(instructionFile, user.id, {
                    allowType: 'pdf',
                    public: false,
                    canOnlyAccessByGroup: defaultGroup,
                });

                if (fileStatus.status === 'error') {
                    throw new Error(fileStatus.message);
                }

                const { id: fileId } = fileStatus;

                await tx`
                INSERT INTO grader (
                    slug, classroom_id, group_id,
                    title, instruction_file, created_by,
                    cpu_limit, memory_limit
                ) VALUES (
                    ${graderSlug}, ${classroomId}, ${defaultGroup},
                    ${title}, ${fileId}, ${user.id},
                    ${cpuLimit}, ${memLimit}
                )
                `;
            });

            return {
                status: 'success',
                data: { slug: graderSlug },
                message: 'Grader Problem created successfully',
            };
        },
        {
            body: t.Object({
                name: t.String(),
                instruction_file: t.File(),
                cpu_limit: t.String(),
                mem_limit: t.String(),
            }),
        },
    )
    .get('/:slug/gd/:graderSlug', async (context) => {
        const { set, params } = context;
        const { user, session, teacher, student } = context;

        if (!user || !session) {
            set.status = 401;
            return {
                status: 'error',
                message: 'Unauthenticated, Please sign in and try again',
            };
        }

        if (!teacher && !student) {
            set.status = 403;
            return {
                status: 'error',
                message: 'You are not authorized to access this resource',
            };
        }

        const { graderSlug } = params;
        const { id: classroomId } = teacher || student;

        const [grader] = await sql`
        SELECT
            title AS name,
            cpu_limit,
            memory_limit AS mem_limit,
            instruction_file
        FROM grader
        WHERE
            slug = ${graderSlug} AND
            classroom_id = ${classroomId}
        `;

        if (!grader) {
            set.status = 404;
            return {
                status: 'error',
                message: 'Grader Problem not found',
            };
        }

        return {
            status: 'success',
            data: grader,
        };
    })
    .get('/:slug/gd/:graderSlug/s/list', async (context) => {
        const { set, params } = context;
        const { user, session, teacher, student } = context;

        if (!user || !session) {
            set.status = 401;
            return {
                status: 'error',
                message: 'Unauthenticated, Please sign in and try again',
            };
        }

        if (!teacher && !student) {
            set.status = 403;
            return {
                status: 'error',
                message: 'You are not authorized to access this resource',
            };
        }

        const { graderSlug } = params;
        const { id: classroomId } = teacher || student;

        const submissions = await sql`
        SELECT
            grader_submission.id,
            grader_submission.is_completed,
            grader_submission.submitted_at
        FROM grader_submission
        INNER JOIN grader
            ON grader_submission.grader_id = grader.id
        WHERE
            grader.slug = ${graderSlug} AND
            grader.classroom_id = ${classroomId} AND
            grader_submission.submitted_by = ${user.id}
        ORDER BY grader_submission.submitted_at DESC
        `;

        for (let i = 0; i < submissions.length; i++) {
            const statusLists = [];
            let totalRunTime = 0;
            let totalMemory = 0;
            const tcs = await sql`
            SELECT
                status,
                cpu,
                memory
            FROM grader_submission_token
            WHERE
                submission_id = ${submissions[i].id}
            `;

            for (let j = 0; j < tcs.length; j++) {
                totalMemory += Number(tcs[j].memory);
                totalRunTime += Number(tcs[j].cpu);
                statusLists.push(tcs[j].status);
            }

            // processing, in_queue, accepted, wrong_answer, compilation_error, runtime_error, time_limit
            let status = 'in_queue';
            if (statusLists.some((s) => s === 'processing'))
                status = 'processing';
            if (statusLists.some((s) => s === 'wrong_answer'))
                status = 'wrong_answer';
            if (statusLists.every((s) => s === 'accepted')) status = 'accepted';
            if (statusLists.some((s) => s === 'compilation_error'))
                status = 'compilation_error';
            if (statusLists.some((s) => s === 'runtime_error'))
                status = 'runtime_error';
            if (statusLists.some((s) => s === 'time_limit'))
                status = 'time_limit';

            submissions[i].status = status;
            submissions[i].total_memory = totalMemory;
            submissions[i].total_run_time = totalRunTime;
        }

        return { status: 'success', data: submissions };
    })
    .get('/:slug/gd/:graderSlug/s/:subId/detail', async (context) => {
        const { set, params } = context;
        const { user, session, teacher, student } = context;

        if (!user || !session) {
            set.status = 401;
            return {
                status: 'error',
                message: 'Unauthenticated, Please sign in and try again',
            };
        }

        if (!teacher && !student) {
            set.status = 403;
            return {
                status: 'error',
                message: 'You are not authorized to access this resource',
            };
        }

        const { graderSlug, subId } = params;
        const { id: classroomId } = teacher || student;

        const [submission] = await sql`
        SELECT
            source_code,
            submitted_at
        FROM grader_submission
        INNER JOIN grader
            ON grader.id = grader_submission.grader_id
        WHERE
            grader.slug = ${graderSlug} AND
            grader.classroom_id = ${classroomId} AND
            grader_submission.id = ${subId}
        `;

        const statusLists = [];
        let totalRunTime = 0;
        let totalMemory = 0;
        const tcs = await sql`
        SELECT
            status,
            cpu,
            memory
        FROM grader_submission_token
        WHERE
            submission_id = ${subId}
        `;

        for (let j = 0; j < tcs.length; j++) {
            totalMemory += Number(tcs[j].memory);
            totalRunTime += Number(tcs[j].cpu);
            statusLists.push(tcs[j].status);
        }

        // processing, in_queue, accepted, wrong_answer, compilation_error, runtime_error, time_limit
        let status = 'in_queue';
        if (statusLists.some((s) => s === 'processing')) status = 'processing';
        if (statusLists.some((s) => s === 'wrong_answer'))
            status = 'wrong_answer';
        if (statusLists.every((s) => s === 'accepted')) status = 'accepted';
        if (statusLists.some((s) => s === 'compilation_error'))
            status = 'compilation_error';
        if (statusLists.some((s) => s === 'runtime_error'))
            status = 'runtime_error';
        if (statusLists.some((s) => s === 'time_limit')) status = 'time_limit';

        return {
            status: 'success',
            data: {
                source_code: submission.source_code,
                submitted_at: submission.submitted_at,
                status,
                total_memory: totalMemory,
                total_run_time: totalRunTime,
            },
        };
    })
    .post(
        '/:slug/gd/:graderSlug/add-test-case',
        async (context) => {
            const { set, body, params } = context;
            const { user, session, teacher } = context;

            if (!user || !session) {
                set.status = 401;
                return {
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                };
            }

            if (!teacher) {
                set.status = 403;
                return {
                    status: 'error',
                    message:
                        'You are not authorized to create test-case in this classroom',
                };
            }

            const { slug: classroom_slug } = params;

            const [classroom] = await sql`
            SELECT
                classroom.id AS "classroom_id"
            FROM classroom
            INNER JOIN teach
                ON classroom.id = teach.classroom_id
            WHERE
                classroom.slug = ${classroom_slug} AND
                teach.user_id = ${user.id}
            `;

            if (!classroom) {
                return {
                    status: 'error',
                    message: 'You are not authorized to access this resource',
                };
            }

            const { input, output, score } = body;
            const fileSizeLimit = 1_024 * 1_024 * 2;

            if (input.size > fileSizeLimit || output.size > fileSizeLimit) {
                return {
                    status: 'error',
                    message: 'file memory is exceed.',
                };
            }

            const [grader] = await sql`
                SELECT id
                FROM grader
                WHERE slug = ${params.graderSlug} AND classroom_id = ${classroom.classroom_id}
            `;

            await sql.begin(async (tx) => {
                const stdin = await input.text();
                const stdout = await output.text();

                await tx`
                INSERT INTO grader_test_case
                    (grader_id, input, output, score)
                VALUES
                    (${grader.id}, ${stdin}, ${stdout}, ${Number(score)})
                `;
            });

            return {
                status: 'success',
                message: 'Test case added successfully',
            };
        },
        {
            body: t.Object({
                input: t.File(),
                output: t.File(),
                score: t.String(),
            }),
        },
    )
    .get('/:slug/gd/:graderSlug/tc/list', async (context) => {
        const { set, params } = context;
        const { user, session, teacher } = context;

        if (!user || !session) {
            set.status = 401;
            return {
                status: 'error',
                message: 'Unauthenticated, Please sign in and try again',
            };
        }

        if (!teacher) {
            set.status = 403;
            return {
                status: 'error',
                message: 'You are not authorized to access this resource',
            };
        }

        const { id: classroomId } = teacher;
        const { graderSlug } = params;

        const testCases = await sql`
        SELECT
            input,
            output,
            score
        FROM grader_test_case
        INNER JOIN grader
            ON grader_test_case.grader_id = grader.id
        WHERE
            grader.slug = ${graderSlug} AND
            grader.classroom_id = ${classroomId}
        `;

        return {
            status: 'success',
            data: testCases,
        };
    })
    .get(
        '/:slug/gd/scoreboard',
        async (context) => {
            const { set } = context;
            const { user, session, teacher } = context;

            if (!user || !session) {
                set.status = 401;
                return {
                    status: 'error',
                    message: e.UNAUTHORIZED,
                };
            }

            if (!teacher) {
                set.status = 403;
                return {
                    status: 'error',
                    message: e.TEACHER_ONLY,
                };
            }

            const { id: classroomId } = teacher;

            const scoreboard = await sql`
            SELECT
                *
            FROM study
            WHERE
                study.classroom_id = ${classroomId}
            INNER JOIN auth_user
                ON study.user_id = auth_user.id
            `;

            console.log(scoreboard);

            return {
                status: 'success',
                data: {
                    1: { name: 'John Doe', score: 100 },
                },
            };
        },
        {
            detail: {
                tags: ['Grader'],
                description: 'Get scoreboard of grader',
                responses: {
                    '200': {
                        description: 'Success',
                        content: {
                            'application/json': {
                                schema: t.Object({
                                    status: t.Literal('success'),
                                    data: t.Record(
                                        t.Number(),
                                        t.Object({
                                            name: t.String(),
                                            score: t.Number(),
                                        }),
                                    ),
                                }),
                                example: {
                                    status: 'success',
                                    data: {
                                        1: { name: 'John Doe', score: 100 },
                                        2: {
                                            name: 'Athicha Leksansern',
                                            score: 100,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '401': {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: t.Object({
                                    status: t.Literal('error'),
                                    message: t.Literal(e.UNAUTHORIZED),
                                }),
                                example: {
                                    status: 'error',
                                    message: e.UNAUTHORIZED,
                                },
                            },
                        },
                    },
                },
            },
        },
    );

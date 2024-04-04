import Elysia, { t } from 'elysia';

import { sql, uploadFile } from '@/lib/db';
import { createSubmission } from '@/lib/judge0';
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
    .post(
        '/:slug/gd/:graderSlug/submit',
        async (context) => {
            //TODO : still cannot called from UI. It display pending status.
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
            
            const { id : classroomId } = teacher || student;

            const [grader] = await sql`
                SELECT id
                FROM grader
                WHERE slug = ${params.graderSlug}
                AND classroom_id = ${classroomId}
            `;

            const testCase = await sql`
                SELECT input, output
                FROM grader_test_case
                WHERE grader_id = ${grader.id}
            `;

                const submissionId = await sql.begin(async (tx) => {
                    const { source_code: sourceCode } = body;
                    
                    if (!process.env.UPLOAD_FOLDER) {
                        throw ( new Error() );
                    }
                    
                    const [submission] = await tx`INSERT INTO grader_submission
                                (grader_id, submitted_by, source_code)
                                VALUES
                                (${grader.id}, ${user.id}, ${sourceCode})
                                RETURNING id;`;
                    
                    for (let i = 0; i < testCase.length; i++) {
                        const stdin = testCase[i].input;

                        const { token } = await createSubmission({
                            sourceCode,
                            languageId: 54,
                            stdin: stdin,
                        });

                        tx`
                            INSERT INTO grader_submission_token
                            (token, submission_id) 
                            VALUES 
                            (${token}, ${submission.id});
                        `.then(() => {});
                        return submission.id;

                    }
                });           
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
            params : t.Object({
                graderSlug : t.String()
            })
        },
    )
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
                instruction_file: instructionFile,
                cpu_limit: rawCpuLimit,
                mem_limit: rawMemLimit,
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
            SELECT classroom.id AS "classroom_id"
            FROM classroom INNER JOIN teach
            ON classroom.id = teach.classroom_id
            WHERE classroom.slug = ${classroom_slug} AND teach.user_id = ${user.id}
            `;

            if (!classroom) {
                return {
                    status: 'error',
                    message: 'You are not authorized to access this resource',
                };
            }

            const { input, output, score } = body;
            const fileSizeLimit = 1_024 * 1_024 * 2;

            if ( input.size > fileSizeLimit || output.size > fileSizeLimit ) {
                return {
                    status : 'error',
                    message : 'file memory is exceed.'
                }
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
                ( grader_id, input, output, score )
                VALUES
                ( ${grader.id}, ${stdin}, ${stdout}, ${Number(score)} )
                `
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
    .get('/:slug/gd/:graderSlug/test-cases', async (context) => {
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

        const testCases = await sql`
        SELECT output_file, input_file
        FROM grader_test_case
        WHERE grader_id = (
            SELECT id
            FROM grader
            WHERE slug = ${graderSlug}
        )
        `;

        return {
            status: 'success',
            data: testCases,
        };
    });

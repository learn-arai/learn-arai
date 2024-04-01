import { Elysia, t } from 'elysia';

import { sql, uploadFile } from '@/lib/db';
import { generateSlug } from '@/lib/utils';

import { middleware } from '../middleware';

export const classroomAssignmentRoute = new Elysia({ prefix: '/c' })
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
    .group('/:slug/a', (app) => {
        return app
            .post(
                '/create',
                async ({ user, session, set, body, teacher }) => {
                    if (!user || !session) {
                        set.status = 401;
                        return {
                            status: 'error',
                            message:
                                'Unauthenticated, Please sign in and try again',
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
                        title,
                        description,
                        due_date: dueDate,
                        max_score: maxScore,
                    } = body;

                    if (!title) {
                        set.status = 400;
                        return {
                            status: 'error',
                            message: 'Title is required',
                        };
                    }

                    const { default_group: defaultGroup, id: classroomId } =
                        teacher;
                    const assignmentSlug = generateSlug();

                    await sql`
                    INSERT INTO assignment
                        (slug, classroom_id, group_id, title, description, due_date, max_score, created_by)
                    VALUES
                        (${assignmentSlug}, ${classroomId}, ${defaultGroup}, ${title}, ${description}, ${dueDate}, ${maxScore}, ${user.id});
                    `;

                    return {
                        status: 'success',
                        message: 'Assignment created successfully',
                        data: {
                            slug: assignmentSlug,
                        },
                    };
                },
                {
                    body: t.Object({
                        title: t.String(),
                        description: t.String(),
                        due_date: t.String(),
                        max_score: t.String(),
                    }),
                },
            )
            .get('/list', async ({ user, session, set, teacher, student }) => {
                if (!user || !session) {
                    set.status = 401;
                    return {
                        status: 'error',
                        message:
                            'Unauthenticated, Please sign in and try again',
                    };
                }

                if (!teacher && !student) {
                    set.status = 403;
                    return {
                        status: 'error',
                        message:
                            'You are not authorized to view this classroom',
                    };
                }

                const { id: classroomId } = teacher || student;

                let assignment: any[] = [];
                if (student) {
                    assignment = await sql`
                    SELECT
                        assignment.slug,
                        assignment.title,
                        assignment.due_date,
                        assignment.description,
                        assignment_submission.is_submitted,
                        assignment.max_score
                    FROM classroom_group_member
                    INNER JOIN classroom_group
                        ON classroom_group_member.group_id = classroom_group.id
                    INNER JOIN assignment
                        ON assignment.group_id = classroom_group.id
                    LEFT JOIN assignment_submission ON
                        assignment_submission.assignment_id = assignment.id AND
                        assignment_submission.user_id = classroom_group_member.user_id
                    WHERE 
                        classroom_group_member.user_id = ${user.id} AND
                        classroom_group.classroom_id = ${classroomId};
                    `;
                } else if (teacher) {
                    assignment = await sql`
                    SELECT
                        assignment.slug,
                        assignment.title,
                        assignment.due_date,
                        assignment.description,
                        assignment.max_score,
                        COUNT(DISTINCT classroom_group_member.user_id) AS num_assigned,
                        COUNT(DISTINCT assignment_submission.user_id) FILTER (WHERE is_submitted = TRUE) AS num_turned_in
                    FROM assignment
                    LEFT JOIN classroom_group_member
                        ON classroom_group_member.group_id = assignment.group_id
                    LEFT JOIN assignment_submission
                        ON assignment_submission.assignment_id = assignment.id
                    WHERE
                        assignment.classroom_id = ${classroomId}
                    GROUP BY assignment.id;
                    `;
                }

                return {
                    status: 'success',
                    data: assignment,
                };
            });
    })
    .group('/:slug/a/:assignmentSlug', (app) => {
        return app
            .get(
                '/detail',
                async ({ user, session, set, params, teacher, student }) => {
                    if (!user || !session) {
                        set.status = 401;
                        return {
                            status: 'error',
                            message:
                                'Unauthenticated, Please sign in and try again',
                        };
                    }

                    if (!teacher && !student) {
                        set.status = 403;
                        return {
                            status: 'error',
                            message:
                                'You are not authorized to view this classroom',
                        };
                    }

                    const { id: classroomId } = teacher || student;
                    const { assignmentSlug } = params;

                    let assignment: any = {};
                    if (student) {
                        [assignment] = await sql`
                        SELECT
                            assignment.slug,
                            assignment.title,
                            assignment.due_date,
                            assignment.description,
                            assignment_submission.is_submitted,
                            assignment.max_score
                        FROM classroom_group_member
                        INNER JOIN classroom_group
                            ON classroom_group_member.group_id = classroom_group.id
                        INNER JOIN assignment
                            ON assignment.group_id = classroom_group.id
                        LEFT JOIN assignment_submission ON
                            assignment_submission.assignment_id = assignment.id AND
                            assignment_submission.user_id = classroom_group_member.user_id
                        WHERE
                            classroom_group_member.user_id = ${user.id} AND
                            classroom_group.classroom_id = ${classroomId} AND
                            assignment.slug = ${assignmentSlug};
                        `;
                    } else if (teacher) {
                        [assignment] = await sql`
                        SELECT
                            assignment.slug,
                            assignment.title,
                            assignment.due_date,
                            assignment.description,
                            assignment.max_score
                        FROM assignment
                        WHERE
                            assignment.classroom_id = ${classroomId} AND
                            assignment.slug = ${assignmentSlug};
                        `;
                    }

                    return {
                        status: 'success',
                        data: assignment,
                    };
                },
            )
            .post(
                '/edit',
                async (context) => {
                    const { user, session, set, params } = context;
                    const { teacher, body, student } = context;

                    if (!user || !session) {
                        set.status = 401;
                        return {
                            status: 'error',
                            message:
                                'Unauthenticated, Please sign in and try again',
                        };
                    }

                    if (!teacher && !student) {
                        set.status = 403;
                        return {
                            status: 'error',
                            message:
                                'You are not authorized to view this classroom',
                        };
                    }

                    const { id: classroomId } = teacher || student;
                    const { assignmentSlug } = params;

                    const {
                        title,
                        description,
                        due_date: dueDate,
                        max_score: maxScore,
                    } = body;

                    const [assignment] = await sql`
                    UPDATE assignment SET
                        title = ${title},
                        description = ${description},
                        due_date = ${dueDate},
                        max_score = ${maxScore}
                    WHERE
                        slug = ${assignmentSlug} AND
                        classroom_id = ${classroomId}
                    RETURNING id
                    `;

                    if (!assignment) {
                        set.status = 404;
                        return {
                            status: 'error',
                            message: 'Assignment not found',
                        };
                    }

                    return {
                        status: 'success',
                        message: 'Assignment updated successfully',
                    };
                },
                {
                    body: t.Object({
                        title: t.String(),
                        description: t.String(),
                        due_date: t.String(),
                        max_score: t.String(),
                    }),
                },
            )
            .post(
                '/attach',
                async ({ user, session, set, params, teacher, body }) => {
                    if (!user || !session) {
                        set.status = 401;
                        return {
                            status: 'error',
                            message:
                                'Unauthenticated, Please sign in and try again',
                        };
                    }

                    if (!teacher) {
                        set.status = 403;
                        return {
                            status: 'error',
                            message: 'You are not authorized to attach file',
                        };
                    }

                    const { id: classroomId } = teacher;
                    const { assignmentSlug } = params;
                    const file = body.file as File;

                    const [assignment] = await sql`
                    SELECT
                        assignment.id,
                        assignment.group_id
                    FROM assignment
                    WHERE
                        assignment.slug = ${assignmentSlug} AND
                        assignment.classroom_id = ${classroomId}
                    `;

                    await sql.begin(async (tx) => {
                        const uploadStatus = await uploadFile(file, user.id, {
                            public: false,
                            canOnlyAccessByGroup: assignment.group_id,
                        });

                        if (uploadStatus.status === 'error') {
                            throw new Error(uploadStatus.message);
                        }

                        const fileId = uploadStatus.id;

                        await tx`
                        INSERT INTO assignment_attachment
                            (assignment_id, file_id)
                        VALUES
                            (${assignment.id}, ${fileId})
                        `;
                    });

                    return {
                        status: 'success',
                        message: 'File attached successfully',
                    };
                },
                {
                    body: t.Object({
                        file: t.File(),
                    }),
                },
            )
            .get(
                '/attach',
                async ({ user, session, set, params, teacher, student }) => {
                    if (!user || !session) {
                        set.status = 401;
                        return {
                            status: 'error',
                            message:
                                'Unauthenticated, Please sign in and try again',
                        };
                    }

                    if (!teacher && !student) {
                        set.status = 403;
                        return {
                            status: 'error',
                            message:
                                'You are not authorized to access this file',
                        };
                    }

                    const { id: classroomId } = teacher || student;
                    const { assignmentSlug } = params;

                    const attachment = await sql`
                    SELECT
                        assignment_attachment.file_id,
                        file.name,
                        file.file_size AS "size",
                        file.file_type AS "type"
                    FROM assignment_attachment
                    INNER JOIN assignment
                        ON assignment_attachment.assignment_id = assignment.id
                    INNER JOIN file
                        ON file.id = assignment_attachment.file_id
                    WHERE
                        assignment.slug = ${assignmentSlug} AND
                        assignment.classroom_id = ${classroomId}
                    `;

                    return {
                        status: 'success',
                        data: attachment,
                    };
                },
            )
            .post('/submit-attach', async (context) => {
                const { user, session, set, params } = context;
                const { body, student } = context;

                if (!user || !session) {
                    set.status = 401;
                    return {
                        status: 'error',
                        message:
                            'Unauthenticated, Please sign in and try again',
                    };
                }

                if (!student) {
                    set.status = 403;
                    return {
                        status: 'error',
                        message: 'You are not authorized to submit file',
                    };
                }

                const { assignmentSlug } = params;
                const { id: classroomId } = student;

                const [assignment] = await sql`
                SELECT
                    assignment.id
                FROM assignment
                INNER JOIN classroom_group ON
                    assignment.group_id = classroom_group.id
                INNER JOIN classroom_group_member ON
                    classroom_group.id = classroom_group_member.group_id
                WHERE
                    assignment.slug = ${assignmentSlug} AND
                    classroom_group.classroom_id = ${classroomId} AND
                    classroom_group_member.user_id = ${user.id}
                `;

                if (!assignment) {
                    set.status = 404;
                    return {
                        status: 'error',
                        message: 'Assignment not found',
                    };
                }

                const { id: assignmentId } = assignment;

                const parsedBody = body as {
                    file_count: string;
                } & {
                    [fileId: string]: File;
                };

                await sql.begin(async (tx) => {
                    const fileCount = Number(parsedBody.file_count);
                    for (let i = 0; i < fileCount; i++) {
                        const status = await uploadFile(
                            parsedBody[`f-${i}`],
                            user.id,
                            {
                                public: false,
                                canOnlyAccessByStudent: user.id,
                                sql: tx,
                            },
                        );

                        if (status.status === 'error') {
                            throw new Error(status.message);
                        }

                        await tx`
                        INSERT INTO assignment_submission_attachment
                            (assignment_id, user_id, file_id)
                        VALUES
                            (${assignmentId}, ${user.id}, ${status.id});
                        `;
                    }
                });

                set.status = 200;
                return {
                    status: 'success',
                };
            })
            .get('/submit-attach', async (context) => {
                const { user, session, set, params } = context;
                const { student } = context;
                if (!user || !session) {
                    set.status = 401;
                    return {
                        status: 'error',
                        message:
                            'Unauthenticated, Please sign in and try again',
                    };
                }

                if (!student) {
                    set.status = 403;
                    return {
                        status: 'error',
                        message: 'You are not authorized to view this file',
                    };
                }

                const { assignmentSlug } = params;
                const { id: classroomId } = student;

                const [assignment] = await sql`
                SELECT
                    assignment.id
                FROM assignment
                INNER JOIN classroom_group ON
                    assignment.group_id = classroom_group.id
                INNER JOIN classroom_group_member ON
                    classroom_group.id = classroom_group_member.group_id
                WHERE
                    assignment.slug = ${assignmentSlug} AND
                    classroom_group.classroom_id = ${classroomId} AND
                    classroom_group_member.user_id = ${user.id}
                `;

                if (!assignment) {
                    set.status = 404;
                    return {
                        status: 'error',
                        message: 'Assignment not found',
                    };
                }

                const { id: assignmentId } = assignment;

                const attachment = await sql`
                SELECT
                    file.id AS "file_id",
                    file.name,
                    file.file_size AS "size",
                    file.file_type AS "type"
                FROM assignment_submission_attachment
                INNER JOIN file
                    ON assignment_submission_attachment.file_id = file.id
                WHERE
                    assignment_id = ${assignmentId} AND
                    user_id = ${user.id}
                `;

                set.status = 200;
                return {
                    status: 'success',
                    data: attachment,
                };
            })
            .post('/submit', async (context) => {
                const { set, params } = context;
                const { student, user, session } = context;

                if (!user || !session) {
                    set.status = 401;
                    return {
                        status: 'error',
                        message:
                            'Unauthenticated, Please sign in and try again',
                    };
                }

                if (!student) {
                    set.status = 403;
                    return {
                        status: 'error',
                        message: 'You are not authorized to submit assignment',
                    };
                }

                const { assignmentSlug } = params;

                const [assignment] = await sql`
                SELECT
                    assignment.id
                FROM assignment
                INNER JOIN classroom_group ON
                    assignment.group_id = classroom_group.id
                INNER JOIN classroom_group_member ON
                    classroom_group.id = classroom_group_member.group_id
                WHERE
                    assignment.slug = ${assignmentSlug} AND
                    classroom_group.classroom_id = ${student.id} AND
                    classroom_group_member.user_id = ${user.id}
                `;

                if (!assignment) {
                    set.status = 404;
                    return {
                        status: 'error',
                        message: 'Assignment not found',
                    };
                }

                const { id: assignmentId } = assignment;

                // Upsert = Insert if not exists, Update if exists
                await sql`
                INSERT INTO assignment_submission
                    (assignment_id, user_id)
                VALUES
                    (${assignmentId}, ${user.id})
                ON CONFLICT (assignment_id, user_id)
                DO UPDATE SET
                    is_submitted = TRUE,
                    submitted_at = NOW();
                `;

                set.status = 200;
                return {
                    status: 'success',
                    message: 'Assignment submitted successfully',
                };
            })
            .post('/unsubmit', async (context) => {
                const { set, params } = context;
                const { student, user, session } = context;

                if (!user || !session) {
                    set.status = 401;
                    return {
                        status: 'error',
                        message:
                            'Unauthenticated, Please sign in and try again',
                    };
                }

                if (!student) {
                    set.status = 403;
                    return {
                        status: 'error',
                        message: 'You are not authorized to submit assignment',
                    };
                }

                const { assignmentSlug } = params;

                const [assignment] = await sql`
                SELECT
                    assignment.id
                FROM assignment
                INNER JOIN classroom_group ON
                    assignment.group_id = classroom_group.id
                INNER JOIN classroom_group_member ON
                    classroom_group.id = classroom_group_member.group_id
                WHERE
                    assignment.slug = ${assignmentSlug} AND
                    classroom_group.classroom_id = ${student.id} AND
                    classroom_group_member.user_id = ${user.id}
                `;

                if (!assignment) {
                    set.status = 404;
                    return {
                        status: 'error',
                        message: 'Assignment not found',
                    };
                }

                const { id: assignmentId } = assignment;

                await sql`
                UPDATE assignment_submission
                SET
                    is_submitted = FALSE
                WHERE
                    assignment_id = ${assignmentId} AND
                    user_id = ${user.id}
                `;

                set.status = 200;
                return {
                    status: 'success',
                    message: 'Assignment submitted successfully',
                };
            })
            .get('/submitted-users', async (context) => {
                const { set, params } = context;
                const { assignmentSlug } = params;
                const assignmentId = await sql`
                SELECT id FROM assignment WHERE slug = ${assignmentSlug}`;
                const Id = assignmentId[0].id;
                try {
                    const users = await sql`
                    SELECT
                    au.id,
                    au.first_name,
                    au.last_name
                    FROM
                    assignment_submission AS sub
                    JOIN
                    auth_user AS au ON sub.user_id = au.id
                    WHERE
                    sub.is_submitted = true
                    AND sub.assignment_id = ${Id};
                    `;

                    set.status = 200;
                    return {
                        status: 'success',
                        data: users,
                    };
                } catch (err) {
                    console.error(err);
                    set.status = 500;
                    return {
                        status: 'error',
                        message: 'An error occurred, please try again',
                    };
                }
            })
            .get('/submitted-file', async (context) => {
                const { set, params, query } = context;
                const { assignmentSlug : assignmentSlug } = params;
                const { user_id: userId } = query;
                
                const assignmentId = await sql`
                SELECT id
                FROM assignment
                WHERE slug = ${assignmentSlug}`;
                const Id = assignmentId[0].id;
                
                const fileId = await sql`
                SELECT file_id
                FROM assignment_submission_attachment 
                WHERE assignment_id = ${Id} AND user_id = ${userId};
                    `;
                set.status = 200;
                return {
                    status: 'success',
                    data: fileId,
                };

            }, {
                query: t.Object({
                    user_id: t.String(),
                })
            });
    });

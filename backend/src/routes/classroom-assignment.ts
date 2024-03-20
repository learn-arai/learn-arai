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
            return;
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
                        assignment.description
                    FROM classroom_group_member
                    INNER JOIN classroom_group
                        ON classroom_group_member.group_id = classroom_group.id
                    INNER JOIN assignment
                        ON assignment.group_id = classroom_group.id
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
                        assignment.description
                    FROM assignment
                    WHERE assignment.classroom_id = ${classroomId};
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
                            assignment.max_score
                        FROM classroom_group_member
                        INNER JOIN classroom_group
                            ON classroom_group_member.group_id = classroom_group.id
                        INNER JOIN assignment
                            ON assignment.group_id = classroom_group.id
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

                const parsedBody = body as {
                    file_count: string;
                } & {
                    [fileId: string]: File;
                };

                const fileCount = Number(parsedBody.file_count);
                for (let i = 0; i < fileCount; i++) {
                    console.log(parsedBody[`f-${i}`]);
                }

                console.log(fileCount);

                set.status = 501;
                return {
                    status: 'error',
                    message: 'Not implemented',
                };
            });
    });
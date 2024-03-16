import { Elysia, t } from 'elysia';

import { sql } from '@/lib/db';
import { generateSlug } from '@/lib/utils';

import { middleware } from '../middleware';

export const classroomAssignmentRoute = new Elysia({ prefix: '/c' })
    .use(middleware)
    .group('/:slug/a', (app) => {
        return app
            .post(
                '/create',
                async ({ user, session, set, params, body }) => {
                    if (!user || !session) {
                        set.status = 401;
                        return {
                            status: 'error',
                            message:
                                'Unauthenticated, Please sign in and try again',
                        };
                    }

                    const { slug } = params;

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

                    const { default_group: defaultGroup } = teacher;
                    const assignmentSlug = generateSlug();

                    await sql`
                INSERT INTO assignment
                    (slug, group_id, title, description, due_date, max_score, created_by)
                VALUES
                    (${assignmentSlug}, ${defaultGroup}, ${title}, ${description}, ${dueDate}, ${maxScore}, ${user.id});
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
            .get('/list', async ({ user, session, set, params }) => {
                if (!user || !session) {
                    set.status = 401;
                    return {
                        status: 'error',
                        message:
                            'Unauthenticated, Please sign in and try again',
                    };
                }

                const { slug } = params;

                const [teacher] = await sql`
                SELECT
                    classroom.id
                FROM teach
                INNER JOIN classroom
                    ON teach.classroom_id = classroom.id
                WHERE
                    classroom.slug = ${slug} AND
                    teach.user_id = ${user.id}
                `;

                const [student] = await sql`
                SELECT
                    classroom.id
                FROM study
                INNER JOIN classroom
                    ON study.classroom_id = classroom.id
                WHERE
                    classroom.slug = ${slug} AND
                    study.user_id = ${user.id}
                `;

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
                } else if (teacher) {
                    assignment = await sql`
                    SELECT
                        assignment.slug
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
        return app;
    });

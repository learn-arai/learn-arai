import { Elysia, t } from 'elysia';

import { sql } from '@/lib/db';
import { generateSlug } from '@/lib/utils';

import { middleware } from '../middleware';

export const classroomAssignmentRoute = new Elysia({ prefix: '/c' })
    .use(middleware)
    .group('/:slug/a', (app) => {
        return app.post(
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
                    classroom.id
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

                const assignmentSlug = generateSlug();

                console.log({
                    title,
                    description,
                    dueDate,
                    maxScore,
                    assignmentSlug,
                });

                return {
                    status: 'success',
                    message: 'Assignment created successfully',
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
        );
    })
    .group('/:slug/a/:assignmentSlug', (app) => {
        return app;
    });

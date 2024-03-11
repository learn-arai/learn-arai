import { Elysia, t } from 'elysia';

import { sql } from '@/lib/db';
import { generateSlug } from '@/lib/utils';
import { middleware } from '@/src/middleware';

export const classroomGroupRoute = new Elysia({ prefix: '/classroom' }).group(
    '/:slug/group',
    (app) =>
        app
            .use(middleware)
            .post(
                '/create',
                async ({ params, user, session, set, body }) => {
                    if (!user || !session) {
                        set.status = 401;
                        return {
                            status: 'error',
                            message:
                                'Unauthenticated, Please sign in and try again',
                        };
                    }

                    const { slug } = params;

                    const classroom = await sql`
                    SELECT
                        teach.classroom_id
                    FROM teach
                    INNER JOIN classroom
                        ON classroom.id = teach.classroom_id
                    WHERE
                        classroom.slug = ${slug} AND
                        teach.user_id = ${user.id}
                    `;

                    if (classroom.length === 0) {
                        set.status = 404;

                        return {
                            status: 'error',
                            message:
                                "Classroom not found or you're not the teacher of this classroom.",
                        };
                    }

                    const { title } = body;
                    const { classroom_id: classroomId } = classroom[0];
                    const groupSlug = generateSlug();

                    await sql`
                        INSERT INTO classroom_group
                            (title, classroom_id, created_by, slug)
                        VALUES
                            (${title}, ${classroomId}, ${user.id}, ${groupSlug})
                    `;

                    return {
                        status: 'success',
                        message: 'Group has been created.',
                        data: {
                            slug: groupSlug,
                        },
                    };
                },
                {
                    params: t.Object({
                        slug: t.String(),
                    }),
                    body: t.Object({
                        title: t.String(),
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

                const classroom = await sql`
                    SELECT
                        teach.classroom_id
                    FROM teach
                    INNER JOIN classroom
                        ON classroom.id = teach.classroom_id
                    WHERE
                        classroom.slug = ${slug} AND
                        teach.user_id = ${user.id}
                    `;

                if (classroom.length === 0) {
                    set.status = 404;

                    return {
                        status: 'error',
                        message:
                            "Classroom not found or you're not the teacher of this classroom.",
                    };
                }

                const { classroom_id: classroomId } = classroom[0];

                const group = await sql`
                SELECT
                    slug,
                    title,
                    created_at AS "createdAt",
                    created_by AS "createdBy"
                FROM classroom_group
                WHERE classroom_id = ${classroomId}
                `;

                return {
                    status: 'success',
                    data: group,
                };
            }),
);

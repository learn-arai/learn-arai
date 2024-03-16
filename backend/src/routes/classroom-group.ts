import { Elysia, t } from 'elysia';

import { sql } from '@/lib/db';
import { generateSlug } from '@/lib/utils';
import { middleware } from '@/src/middleware';

export const classroomGroupRoute = new Elysia({ prefix: '/c' }).group(
    '/:slug/g',
    (app) =>
        app
            .use(middleware)
            .post( '/create', async ({ params, user, session, set, body }) => {
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
            .get('/list', async ({ user, session, set, params, query }) => {
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
                        teach.classroom_id,
                        classroom.default_group
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

                const {
                    classroom_id: classroomId,
                    default_group: defaultGroupId,
                } = classroom[0];

                const { title } = query;
                const [defaultGroup] = await sql`
                SELECT
                    slug
                FROM classroom_group
                WHERE id = ${defaultGroupId}`;

                const group = !query 
                    ? 
                await sql`
                SELECT
                    slug,
                    title,
                    created_at AS "createdAt",
                    created_by AS "createdBy"
                FROM classroom_group
                WHERE classroom_id = ${classroomId}
                `
                    :
                await sql`
                SELECT 
                    slug,
                    title,
                FROM classroom_group
                WHERE
                    classroom_id = ${classroomId}
                LIKE
                    '%${title}$'
                `;

                return {
                    status: 'success',
                    data: group,
                    default_group: defaultGroup.slug,
                };
            }, {
                query : t.Object({
                    title : t.String(),
                })
            })
            .group('/:groupSlug', (subapp) =>
                subapp
                    .get('/members', async ({ params, user, session, set }) => {
                        if (!user || !session) {
                            set.status = 401;
                            return {
                                status: 'error',
                                message:
                                    'Unauthenticated, Please sign in and try again',
                            };
                        }

                        const { groupSlug, slug } = params;

                        const group = await sql`
                        SELECT
                            classroom_group.id
                        FROM classroom_group
                        INNER JOIN classroom
                            ON classroom.id = classroom_group.classroom_id
                        INNER JOIN teach
                            ON teach.classroom_id = classroom.id
                        WHERE
                            classroom.slug = ${slug} AND
                            classroom_group.slug = ${groupSlug} AND
                            teach.user_id = ${user.id}
                        `;

                        if (group.length === 0) {
                            set.status = 404;

                            return {
                                status: 'error',
                                message:
                                    'Group not found or you are not the teacher of this classroom.',
                            };
                        }

                        const { id: groupId } = group[0];

                        const members = await sql`
                            SELECT
                                auth_user.id,
                                auth_user.first_name AS "firstName",
                                auth_user.last_name AS "lastName",
                                auth_user.email,
                                auth_user.phone_number AS "phoneNumber"
                            FROM classroom_group_member
                            INNER JOIN auth_user
                                ON auth_user.id = classroom_group_member.user_id
                            WHERE group_id = ${groupId}
                        `;

                        return {
                            status: 'success',
                            data: members,
                        };
                    })
                    .post( '/adduser', async ({ params, user, session, set, body }) => {
                            if (!user || !session) {
                                set.status = 401;
                                return {
                                    status: 'error',
                                    message:
                                        'Unauthenticated, Please sign in and try again',
                                };
                            }

                            const { groupSlug, slug } = params;

                            const group = await sql`
                            SELECT
                                classroom_group.id,
                                classroom.default_group
                            FROM classroom_group
                            INNER JOIN classroom
                                ON classroom.id = classroom_group.classroom_id
                            INNER JOIN teach
                                ON teach.classroom_id = classroom.id
                            WHERE
                                classroom.slug = ${slug} AND
                                classroom_group.slug = ${groupSlug} AND
                                teach.user_id = ${user.id}
                            `;

                            if (group.length === 0) {
                                set.status = 404;

                                return {
                                    status: 'error',
                                    message:
                                        'Group not found or you are not the teacher of this classroom.',
                                };
                            }

                            const { id: groupId, default_group: defaultGroup } =
                                group[0];
                            const { user_id: studentId } = body;

                            if (groupId === defaultGroup) {
                                set.status = 400;

                                return {
                                    status: 'error',
                                    message:
                                        'You cannot change the member of the default group.',
                                };
                            }

                            await sql`
                            INSERT INTO classroom_group_member
                                (group_id, user_id, added_by_teacher)
                            VALUES
                                (${groupId}, ${studentId}, ${user.id})
                            `;

                            return {
                                status: 'success',
                            };
                        },
                        {
                            body: t.Object({
                                user_id: t.String(),
                            }),
                        },
                    )
                    .post( '/removeuser', async ({ params, user, session, set, body }) => {
                            if (!user || !session) {
                                set.status = 401;
                                return {
                                    status: 'error',
                                    message:
                                        'Unauthenticated, Please sign in and try again',
                                };
                            }

                            const { groupSlug, slug } = params;

                            const group = await sql`
                            SELECT
                                classroom_group.id,
                                classroom.default_group
                            FROM classroom_group
                            INNER JOIN classroom
                                ON classroom.id = classroom_group.classroom_id
                            INNER JOIN teach
                                ON teach.classroom_id = classroom.id
                            WHERE
                                classroom.slug = ${slug} AND
                                classroom_group.slug = ${groupSlug} AND
                                teach.user_id = ${user.id}
                            `;

                            if (group.length === 0) {
                                set.status = 404;

                                return {
                                    status: 'error',
                                    message:
                                        'Group not found or you are not the teacher of this classroom.',
                                };
                            }

                            const { id: groupId, default_group: defaultGroup } =
                                group[0];
                            const { user_id: studentId } = body;

                            if (groupId === defaultGroup) {
                                set.status = 400;

                                return {
                                    status: 'error',
                                    message:
                                        'You cannot change the member of the default group.',
                                };
                            }

                            await sql`
                            DELETE FROM 
                                classroom_group_member
                            WHERE
                                group_id = ${groupId} AND
                                user_id = ${studentId};
                            `;

                            return {
                                status: 'success',
                            };
                        },
                        {
                            body: t.Object({
                                user_id: t.String(),
                            }),
                        },
                    )
                    .post('/delete', async ({ user, session, set, params }) => {
                        if (!user || !session) {
                            set.status = 401;
                            return {
                                status: 'error',
                                message:
                                    'Unauthenticated, Please sign in and try again',
                            };
                        }

                        const { groupSlug, slug } = params;

                        const group = await sql`
                            SELECT
                                classroom_group.id,
                                classroom_group.title
                            FROM classroom_group
                            INNER JOIN classroom
                                ON classroom.id = classroom_group.classroom_id
                            INNER JOIN teach
                                ON teach.classroom_id = classroom.id
                            WHERE
                                classroom.slug = ${slug} AND
                                classroom_group.slug = ${groupSlug} AND
                                teach.user_id = ${user.id}
                            `;

                        if (group.length === 0) {
                            set.status = 404;

                            return {
                                status: 'error',
                                message:
                                    'Group not found or you are not the teacher of this classroom.',
                            };
                        }

                        const { id: groupId, title } = group[0];

                        await sql`
                        DELETE FROM classroom_group
                        WHERE id = ${groupId};
                        `;

                        return {
                            status: 'success',
                            message: `${title} group has been deleted.`,
                        };
                    }),
            ),
);

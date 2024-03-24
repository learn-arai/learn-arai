import { Elysia, t } from 'elysia';

import { sql } from '@/lib/db';
import { generateSlug } from '@/lib/utils';
import { middleware } from '@/src/middleware';

export const classroomGroupRoute = new Elysia({ prefix: '/c' })
    .use(middleware)
    .ws('/:group_slug/g/chat', {
        async open(ws) {
            const { user, session, params : {
                group_slug : string
            } } = ws.data;
            if (!user || !session) {
                ws.send({
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                });
                ws.close();
                return;
            }

            const chatHistory = await sql`
                SELECT 
                    content,
                    created_at,
                    created_by
                FROM group_message
                WHERE group_slug = ${ ws.data.params.group_slug }
            `

            const usernameRecords = await sql`
                SELECT DISTINCT
                    auth_user.id,
                    auth_user.first_name,
                    auth_user.last_name
                FROM auth_user INNER JOIN group_message
                ON group_message.created_by = auth_user.id
            `

            let usernames : {
                [key : string] : string
            } = {};

            // transfer username records to a dictionary
            for ( let i = 0; i < usernameRecords.length; i++ ) {
                const key : string = usernameRecords[i].id;
                usernames[key] = usernameRecords[i].first_name + ' ' + usernameRecords[i].last_name;
            }

            for ( const message of chatHistory ) {
                ws.send( {
                    message : message.content,
                    created_at : message.created_at,
                    created_by : usernames[message.created_by]
                } )
            }

            ws.subscribe( ws.data.params.group_slug );
        },

        async message( ws, message ) {
            const { user, session, params : {
                group_slug : string
            } } = ws.data;

            const groupSlug = ws.data.params.group_slug;

            if (!user || !session) {
                ws.send({
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                });
                ws.close();
                return;
            }

            const usernameRecords = await sql`
                SELECT DISTINCT
                    auth_user.id,
                    auth_user.first_name,
                    auth_user.last_name
                FROM auth_user INNER JOIN group_message
                ON group_message.created_by = auth_user.id
            `

            let usernames : {
                [key : string] : string
            } = {};

            await sql`
                INSERT INTO group_message
                    ( content, created_by, group_slug )
                VALUES
                    ( ${ (message as { message : string, type : string }).message }, ${ user.id }, ${ groupSlug.toString() } )
            `;

            for ( let i = 0; i < usernameRecords.length; i++ ) {
                const key : string = usernameRecords[i].id;
                usernames[key] = usernameRecords[i].first_name + ' ' + usernameRecords[i].last_name;
            }

            ws.send({
                message : (message as { message : string, type : string }).message,
                created_at : new Date(),
                created_by : usernames[user.id]
            } );

            ws.publish(groupSlug, {
                message : (message as { message : string, type : string }).message,
                created_at : new Date(),
                created_by : usernames[user.id]
            } );
        }

    })
    .group('/:slug/g', (app) =>
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

                    const [newGroup] = await sql`
                    INSERT INTO classroom_group
                        (title, classroom_id, created_by, slug)
                    VALUES
                        (${title}, ${classroomId}, ${user.id}, ${groupSlug})
                    RETURNING id
                    `;

                    await sql`
                    INSERT INTO classroom_group_member
                        (group_id, user_id, added_by_teacher)
                    VALUES
                        (${newGroup.id}, ${user.id}, ${user.id})
                    `

                    return {
                        status: 'success',
                        message: 'Group has been created and you have been added to this group.',
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
            .get(
                '/list',
                async ({ user, session, set, params, query }) => {
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

                    const { group_title } = query;
                    const [defaultGroup] = await sql`
                    SELECT
                        slug
                    FROM classroom_group
                    WHERE id = ${defaultGroupId}`;

                    const group = !group_title
                        ? await sql`
                        SELECT
                            slug,
                            title,
                            created_at AS "createdAt",
                            created_by AS "createdBy"
                        FROM classroom_group
                        WHERE classroom_id = ${classroomId}
                        `
                        : await sql`
                        SELECT 
                            slug,
                            title
                        FROM classroom_group
                        WHERE
                            classroom_id = ${classroomId} AND
                            title LIKE ${group_title + '%'};
                        `;

                    return {
                        status: 'success',
                        data: group,
                        default_group: defaultGroup.slug,
                    };
                },
                {
                    query: t.Object({
                        group_title: t.Optional(t.String()),
                    }),
                },
            )
            .get('/list/self-joined-group', async ({ user, session, set, params }) => {
                if (!user || !session) {
                    set.status = 401;
                    return {
                        status: 'error',
                        message:
                            'Unauthenticated, Please sign in and try again',
                    };
                }

                const { slug } = params;

                const [classroomID] = await sql`
                    SELECT 
                        id
                    FROM classroom
                    WHERE slug = ${slug}
                `

                const GroupLists = await sql`
                    SELECT 
                        classroom_group.slug,
                        classroom_group.title
                    FROM classroom_group INNER JOIN classroom_group_member
                    ON classroom_group.id = classroom_group_member.group_id
                    WHERE classroom_group.classroom_id = ${classroomID.id}
                          AND  classroom_group_member.user_id = ${user.id}
                `

                return {
                    status: 'success',
                    data: GroupLists
                }
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
                            classroom_group.slug = ${groupSlug} 
                        `;

                        if (group.length === 0) {
                            set.status = 404;

                            return {
                                status: 'error',
                                message:
                                    'Group not found.',
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
                    .post(
                        '/adduser',
                        async ({ params, user, session, set, body }) => {
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
                    .post(
                        '/removeuser',
                        async ({ params, user, session, set, body }) => {
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

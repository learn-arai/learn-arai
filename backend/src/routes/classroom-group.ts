import { Elysia, t } from 'elysia';

import { sql } from '@/lib/db';
import { generateSlug } from '@/lib/utils';
import { middleware } from '@/src/middleware';

export const classroomGroupRoute = new Elysia({ prefix: '/c' })
    .use(middleware)
    .ws('/:group_slug/g/chat', {
        async open(ws) {
            const {
                user,
                session,
                params: { group_slug: groupSlug },
            } = ws.data;

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
            WHERE group_slug = ${groupSlug}
            `;

            const usernameRecords = await sql`
            SELECT DISTINCT
                auth_user.id,
                auth_user.first_name || ' ' || auth_user.last_name AS "fullName"
            FROM auth_user
            INNER JOIN group_message
                ON group_message.created_by = auth_user.id
            `;

            let usernames: {
                [key: string]: string;
            } = {};

            // transfer username records to a dictionary
            for (let i = 0; i < usernameRecords.length; i++) {
                const key: string = usernameRecords[i].id;
                usernames[key] = usernameRecords[i].fullName;
            }

            for (const message of chatHistory) {
                ws.send({
                    message: message.content,
                    created_at: message.created_at,
                    created_by: usernames[message.created_by],
                });
            }

            ws.subscribe(groupSlug);
        },
        async message(ws, message) {
            const {
                user,
                session,
                params: { group_slug: groupSlug },
            } = ws.data;

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
            `;

            let usernames: {
                [key: string]: string;
            } = {};

            await sql`
                INSERT INTO group_message
                    ( content, created_by, group_slug )
                VALUES
                    ( ${(message as { message: string; type: string }).message}, ${user.id}, ${groupSlug.toString()} )
            `;

            for (let i = 0; i < usernameRecords.length; i++) {
                const key: string = usernameRecords[i].id;
                usernames[key] =
                    usernameRecords[i].first_name +
                    ' ' +
                    usernameRecords[i].last_name;
            }

            ws.send({
                message: (message as { message: string; type: string }).message,
                created_at: new Date(),
                created_by: usernames[user.id],
            });

            ws.publish(groupSlug, {
                message: (message as { message: string; type: string }).message,
                created_at: new Date(),
                created_by: usernames[user.id],
            });
        },
    })
    .group('/:slug/g', (app) =>
        app
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
                    RETURNING id
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
            .get(
                '/list',
                async ({ user, session, set, params, query }) => {
                    let isFromStudent = false;

                    if (!user || !session) {
                        set.status = 401;
                        return {
                            status: 'error',
                            message:
                                'Unauthenticated, Please sign in and try again',
                        };
                    }

                    const { slug } = params;

                    let classroom = { classroom_id: '', default_group: '' };
                    //TODO : after having teacher or student context, need to change this logic
                    // In case that is not teacher classroom will be empty, then query in student case.
                    [classroom] = await sql`
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

                    if (!classroom) {
                        isFromStudent = true;

                        [classroom] = await sql`
                        SELECT
                            classroom.id AS classroom_id,
                            classroom.default_group
                        FROM classroom
                        INNER JOIN study
                            ON classroom.id = study.classroom_id
                        WHERE
                            classroom.slug = ${slug} AND
                            study.user_id = ${user.id}
                        `;
                    }

                    if (!classroom) {
                        set.status = 404;

                        return {
                            status: 'error',
                            message: 'Classroom not found.',
                        };
                    }

                    const {
                        classroom_id: classroomId,
                        default_group: defaultGroupId,
                    } = classroom;

                    const { group_title } = query;
                    const [defaultGroup] = await sql`
                    SELECT
                        slug
                    FROM classroom_group
                    WHERE id = ${defaultGroupId}`;

                    let group = [];

                    if (group_title) {
                        group = await sql`
                        SELECT 
                            slug,
                            title
                        FROM classroom_group
                        WHERE
                            classroom_id = ${classroomId} AND
                            title LIKE ${group_title + '%'};
                        `;
                    } else if (isFromStudent) {
                        group = await sql`
                        SELECT 
                            slug,
                            Title
                        FROM classroom_group
                        WHERE 
                            classroom_id = ${classroomId} AND
                            id IN
                        (SELECT
                            group_id
                        FROM classroom_group_member
                        WHERE user_id = ${user.id})
                        `;
                    } else {
                        group = await sql`
                        SELECT
                            slug,
                            title,
                            created_at AS "createdAt",
                            created_by AS "createdBy"
                        FROM classroom_group
                        WHERE classroom_id = ${classroomId}`;
                    }

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
            .group('/:groupSlug', (subapp) =>
                subapp
                    .get(
                        '/members',
                        async ({ params, user, session, set, query }) => {
                            if (!user || !session) {
                                set.status = 401;
                                return {
                                    status: 'error',
                                    message:
                                        'Unauthenticated, Please sign in and try again',
                                };
                            }

                            const { groupSlug, slug } = params;

                            //TODO : after having teacher or student context, need to change this logic
                            const nameList = await sql`
                            SELECT
                                auth_user.first_name || ' ' || auth_user.last_name AS "fullName"
                            FROM classroom_group_member
                            INNER JOIN auth_user
                                ON auth_user.id = classroom_group_member.user_id
                            WHERE group_id = (
                            SELECT
                                classroom_group.id
                            FROM classroom_group
                            INNER JOIN classroom
                                ON classroom.id = classroom_group.classroom_id
                            INNER JOIN classroom_group_member
                                ON classroom_group_member.group_id = classroom_group.id
                            WHERE
                                classroom.slug = ${slug} AND
                                classroom_group.slug = ${groupSlug} AND
                                classroom_group_member.user_id = ${user.id})
                        `;

                            if (nameList.length > 0) {
                                return {
                                    status: 'success',
                                    data: nameList,
                                };
                            }

                            const [group] = await sql`
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

                            if (!group) {
                                set.status = 404;

                                return {
                                    status: 'error',
                                    message: 'Group not found.',
                                };
                            }

                            const { id: groupId } = group;

                            const members = await sql`
                        SELECT
                            auth_user.id,
                            auth_user.first_name AS "firstName",
                            auth_user.last_name AS "lastName",
                            auth_user.first_name || ' ' || auth_user.last_name AS "fullName",
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
                        },
                        {
                            query: t.Object({
                                is_student: t.Optional(t.String()),
                            }),
                        },
                    )
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

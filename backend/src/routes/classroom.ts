import { Elysia, t } from 'elysia';

import { sql, uploadFile } from '@/lib/db';
import { generateSlug } from '@/lib/utils';
import postgres from 'postgres';

import { middleware } from '../middleware';

export const classroomRoute = new Elysia({ prefix: '/c' })
    .use(middleware)
    .post(
        '/create',
        async ({ body, user, session, set }) => {
            if (!user || !session) {
                set.status = 401;
                return {
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                };
            }

            const name = body.name;
            const description = body.description;
            const thumbnail = body.thumbnail as File;
            const teacherId = user.id as string;

            if (!name) {
                return {
                    status: 'error',
                    message: 'Name is required!',
                };
            }

            // TODO: If user's is free plan, check if they have reached the limit of classrooms they can create
            const classroom = await sql.begin(async (tx) => {
                let uploadStatus;
                if (thumbnail && thumbnail.size > 0) {
                    uploadStatus = await uploadFile(thumbnail, user.id, {
                        public: true,
                        allowType: 'image',
                    });

                    if (uploadStatus.status === 'error') {
                        throw new Error(uploadStatus.message);
                    }
                }

                const thumbnailId = uploadStatus?.id || null;
                const slug = generateSlug();

                // Add classroom
                const [classroom] = await tx`
                INSERT INTO 
                    classroom(name, description, created_by, thumbnail, slug)
                VALUES
                    (${name}, ${description}, ${teacherId}, ${thumbnailId}, ${slug})
                RETURNING
                    id,
                    slug,
                    name,
                    description,
                    created_at AS createdAt,
                    created_by AS createdBy;
                `;

                // Add urself as teacher
                await tx`
                INSERT INTO
                    teach(classroom_id, user_id, added_by)
                VALUES
                    (${classroom.id}, ${teacherId}, NULL)
                `;

                // Add default group
                const [group] = await tx`
                INSERT INTO classroom_group
                    (slug, classroom_id, title, created_by)
                VALUES
                    (${generateSlug()}, ${classroom.id}, 'General', ${user.id})
                RETURNING
                    id;
                `;

                await tx`
                UPDATE classroom
                SET default_group = ${group.id}
                WHERE id = ${classroom.id}`;

                delete classroom.id;

                return {
                    data: classroom,
                    thumbnail: uploadStatus?.url || '',
                };
            });

            return {
                status: 'success',
                data: {
                    classroom: classroom.data,
                    thumbnail: classroom.thumbnail,
                },
            };
        },
        {
            body: t.Object({
                name: t.String(),
                description: t.String(),
                thumbnail: t.File(),
            }),
        },
    )
    .post(
        '/join-classroom',
        async ({ body, user, session, set }) => {
            if (!user || !session) {
                set.status = 401;
                return {
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                };
            }

            const { classroom_code: joinCode } = body;

            const codeRecord = await sql`
            SELECT
                classroom_invite_code.id,
                classroom_invite_code.classroom_id,
                classroom_invite_code.expires_at,
                classroom.slug
            FROM classroom_invite_code
            INNER JOIN classroom
                ON classroom_invite_code.classroom_id = classroom.id
            WHERE
                classroom_invite_code.code = ${joinCode};
            `;

            if (codeRecord.length == 0) {
                return {
                    status: 'error',
                    message: 'Invalid code, please check and try again.',
                };
            }

            const expiresAt = new Date(codeRecord[0].expires_at).getTime();
            const currentTime = new Date().getTime();

            if (expiresAt < currentTime) {
                return {
                    status: 'error',
                    message:
                        'This code have already expired, please contact your teacher.',
                };
            }

            const userId = user.id;
            const {
                slug,
                id: codeId,
                classroom_id: classroomId,
            } = codeRecord[0];

            // TODO : if the code is assigned to for the group that this user haven;t joined yet
            // TODO : but they already joined this class.
            // TODO : just add them to the group.
            // ? : should I do this one.

            try {
                await sql.begin(async (tx) => {
                    await tx`
                    INSERT INTO study
                        (classroom_id, user_id)
                    VALUES
                        (${classroomId}, ${userId})
                    `;

                    // Add student to group
                    await tx`
                    INSERT INTO classroom_group_member
                        (group_id, user_id, added_by_invide_code)
                    SELECT
                        group_id, ${userId}, ${codeId}
                    FROM classroom_invite_code_group
                    WHERE code_id = ${codeId}`;
                });
            } catch (error) {
                if (
                    error instanceof postgres.PostgresError &&
                    error.code === '23505'
                ) {
                    if (error.constraint_name == 'study_pkey') {
                        return {
                            status: 'error',
                            message: 'You have already joined this classroom.',
                        };
                    }
                }
            }

            return {
                status: 'success',
                message: 'You have joined the classroom.',
                slug: slug,
            };
        },
        {
            body: t.Object({
                classroom_code: t.String(),
            }),
        },
    )
    .post(
        '/:slug/create-invite-code',
        async ({ body, params, user, session, set }) => {
            if (!user || !session) {
                set.status = 401;
                return {
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                };
            }

            //TODO : only teacher can create an invite code.
            //TODO : display create invite button for teacher only.
            // console.log('it is working');
            const { slug } = params;
            const { group_slug: groupSlugStr } = body;

            const [classroom] = await sql`
            SELECT id
                FROM classroom
            INNER JOIN teach
                ON teach.classroom_id = classroom.id
            WHERE
                slug = ${slug} AND
                teach.user_id = ${user.id}
            `;

            if (!classroom) {
                return {
                    status: 'error',
                    message: 'Classroom not found.',
                };
            }

            const classroomId = classroom.id;
            const code = generateSlug(6);
            const expiresTime = new Date(new Date().getTime() + 30 * 60 * 1000); // 30 minutes

            await sql.begin(async (tx) => {
                // ['xx', 'yy', ''yy]

                const [invite] = await tx`
                INSERT INTO classroom_invite_code
                    (classroom_id, code, expires_at)
                VALUES
                    (${classroomId}, ${code}, ${expiresTime})
                RETURNING id
                `;

                const groupSlugArray = JSON.parse(groupSlugStr);

                if (groupSlugArray.length > 0) {
                    for (const groupSlug of groupSlugArray) {
                        await tx`
                        INSERT INTO classroom_invite_code_group
                            (code_id, group_id)
                        SELECT
                            ${invite.id}, classroom_group.id
                        FROM classroom_group
                        WHERE classroom_group.slug = ${groupSlug}
                        `;
                    }
                }

                await tx`
                INSERT INTO classroom_invite_code_group
                    (code_id, group_id)
                SELECT
                    ${invite.id}, classroom.default_group
                FROM classroom
                WHERE classroom.id = ${classroomId}
                `;
            });

            return {
                status: 'success',
                message: 'Invitation code has been created.',
                invite_code: code,
            };
        },
        {
            body: t.Object({
                group_slug: t.String(),
            }),
            params: t.Object({
                slug: t.String(),
            }),
        },
    )
    .get('my-classroom', async ({ user, session, set }) => {
        if (!user || !session) {
            set.status = 401;
            return {
                status: 'error',
                message: 'Unauthenticated, Please sign in and try again',
            };
        }

        const studyRoom = await sql`
        (SELECT
            slug, name,
            description,
            created_at AS "createdAt",
            created_by AS "createdBy"
        FROM classroom
        INNER JOIN teach
            ON teach.classroom_id = classroom.id
        WHERE
            teach.user_id = ${user.id})
        UNION
        (SELECT
            slug, name,
            description,
            created_at AS "createdAt",
            created_by AS "createdBy"
        FROM classroom
        INNER JOIN study
            ON study.classroom_id = classroom.id
        WHERE
            study.user_id = ${user.id})
        `;

        return {
            status: 'success',
            data: studyRoom,
        };
    })
    .get(
        '/:slug/members',
        async ({ user, session, set, params, query }) => {
            if (!user || !session) {
                set.status = 401;
                return {
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                };
            }

            const { slug } = params;

            const [study] = await sql`
            SELECT classroom.id
            FROM study
            INNER JOIN classroom
                ON study.classroom_id = classroom.id
            WHERE
                study.user_id = ${user.id} AND
                classroom.slug = ${slug}
            `;

            const [teach] = await sql`
            SELECT classroom.id
            FROM teach
            INNER JOIN classroom
                ON teach.classroom_id = classroom.id
            WHERE
                teach.user_id = ${user.id} AND
                classroom.slug = ${slug}
            `;

            if (!study && !teach) {
                return {
                    status: 'error',
                    message: 'You are not a member of this classroom.',
                };
            }

            const { id: classroomId } = study || teach;
            const {
                student_only: studentOnly,
                search_query: searchQuery,
                limit,
            } = query;
            const studentOnlyFlag: boolean = studentOnly == '1';
            if (limit && isNaN(Number(limit))) {
                return {
                    status: 'error',
                    message: 'Invalid limit value.',
                };
            }
            const limitNumber = Number(limit);

            const student = !searchQuery
                ? await sql`
            SELECT
                auth_user.id,
                auth_user.first_name AS "firstName",
                auth_user.last_name AS "lastName",
                auth_user.email,
                auth_user.phone_number AS "phoneNumber"
            FROM study
            INNER JOIN auth_user
                ON study.user_id = auth_user.id
            WHERE
                study.classroom_id = ${classroomId}
            ${limit === undefined ? sql`LIMIT ALL` : sql`LIMIT ${limitNumber}`}
            `
                : await sql`
            SELECT
                auth_user.id,
                auth_user.first_name AS "firstName",
                auth_user.last_name AS "lastName",
                auth_user.email,
                auth_user.phone_number AS "phoneNumber"
            FROM study
            INNER JOIN auth_user
                ON study.user_id = auth_user.id
            WHERE
                study.classroom_id = ${classroomId} AND
                (
                    auth_user.email LIKE ${'%' + searchQuery + '%'} OR
                    auth_user.phone_number LIKE ${'%' + searchQuery + '%'} OR
                    auth_user.first_name || ' ' || auth_user.last_name
                        LIKE ${'%' + searchQuery + '%'}
                )
            ${limit === undefined ? sql`LIMIT ALL` : sql`LIMIT ${limitNumber}`}
            `;
            //TODO: Searching should be a Full Text Search (FTS)

            let teacher: any[] = [];
            if (!studentOnlyFlag) {
                teacher = await sql`
                SELECT
                    auth_user.id,
                    auth_user.first_name AS "firstName",
                    auth_user.last_name AS "lastName",
                    auth_user.email,
                    auth_user.phone_number AS "phoneNumber"
                FROM teach
                INNER JOIN auth_user
                    ON teach.user_id = auth_user.id
                WHERE
                    teach.classroom_id = ${classroomId}
                ${limit === undefined ? sql`LIMIT ALL` : sql`LIMIT ${limitNumber}`}
                `;
            }

            return {
                status: 'success',
                data: {
                    student,
                    teacher,
                },
            };
        },
        {
            params: t.Object({
                slug: t.String(),
            }),
            query: t.Object({
                student_only: t.Optional(t.String()),
                search_query: t.Optional(t.String()),
                limit: t.Optional(t.String()),
            }),
        },
    )
    .get(
        '/:slug/detail',
        async ({ user, session, set, params }) => {
            if (!user || !session) {
                set.status = 401;
                return {
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                };
            }

            const { slug } = params;

            const [study] = await sql`
            SELECT
                classroom.name,
                classroom.description,
                classroom.created_at,
                classroom.created_by AS created_by_id
            FROM study
            INNER JOIN classroom
                ON study.classroom_id = classroom.id
            WHERE
                study.user_id = ${user.id} AND
                classroom.slug = ${slug}
            `;

            const [teach] = await sql`
            SELECT
                classroom.name,
                classroom.description,
                classroom.created_at,
                classroom.created_by AS created_by_id
            FROM teach
            INNER JOIN classroom
                ON teach.classroom_id = classroom.id
            WHERE
                teach.user_id = ${user.id} AND
                classroom.slug = ${slug}
            `;

            if (!study && !teach) {
                return {
                    status: 'error',
                    message: 'You are not a member of this classroom.',
                };
            }

            const {
                name,
                description,
                created_at: createdAt,
                created_by_id: createdById,
            } = study || teach;

            const [createdBy] = await sql`
            SELECT
                first_name,
                last_name,
                email
            FROM auth_user
            WHERE id = ${createdById}
            `;

            return {
                status: 'success',
                data: {
                    name,
                    description,
                    created_at: createdAt,
                    created_by: createdBy,
                    type: study ? 'student' : 'teacher',
                },
            };
        },
        {
            params: t.Object({
                slug: t.String(),
            }),
        },
    )
    .get('/:slug/thumbnail', async ({ set, params }) => {
        const { slug } = params;

        const [classroom] = await sql`
        SELECT thumbnail
        FROM classroom
        WHERE slug = ${slug}
        `;

        if (!classroom) {
            set.status = 404;
            return {
                status: 'error',
                message: 'Classroom not found',
            };
        }

        const { thumbnail } = classroom;
        set.redirect = `/file/${thumbnail}`;
    });

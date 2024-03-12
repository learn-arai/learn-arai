import { Elysia, t } from 'elysia';

import { sql, uploadFile } from '@/lib/db';
import { generateSlug } from '@/lib/utils';

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

            if (!name || !description) {
                return {
                    status: 'error',
                    message: 'Name and description are required!',
                };
            }

            // TODO: If user's is free plan, check if they have reached the limit of classrooms they can create
            const classroom = await sql.begin(async (tx) => {
                let uploadStatus;
                if (thumbnail && thumbnail.size > 0) {
                    uploadStatus = await uploadFile(thumbnail, user.id, {
                        public: true,
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
                await tx`
                INSERT INTO classroom_group
                    (slug, classroom_id, title, created_by)
                VALUES
                    (${generateSlug()}, ${classroom.id}, 'General', ${user.id});
                `;

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
                        'This code is expired, please contact your teacher.',
                };
            }

            const userId = user.id;
            const {
                slug,
                id: codeId,
                classroom_id: classroomId,
            } = codeRecord[0];

            console.log({ slug, codeId, classroomId });

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
        async ({ body, params }) => {
            //TODO : only teacher can create an invite code.
            //TODO : display create invite button for teacher only.

            const { slug } = params;
            const { group_id: groupIdStr } = body;

            const [classroom] = await sql`
            SELECT id
                FROM classroom
            WHERE slug = ${slug}
            `;

            const classroomId = classroom.id;
            const code = generateSlug(6);
            const expiresTime = new Date(new Date().getTime() + 30 * 60 * 1000); // 30 minutes

            await sql.begin(async (tx) => {
                // ['xx', 'yy', ''yy]
                const groupIdArray = JSON.parse(groupIdStr);

                const [invite] = await tx`
                INSERT INTO classroom_invite_code
                    (classroom_id, code, expires_at)
                VALUES
                    (${classroomId}, ${code}, ${expiresTime})
                RETURNING id
                `;

                for (const groupId of groupIdArray) {
                    await tx`
                    INSERT INTO classroom_invite_code_group
                        (code_id, group_id)
                    VALUES
                        (${invite.id}, ${groupId})
                    `;
                }
            });

            return {
                status: 'success',
                message: 'Invitation code has been created.',
                invite_code: code,
            };
        },
        {
            body: t.Object({
                group_id: t.String(),
            }),
            params: t.Object({
                slug: t.String(),
            }),
        },
    );

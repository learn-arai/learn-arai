import { Elysia, t } from 'elysia';

import { sql, uploadFile } from '@/lib/db';
import { generateSlug } from '@/lib/utils';

import { middleware } from '../middleware';

export const classroomRoute = new Elysia({ prefix: '/classroom' })
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

                await tx`
                    INSERT INTO
                        teach(classroom_id, user_id, added_by)
                    VALUES
                        (${classroom.id}, ${teacherId}, NULL)
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

            const joiningCode = body.classroom_code;

            const codeRecord = await sql`
            SELECT 
                classroom_id, expires_at, section
            FROM classroom_invite_code
            WHERE code = ${joiningCode}
            `;

            if (codeRecord.length == 0) {
                return {
                    status: 'error',
                    message: 'There is no classroom, please recheck the code.',
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

            const studentSection = [codeRecord[0].section];

            const userId = user.id;

            const classroomId = codeRecord[0].classroom_id;

            const isAlreadyJoined = await sql`
            SELECT
                classroom_id, user_id
            FROM study
            WHERE
                classroom_id = ${classroomId} AND 
                user_id = ${userId}
            `;

            if (isAlreadyJoined.length != 0) {
                return {
                    status: 'error',
                    message: 'You have already joined the class.',
                };
            }

            await sql`
            INSERT INTO study 
                (user_id, section, classroom_id)
            VALUES
                (${userId}, ${studentSection}, ${classroomId})
            `;

            const [slugRecords] = await sql`
            SELECT
                slug
            FROM classroom
            WHERE id = ${classroomId}
            `;
            const slug = slugRecords.slug;
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
        '/create-invite-code',
        async ({ body }) => {
            //TODO : only teacher can create an invite code.
            //TODO : display create invite button for teacher only.

            const slug = body.slug;
            const [classroomRecord] = await sql`
            SELECT id
                FROM classroom
            WHERE slug = ${slug}
            `;

            const classroomId = classroomRecord.id;

            const code = generateSlug(6);
            const expiresTime = new Date(new Date().getTime() + 30 * 60 * 1000);
            await sql`
            INSERT INTO classroom_invite_code
                (classroom_id, code, expires_at)
            VALUES
                (${classroomId}, ${code}, ${expiresTime}})
            `;

            return {
                status: 'success',
                message: 'Invitation code has been created.',
                invite_code: code,
            };
        },
        {
            body: t.Object({
                slug: t.String(),
                section: t.String(),
            }),
        },
    )
    .post(
        '/:slug/group/create',
        async ({ params, user, session, set, body }) => {
            if (!user || !session) {
                set.status = 401;
                return {
                    status: 'error',
                    message: 'Unauthenticated, Please sign in and try again',
                };
            }

            const { slug } = params;

            const classroom = await sql`
            SELECT
                *
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
    );

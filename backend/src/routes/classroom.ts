import { Elysia, t } from 'elysia';

import { sql, uploadFile } from '@/lib/db';

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

            const classroom = await sql.begin(async (tx) => {
                let uploadStatus;
                if (thumbnail) {
                    uploadStatus = await uploadFile(thumbnail, user.id, {
                        public: true,
                    });

                    if (uploadStatus.status === 'error') {
                        throw new Error(uploadStatus.message);
                    }
                }

                const thumbnailId = uploadStatus?.id || 'NULL';

                const [classroom] = await tx`
                    INSERT INTO 
                        classroom(name, description, created_by, thumbnail)
                    VALUES
                        (${name}, ${description}, ${teacherId}, ${thumbnailId})
                    RETURNING *;
                    `;

                await tx`
                    INSERT INTO
                        teach(classroom_id, user_id, added_by)
                    VALUES
                        (${classroom.id}, ${teacherId}, NULL)
                `;

                return {
                    data: classroom,
                    thumbnail: uploadStatus?.url || '',
                };
            });

            return {
                status: 'success',
                data: {
                    classroom: classroom.data[0],
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
    );

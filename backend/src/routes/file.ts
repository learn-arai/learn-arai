import { Elysia } from 'elysia';

import { sql } from '@/lib/db';
import { fileExtension } from '@/lib/utils';
import { join } from 'node:path';

import { middleware } from '../middleware';

export const fileRoute = new Elysia({ prefix: '/file' })
    .use(middleware)
    .get('/:id', async ({ params: { id }, set, user, session }) => {
        const fileId = id.split('.')[0];

        if (!process.env.UPLOAD_FOLDER) {
            set.status = 500;
            return {
                status: 'error',
                message: 'Upload folder not found!',
            };
        }

        const [file] = await sql`
            SELECT * FROM file
            WHERE id = ${fileId}
        `;

        if (!file) {
            set.status = 404;
            return {
                status: 'error',
                message: 'File not found!',
            };
        }

        if (file.public === false) {
            if (!user || !session) {
                set.status = 401;
                return {
                    status: 'error',
                    message: 'Unauthorized',
                };
            }

            if (file.can_only_access_by_classroom_id != null) {
                set.status = 501;
                return {
                    status: 'error',
                    message: 'Not implement',
                };
            } else if (file.can_only_access_by_group_id != null) {
                // For student, check if the student is in the group
                // For teacher, check if the teacher is in the classroom for that group

                const groupId = file.can_only_access_by_group_id;
                const [studentInGroup] = await sql`
                SELECT
                    *
                FROM classroom_group_member
                WHERE
                    classroom_group_member.group_id = ${groupId} AND
                    classroom_group_member.user_id = ${user.id}
                `;

                const [teacher] = await sql`
                SELECT
                    *
                FROM teach
                INNER JOIN classroom_group ON
                    classroom_group.classroom_id = teach.classroom_id
                WHERE
                    teach.user_id = ${user.id} AND
                    classroom_group.id = ${groupId};
                `;

                if (!studentInGroup && !teacher) {
                    set.status = 401;
                    return {
                        status: 'error',
                        message: 'Unauthorized, you are not in the group and/or classroom',
                    };
                }
            } else {
                set.status = 401;
                return {
                    status: 'error',
                    message: 'Unauthorized',
                };
            }
        }

        const path = join(
            '.',
            process.env.UPLOAD_FOLDER,
            `${fileId}.${fileExtension[file.file_type]}`,
        );

        const fileContent = Bun.file(path);
        set.headers['Content-Type'] = file.file_type;
        return fileContent;
    });

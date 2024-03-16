import { Elysia } from 'elysia';

import { sql } from '@/lib/db';
import { fileExtension } from '@/lib/utils';
import { join } from 'node:path';

import { middleware } from '../middleware';

export const fileRoute = new Elysia({ prefix: '/file' })
    .use(middleware)
    .get('/:id', async ({ params: { id }, set }) => {
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
            if (file.can_only_access_by_classroom_id != null) {
                set.status = 501;
                return {
                    status: 'error',
                    message: 'Not implement',
                };
            } else if (file.can_only_access_by_group_id != null) {
                set.status = 501;
                return {
                    status: 'error',
                    message: 'Not implement',
                };
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
        console.log(path);

        const fileContent = Bun.file(path);
        set.headers['Content-Type'] = file.file_type;
        return fileContent;
    });

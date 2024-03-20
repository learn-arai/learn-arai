import { join } from 'node:path';
import postgres from 'postgres';

import { fileExtension, generateSlug, uuidv4 } from './utils';

export const sql = postgres(process.env.DATABASE_URL || '');

export async function uploadFile(
    file: File,
    uploadById: string,
    options: {
        public: boolean;
        maxSize?: number; // in bytes
        canOnlyAccessByClassroom?: string;
        canOnlyAccessByGroup?: string;
        canOnlyAccessByStudent?: string;
    } = {
        public: true,
        maxSize: 1024 * 1024 * 25, // 25MB
    },
): Promise<FileUploadResult> {
    if (file.size === 0) {
        return {
            status: 'error',
            message: 'Empty file!',
        };
    }

    if (!fileExtension[file.type]) {
        return {
            status: 'error',
            message: 'Not supported file type!',
        };
    }

    if (!process.env.UPLOAD_FOLDER) {
        return {
            status: 'error',
            message: 'Upload folder not found!',
        };
    }

    if (options.maxSize && file.size > options.maxSize) {
        return {
            status: 'error',
            message: `File size is too large! (Up to ${options.maxSize}B)`,
        };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const id = uuidv4();
    const fileName = `${id}.${fileExtension[file.type]}`;
    const displayName =
        file.name || `${generateSlug()}.${fileExtension[file.type]}`;

    const path = join('.', process.env.UPLOAD_FOLDER, fileName);
    const url = `/file/${fileName}`;

    const canOnlyAccessByClassroom = options.canOnlyAccessByClassroom || null;
    const canOnlyAccessByGroup = options.canOnlyAccessByGroup || null;
    const canOnlyAccessByStudent = options.canOnlyAccessByStudent || null;

    try {
        await sql.begin(async (tx) => {
            await Bun.write(path, buffer);
            await tx`
                INSERT INTO file
                    (id, uploaded_by, name, file_size, file_type, 
                    public,
                    can_only_access_by_classroom_id,
                    can_only_access_by_group_id,
                    can_only_access_by_student_id)
                VALUES
                    (${id}, ${uploadById}, ${displayName}, ${file.size}, ${file.type},
                    ${options.public},
                    ${canOnlyAccessByClassroom},
                    ${canOnlyAccessByGroup},
                    ${canOnlyAccessByStudent})
            `;
        });
    } catch (error) {
        console.error(error);
        return {
            status: 'error',
            message: 'Failed to upload file!',
        };
    }

    return {
        status: 'success',
        id: id,
        url: url,
    };
}

type FileUploadResult =
    | {
          status: 'error';
          message: string;
      }
    | {
          status: 'success';
          id: string;
          url: string;
      };

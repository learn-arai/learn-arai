import { join } from 'node:path';
import postgres from 'postgres';

import { fileExtension, fileType, generateSlug, uuidv4 } from './utils';

export const sql = postgres(process.env.DATABASE_URL || '');

export async function uploadFile(
    file: File,
    uploadById: string,
    options: {
        allowType?: 'image' | 'pdf' | 'any';
        public: boolean;
        maxSize?: number; // in bytes
        canOnlyAccessByClassroom?: string;
        canOnlyAccessByGroup?: string;
        canOnlyAccessByStudent?: string;
        sql?: typeof sql;
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

    // Default as any
    const allowType = options.allowType || 'any';

    if (allowType !== 'any' && !fileType[allowType].includes(file.type)) {
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

    let fileExt = fileExtension[file.type];
    if (allowType === 'any') {
        if (!file.name.includes('.')) {
            fileExt = 'txt';
        } else {
            const splitArray = file.name.split('.');
            fileExt = splitArray[splitArray.length - 1];
        }
    }

    const id = uuidv4();
    const fileName = `${id}.${fileExt}`;
    const displayName = file.name || `${generateSlug()}.${fileExt}`;

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

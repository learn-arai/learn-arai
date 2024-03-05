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
    .post('/join-classroom', async ( { body, cookie } ) => {
        const joiningCode = (body as { classroomCode: string }).classroomCode;
        const sessionID = cookie.auth_session.value;

        const codeRecord = await sql`
            SELECT classroom_id, expires_at
            FROM classroom_invite_code
            WHERE code = ${joiningCode}
        `

        if ( codeRecord.length == 0 ) {
            return {
                status : 'error',
                message : 'There is no classroom, please recheck the code.'
            }
        }

        const expiresAt = new Date(codeRecord[0].expires_at).getTime();
        const currentTime = new Date().getTime();

        if ( expiresAt < currentTime ){
            return {
                status : 'error',
                message : 'This code is expired, please contact your teacher.'
            }
        }

        const classroomID = codeRecord[0].classroom_id;;

        const classroomRecord = await sql`
            SELECT created_by
            FROM classroom
            WHERE id=${classroomID}
        `
        const userRecord = await sql`
            SELECT auth_user.id 
            FROM auth_user
            INNER JOIN user_session
            ON auth_user.id = user_session.user_id
            WHERE user_session.id=${sessionID}
        `
        const teacherID = classroomRecord[0].created_by;
        const userID = userRecord[0].id;
    
        sql`
            INSERT INTO teach (classroom_id, user_id, added_by)
            VALUES
            (${classroomID},${userID},${teacherID})
        `

        return {
            status : "success",
            message : "You have joined the classroom."
        }
      })
    .post('/create-invite-code', async ( { body, cookie }) => {
        //TODO : only teacher can create an invite code.
        //TODO : display create invite button for teacher only.
        const classroomID = (body as {classroomID : string}).classroomID;
        const sessionID = cookie.auth_session.value;

        const code = generateSlug(6);
        const expiresTime = new Date( new Date().getTime() + 30 * 60 * 1000);
        await sql`
            INSERT INTO classroom_invite_code
            (classroom_id, code, expires_at)
            VALUES
            (${classroomID}, ${code}, ${expiresTime})
        `

        return {
            status : "success",
            message : "Invitation code has been created.",
            code : code
        }
    });

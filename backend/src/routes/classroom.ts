import { Elysia } from 'elysia';

import { sql } from '@/lib/db';

import { middleware } from '../middleware';

export const classroomRoute = new Elysia({ prefix: '/classroom' })
    .use(middleware)
    .post('/create', async ({ request, user, session, set }) => {
        if (!user || !session) {
            set.status = 401;
            return {
                status: 'error',
                message: 'Unauthenticated, Please sign in and try again',
            };
        }

        const formData = await request.formData();

        const name = (formData.get('name') as string) || '';
        const description = (formData.get('description') as string) || '';
        const thumbnail = formData.get('thumbnail') as File;
        const teacherId = user.id as string;

        if (!name || !description) {
            set.status = 400;
            return {
                status: 'error',
                message: 'Name, Description, are required',
            };
        }

        const classroom = await sql`
        INSERT INTO 
            classrooms(name, description, created_by)
        VALUES
            (${name}, ${description}, ${teacherId})
        RETURNING *;
    `;

        return {
            status: 'success',
            classroom: classroom[0],
        };
    });

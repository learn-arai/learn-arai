import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';

import { authRoute } from '@route/auth';

import { classroomRoute } from './routes/classroom';
import { getRoute } from './routes/get';

const app = new Elysia()
    .onError(({ error }) => {
        return {
            status: 'error',
            message: error.message,
        };
    })
    .use(authRoute)
    .use(classroomRoute)
    .get('/', () => 'Hello Elysia world')
    .use(cors())
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

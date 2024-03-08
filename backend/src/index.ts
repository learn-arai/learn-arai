import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';

import { authRoute } from '@route/auth';
import { classroomRoute } from '@route/classroom';
import { fileRoute } from '@route/file';

const app = new Elysia()
    .onError(({ error, code, set }) => {
        set.status = 500;
        let errorMsg = 'Internal server error, please try again later.';
        if (code === 'NOT_FOUND') {
            set.status = 404;
            errorMsg = 'Not found';
        } else {
            console.log({ error, code });
        }

        return {
            status: 'error',
            message: errorMsg,
        };
    })
    .use(authRoute)
    .use(classroomRoute)
    .use(fileRoute)
    .get('/', () => 'Hello Elysia world')
    .use(cors())
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

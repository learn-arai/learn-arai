import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors'
import { authRoute } from '@route/auth';

const app = new Elysia()
    .onError(({ error }) => {
        return {
            status: 'error',
            message: error.message,
        };
    })
    .use(authRoute)
    .use(cors())
    .get('/', () => 'Hello Elysia')
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

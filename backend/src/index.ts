import { Elysia } from 'elysia';
import { authRoute } from './routes/auth';

const app = new Elysia()
    .onError(({ error }) => {
        return {
            status: 'error',
            message: error.message,
        };
    })
    .use(authRoute)
    .get('/', () => 'Hello Elysia')
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

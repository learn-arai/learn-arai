import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';

import { authRoute } from '@route/auth';
import { classroomRoute } from '@route/classroom';
import { classroomAssignmentRoute } from '@route/classroom-assignment';
import { graderRoute } from '@route/classroom-grader';
import { classroomGroupRoute } from '@route/classroom-group';
import { fileRoute } from '@route/file';
import { paymentRoute } from '@route/payment';
import { ticketRoute } from '@route/ticket';

import { cronJob } from './routes/cron';

const app = new Elysia()
    .use(swagger())
    .onError(({ error, code, set }) => {
        set.status = 500;
        let errorMsg = 'Internal server error, please try again later.';
        if (code === 'NOT_FOUND') {
            set.status = 404;
            errorMsg = 'Not found';
        } else if (code === 'VALIDATION') {
            console.error(error);

            set.status = 400;

            const errorMessage = JSON.parse(error.message);
            const errorsArray = [];
            for (let i = 0; i < errorMessage.errors.length; i++) {
                errorsArray.push(errorMessage.errors[i].message);
            }

            return {
                status: 'error',
                errors: errorsArray,
            };
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
    .use(classroomGroupRoute)
    .use(fileRoute)
    .use(ticketRoute)
    .use(paymentRoute)
    .use(classroomRoute)
    .use(classroomGroupRoute)
    .use(classroomAssignmentRoute)
    .use(graderRoute)
    .use(cronJob)
    .get('/', () => 'Hello Elysia world')
    .use(cors())
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

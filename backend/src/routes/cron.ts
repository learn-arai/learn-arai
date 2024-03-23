import { Elysia } from 'elysia'
import { cron } from '@elysiajs/cron'

new Elysia()
    .state("A", "B")
    .use(
        cron({
            name: 'heartbeat',
            pattern: '*/5 * * * * *',
            run() {
                console.log('Heartbeat')
            }
        })
    )
    .get('/', () => 'hello world!')
    .listen(3000)
import { Elysia } from 'elysia'
import { cron } from '@elysiajs/cron'

import { sql } from '@/lib/db';

new Elysia()
    .use(
        cron({
            name: 'delete classroom',
            pattern: '0 0-23/1 * * *',
            async run() {
                try {
                    //TODO: Add notification
                    const result = await sql`DELETE FROM classroom WHERE will_delete_in < NOW() `
                    console.log('Deleted rows:', result)
                  } catch (error) {
                    console.error('Error deleting rows:', error)
                  }
            }
        })
    )
    .listen(3000)
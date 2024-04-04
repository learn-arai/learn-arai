import { cron } from '@elysiajs/cron';
import { Elysia } from 'elysia';

import { sql } from '@/lib/db';

export const cronJob = new Elysia().use(
    cron({
        name: 'delete classroom',
        pattern: '0 0-23/1 * * *',
        async run() {
            try {
                const result =
                    await sql`DELETE FROM classroom WHERE will_delete_in < NOW() `;
                console.log('Deleted rows');
            } catch (error) {
                console.error('Error deleting rows:', error);
            }
        },
    }),
);

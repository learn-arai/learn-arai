import { Elysia } from 'elysia';

import { sql } from '@/lib/db';

const setRoute = new Elysia({ prefix: '/set' }).post(
    '/change-session-expired-date',

    sql`
    
  `,
);

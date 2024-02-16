import { Lucia } from 'lucia';

import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql';
import postgres from 'postgres';

const sql = postgres();

//! different with document
const adapter = new PostgresJsAdapter(sql, {
    user: 'auth_user',
    session: 'user_session',
});

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === 'production',
        },
    },
});

//! different with document
//! IMPORTANT!
declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
    }
}

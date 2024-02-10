import { Lucia } from 'lucia';

import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql';
import { sql } from './db';

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
    getUserAttributes: (attributes) => {
        return {
            email: attributes.email,
        };
    },
});

// IMPORTANT!
declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            email: string;
        };
    }
}

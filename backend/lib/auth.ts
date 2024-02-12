import { Lucia } from 'lucia';

import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql';
import { sql } from './db';
import { TimeSpan, createDate } from 'oslo';
import { generateRandomString, alphabet } from 'oslo/crypto';

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
            emailVerified: attributes.email_verified,
        };
    },
});

export async function generateEmailVerificationCode(
    userId: string,
    email: string
): Promise<string> {
    await sql`DELETE FROM auth_email_verification WHERE user_id = ${userId}`;

    const code = generateRandomString(6, alphabet('0-9'));

    await sql`INSERT INTO auth_email_verification
        (user_id, email, code, expires_at)
    VALUES
        (${userId}, ${email}, ${code}, ${createDate(new TimeSpan(5, 'm'))})
    `;
    
    return code;
}

// IMPORTANT!
declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            email: string;
            email_verified: boolean;
        };
    }
}

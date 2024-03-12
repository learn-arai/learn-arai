import { PostgresJsAdapter } from '@lucia-auth/adapter-postgresql';
import { Lucia, User } from 'lucia';
import { TimeSpan, createDate, isWithinExpirationDate } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';

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
            emailVerified: attributes.email_verified,
            type: attributes.type,
        };
    },
});

export async function generateEmailVerificationCode(
    userId: string,
    email: string,
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

export async function verifyVerificationCode(
    user: User,
    code: string,
): Promise<boolean> {
    return await sql.begin(async (sql) => {
        const verificationCode = await sql`
            SELECT * FROM
                auth_email_verification
            WHERE user_id = ${user.id}`;

        if (
            verificationCode.length === 0 ||
            verificationCode[0].code !== code
        ) {
            return false;
        }

        await sql`DELETE FROM auth_email_verification WHERE code = ${code} AND user_id = ${user.id}`;

        if (!isWithinExpirationDate(verificationCode[0].expires_at)) {
            return false;
        }

        if (verificationCode[0].email !== user.email) {
            return false;
        }

        return true;
    });
}

// IMPORTANT!
declare module 'lucia' {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            email: string;
            email_verified: boolean;
            type: string;
        };
    }
}

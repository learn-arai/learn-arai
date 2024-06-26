import { Elysia, t } from 'elysia';

import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import postgres from 'postgres';
import { z } from 'zod';

import {
    generateEmailVerificationCode,
    lucia,
    verifyVerificationCode,
} from '@lib/auth';
import { sql } from '@lib/db';
import { sendVerificationCode } from '@lib/email';

const passwordSchema = z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must contain at least 8 character(s)' })
    .regex(/[A-Z]/, {
        message: 'Password must contain at least 1 uppercase letter',
    })
    .regex(/[a-z]/, {
        message: 'Password must contain at least 1 lowercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least 1 number' });

const formSchema = z
    .object({
        email: z.string().min(1, { message: 'Email is required' }).email(),
        password: passwordSchema,
        passwordConfirmation: passwordSchema,
        first_name: z.string(),
        last_name: z.string(),
        phone: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords don't match",
        path: ['passwordConfirmation'],
    });

const signInFormSchema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email(),
    password: passwordSchema,
});

export const authRoute = new Elysia({ prefix: '/auth' })
    .post(
        '/sign-up',
        async ({ body, cookie }) => {
            const validEmaillPass = formSchema.safeParse({
                email: body.email,
                password: body.password,
                passwordConfirmation: body['password-confirmation'],
                first_name: body.name,
                last_name: body.surname,
                phone: body.phone,
            });

            if (!validEmaillPass.success) {
                return {
                    status: 'error',
                    errors: validEmaillPass.error.flatten().fieldErrors,
                };
            }

            const { email, password, first_name, last_name, phone } =
                validEmaillPass.data;
            const phoneNumber = phone.replaceAll('-', '');
            const hashedPassword = await new Argon2id().hash(password);
            const userId = generateId(15);

            try {
                await sql`
                INSERT INTO auth_user
                    (id, email, hashed_password,
                    first_name, last_name, phone_number)
                VALUES
                    (${userId}, ${email}, ${hashedPassword},
                    ${first_name}, ${last_name}, ${phoneNumber})
                `;
            } catch (error: any) {
                if (
                    error instanceof postgres.PostgresError &&
                    error.code === '23505'
                ) {
                    if (error.constraint_name === 'auth_user_email_key') {
                        return {
                            status: 'error',
                            message: 'Email already in use',
                        };
                    }

                    if (
                        error.constraint_name === 'auth_user_phone_number_key'
                    ) {
                        return {
                            status: 'error',
                            message: 'Telephone number already in use',
                        };
                    }
                }

                return {
                    status: 'error',
                    message: 'An error occurred, please try again later',
                };
            }

            const verificationCode = await generateEmailVerificationCode(
                userId,
                email,
            );

            sendVerificationCode(email, verificationCode);

            const session = await lucia.createSession(userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);

            cookie[sessionCookie.name].set({
                value: sessionCookie.value,
                ...sessionCookie.attributes,
            });

            return {
                status: 'success',
                message: 'Please check your email for code verification',
            };
        },
        {
            response: t.Object({
                status: t.Union([t.Literal('error'), t.Literal('success')]),
                message: t.Optional(t.String()),
                errors: t.Optional(t.Record(t.String(), t.Array(t.String()))),
            }),
            body: t.Object({
                email: t.String(),
                password: t.String(),
                'password-confirmation': t.String(),
                name: t.String(),
                surname: t.String(),
                phone: t.String(),
            }),
            type: 'multipart/form-data',
        },
    )
    .post(
        '/email-verification',
        async ({ body, cookie }) => {
            const { user } = await lucia.validateSession(
                cookie.auth_session.value,
            );
            if (!user) {
                return {
                    status: 'error',
                    message: 'Unauthorized, please sign in and try again',
                };
            }

            const code = body.code;
            if (typeof code !== 'string') {
                return {
                    status: 'error',
                    message: 'Invalid verification code',
                };
            }

            const validCode = await verifyVerificationCode(user, code);
            if (!validCode) {
                return {
                    status: 'error',
                    message: 'Invalid verification code',
                };
            }

            await lucia.invalidateUserSessions(user.id);
            await sql`
                UPDATE auth_user
                SET email_verified = true
                WHERE id = ${user.id}`;

            const session = await lucia.createSession(user.id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);

            cookie[sessionCookie.name].set({
                value: sessionCookie.value,
                ...sessionCookie.attributes,
            });

            return {
                status: 'success',
                message: `${user.email} has been verified`,
            };
        },
        {
            body: t.Object({
                code: t.String(),
            }),
            type: 'multipart/form-data',
        },
    )
    .post(
        '/sign-in',
        async (context) => {
            const { cookie, set, body } = context;

            const validEmaillPass = signInFormSchema.safeParse({
                email: body.email,
                password: body.password,
            });

            if (!validEmaillPass.success) {
                return {
                    status: 'error',
                    errors: validEmaillPass.error.flatten().fieldErrors,
                };
            }

            const { email, password } = validEmaillPass.data;

            let user_id = '';

            const queryAuthUserData = await sql`
            SELECT
                id,
                hashed_password,
                package,
                first_name,
                last_name
            FROM auth_user
            WHERE email = ${email}
            `;

            if (queryAuthUserData.length === 0) {
                return {
                    status: 'error',
                    message: 'email or password is incorrect',
                };
            }

            const queriedHashedPassword = queryAuthUserData[0].hashed_password;
            const {
                package: packageType,
                first_name: firstName,
                last_name: lastName,
            } = queryAuthUserData[0];
            user_id = queryAuthUserData[0].id;

            const isPasswordMatch = await new Argon2id().verify(
                queriedHashedPassword,
                password,
            );

            set.status = 401;
            if (!isPasswordMatch) {
                return {
                    status: 'error',
                    message: 'email or password is incorrect',
                };
            }

            const session = await lucia.createSession(user_id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);

            cookie[sessionCookie.name].set({
                value: sessionCookie.value,
                ...sessionCookie.attributes,
            });

            set.status = 200;
            return {
                status: 'success',
                data: {
                    email: email,
                    package: packageType,
                    first_name: firstName,
                    last_name: lastName,
                },
                message: 'Login success',
            };
        },
        {
            body: t.Object({
                email: t.String(),
                password: t.String(),
            }),
            type: 'multipart/form-data',
        },
    )
    .get('/session-check', async ({ cookie, set }) => {
        const sessionId = cookie.auth_session.value;

        if (!sessionId) {
            set.status = 400;
            return {
                status: 'success',
                message: 'There is no session, please login and try again.',
                is_session_expire: true,
            };
        }

        const sessionRecord = await sql`
        SELECT expires_at
        FROM user_session
        WHERE id = ${sessionId}
        `;

        if (sessionRecord.length === 0) {
            set.status = 401;
            return {
                status: 'success',
                is_session_expire: true,
                message: 'Your session is expired, please login and try again.',
            };
        }

        const isSession = sessionRecord[0].expires_at;

        set.status = 400;
        if (!isSession) {
            return {
                status: 'success',
                is_session_expire: true,
                message: 'There is no session, please login and try again.',
            };
        }

        const expires_at = Date.parse(sessionRecord[0].expires_at);
        const currentTime = new Date().getTime();

        set.status = 200;
        if (expires_at > currentTime) {
            return {
                status: 'success',
                is_session_expire: false,
                message: 'Your session have not expired yet.',
            };
        }

        set.status = 401;
        return {
            status: 'success',
            is_session_expire: true,
            message: 'Your session is expired, please login and try again.',
        };
    });

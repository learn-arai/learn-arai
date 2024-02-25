import { Elysia , t } from 'elysia';

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
        async ({ request, cookie }) => {
            const formData = await request.formData();

            const validEmaillPass = formSchema.safeParse({
                email: formData.get('email'),
                password: formData.get('password'),
                passwordConfirmation: formData.get('password-confirmation'),
            });

            if (!validEmaillPass.success) {
                return {
                    status: 'error',
                    errors: validEmaillPass.error.flatten().fieldErrors,
                };
            }

            const { email, password } = validEmaillPass.data;

            const hashedPassword = await new Argon2id().hash(password);
            const userId = generateId(15);

            try {
                await sql`
            INSERT INTO auth_user
                (id, email, hashed_password)
            VALUES
                (${userId}, ${email}, ${hashedPassword})
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
                }

                console.log(error);
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
        },
    )
    .post('/email-verification', async ({ request, cookie }) => {
        const formData = await request.formData();

        const { user } = await lucia.validateSession(cookie.auth_session.value);
        if (!user) {
            return {
                status: 'error',
                message: 'Unauthorized, please sign in and try again',
            };
        }

        const code = formData.get('code');
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
    })
    .post('/sign-in', async ({ request, cookie }) => {
        const formData = await request.formData();

        const validEmaillPass = signInFormSchema.safeParse({
            email: formData.get('email'),
            password: formData.get('password'),
        });

        if (!validEmaillPass.success) {
            return {
                status: 'error',
                errors: validEmaillPass.error.flatten().fieldErrors,
            };
        }

        const { email, password } = validEmaillPass.data;

        let user_id = '';

        try {
            const queryAuthUserData = await sql`
            SELECT id, hashed_password
            FROM auth_user
            WHERE email = ${email}
            `;

            const queriedHashedPassword = queryAuthUserData[0].hashed_password;
            user_id = queryAuthUserData[0].id;

            const isPasswordMatch = await new Argon2id().verify(
                queriedHashedPassword,
                password,
            );

            if (!isPasswordMatch) {
                return {
                    status: 'error',
                    response : {
                        message: 'email or password is incorrect',
                    }
                };
            }

        } catch (error: any) {
            return {
                status: 'error',
                response : {
                    message: error,
                }
            };
        }

        const session = await lucia.createSession(user_id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        cookie[sessionCookie.name].set({
            value: sessionCookie.value,
            ...sessionCookie.attributes,
        });

        return {
            status : "success",
        };
    })
    .get('/cookie-fetch', async ({ cookie }) => {
        const sessionID = cookie.auth_session.value;

        try {
            const userEmail = await sql`
                SELECT auth_user.email
                FROM user_session INNER JOIN auth_user 
                ON user_session.user_id = auth_user.id
                WHERE user_session.id = ${sessionID!}
                `;
            return {
                status: "success",
                response : {
                    data : userEmail
                }
            };
        } catch (error : any) {
            return {
                status : "error",
                response : {
                    message : error
                }
            }
          } 
    });

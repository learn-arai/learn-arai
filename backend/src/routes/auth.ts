import { Elysia, t } from 'elysia';

import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';

import { z } from 'zod';
import { sql } from '../../lib/db';
import { generateEmailVerificationCode, lucia } from '../../lib/auth';
import postgres from 'postgres';
import { resend } from '../../lib/email';

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

export const authRoute = new Elysia({ prefix: '/auth' }).post(
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
            email
        );
        resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Email Verification for LearnArai',
            html: `<div>Code is ${verificationCode}</div>`,
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        cookie[sessionCookie.name].set({
            value: sessionCookie.value,
            ...sessionCookie.attributes,
        });

        console.log(cookie[sessionCookie.name]);

        return {
            status: 'success',
            message: 'Please check your email for code verification'
        };
    },
    {
        response: t.Object({
            status: t.Union([t.Literal('error'), t.Literal('success')]),
            message: t.Optional(t.String()),
            errors: t.Optional(t.Record(t.String(), t.Array(t.String()))),
        }),
    }
);

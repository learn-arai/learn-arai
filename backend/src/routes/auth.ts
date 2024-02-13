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
            from: 'noreply@learnarai.online',
            to: email,
            subject: 'Email Verification for LearnArai',
            html: `<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Document</title>
            
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
                        rel="stylesheet"
                    />
                </head>
                <body style="margin: 0; padding: 0">
                    <div
                        style="
                            width: 100%;
                            padding: 2rem 0 2rem 0;
                            background-color: #f8f6f6;
                        "
                    >
                        <div
                            style="
                                max-width: 45rem;
                                background-color: #ffffff;
                                margin: 0 auto 0 auto;
                                padding: 2rem 1.5rem 2rem 1.5rem;
                                font-family: 'Open Sans', sans-serif;
                                font-style: normal;
                                color: gray;
                            "
                        >
                            <h1 style="color: black">
                                <span style="font-weight: 900;">
                                    <span style="color: #1da0ea">Learn</span
                                    ><span style="color: #fd4444">Arai</span></span
                                >
                                Verify Code
                            </h1>
                            <p>Please use the following verification code:</p>
                            <p
                                style="
                                    font-size: 3rem;
                                    padding: 0;
                                    margin: 0;
                                    font-weight: bolder;
                                    color: #1da0ea;
                                "
                            >
                                ${verificationCode}
                            </p>
                            <p style="padding-bottom: 4rem">
                                You can only use it once and it will expire after 5 mins.
                            </p>
                            <p>
                                If you did not request this, please disregard this email and
                                contact our
                                <a
                                    style="color: #1da0ea"
                                    href="https://learnarai.online/support"
                                    >support</a
                                >. Do not reply to this automated email.
                            </p>
                        </div>
                    </div>
                </body>
            </html>
            `,
        });

        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        cookie[sessionCookie.name].set({
            value: sessionCookie.value,
            ...sessionCookie.attributes,
        });

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

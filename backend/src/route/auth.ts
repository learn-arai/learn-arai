import { Elysia } from "elysia";

import { lucia } from "@/lib/auth";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { password } from "bun";

import { z } from 'zod';
import { sql } from '../../lib/db';
import postgres from "postgres";

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
        passwordConfirmation: passwordSchema
      })
      .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords don't match",
        path: ['passwordConfirmation'],
      });

export const authRoute = new Elysia({ prefix: '/auth' }).post(
    '/login',
  async ({ request, cookie }) => {
    const formData = await request.formData();

    const validEmailPass = formSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      passwordConfirmation: formData.get('password-confirmation'),
    });

    if( !validEmailPass.success ){
      return {
        status: 'error',
        errors: validEmailPass.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validEmailPass.data;

    const userId = generateId(15);
    const hashedPassword = await new Argon2id().hash(password);

    try {
      await sql`
        INSERT INTO auth_user 
            (id, email, hashed_password)
        VALUES
            (${userId}, ${email}, ${hashedPassword})
      `;
    } catch ( error: any ) {
      if (
        error instanceof postgres.PostgresError &&
        error.code === '23505'
      )
    }

  }
)
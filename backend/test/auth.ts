import { generateSlug } from '@/lib/utils';
import { describe, expect, test } from 'bun:test';

import { testPromise } from './lib/utils';

const apiURL = process.env.API_URL;
export const userTeacher1 = {
    email: `johndoe_${generateSlug()}@gmail.com`,
    password: `aA112233`,
    name: 'John',
    surname: 'Doe',
    phone: generateSlug(10),
};

export const userStudent1 = {
    email: `mokmaard_${generateSlug()}@gmail.com`,
    password: `aA112233`,
    name: 'Mok',
    surname: 'Maard',
    phone: generateSlug(10),
};

export const userStudent2 = {
    email: `peerasin_${generateSlug()}@gmail.com`,
    password: `aA112233`,
    name: 'Peerasin',
    surname: 'Sri-Sri',
    phone: generateSlug(10),
};

export default async function runTest() {
    describe('Auth System', () => {
        test('Register #1 (Teacher)', async () => {
            const json = await signUp(
                userTeacher1.email,
                userTeacher1.password,
                userTeacher1.name,
                userTeacher1.surname,
                userTeacher1.phone,
            );

            expect(json).toMatchObject({
                status: 'success',
                message: 'Please check your email for code verification',
            });
        });

        test('Register #2 (Student)', async () => {
            const json = await signUp(
                userStudent1.email,
                userStudent1.password,
                userStudent1.name,
                userStudent1.surname,
                userStudent1.phone,
            );

            expect(json).toMatchObject({
                status: 'success',
                message: 'Please check your email for code verification',
            });
        });

        test('Register #3 (Student)', async () => {
            const json = await signUp(
                userStudent2.email,
                userStudent2.password,
                userStudent2.name,
                userStudent2.surname,
                userStudent2.phone,
            );

            expect(json).toMatchObject({
                status: 'success',
                message: 'Please check your email for code verification',
            });
        });

        test('Login', async () => {
            const { json } = await signIn(
                userTeacher1.email,
                userTeacher1.password,
            );

            // TODO: Check for other fields
            expect(json).toMatchObject({
                status: 'success',
                message: 'Login success',
            });
        });
    });
}

export const signIn = async (email: string, password: string) => {
    const body = new FormData();
    body.append('email', email);
    body.append('password', password);

    const response = await fetch(`${apiURL}/auth/sign-in`, {
        method: 'POST',
        body,
    });
    const json = await response.json();

    return { json, cookie: response.headers.get('set-cookie') || '' };
};

export const signUp = async (
    email: string,
    password: string,
    name: string,
    surname: string,
    phone: string,
) => {
    const body = new FormData();
    body.append('email', email);
    body.append('password', password);
    body.append('password-confirmation', password);
    body.append('name', name);
    body.append('surname', surname);
    body.append('phone', phone);

    const response = await fetch(`${apiURL}/auth/sign-up`, {
        method: 'POST',
        body,
    });
    const json = await response.json();

    return json;
};

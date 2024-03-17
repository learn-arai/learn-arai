import { describe, expect, test } from 'bun:test';

const apiURL = process.env.API_URL;

describe('Auth System', () => {
    test.skip('Register', async () => {
        const body = new FormData();
        body.append('email', 'johndoe@gmail.com');
        body.append('password', 'aA112233');
        body.append('password-confirmation', 'aA112233');
        body.append('name', 'John');
        body.append('surname', 'Doe');
        body.append('phone', '012-345-6789');

        const response = await fetch(`${apiURL}/auth/sign-up`, {
            method: 'POST',
            body,
        });
        const json = await response.json();

        expect(json).toMatchObject({
            status: 'success',
            message: 'Please check your email for code verification',
        });
    });

    test('Login', async () => {
        const { json } = await signIn('johndoe@gmail.com', 'aA112233');

        expect(json).toMatchObject({
            status: 'success',
            message: 'login success',
        });
    });
});

export const signIn = async (email: string, password: string) => {
    const body = new FormData();
    body.append('email', email);
    body.append('password', password);

    const response = await fetch(`${apiURL}/auth/sign-in`, {
        method: 'POST',
        credentials: 'include',
        body,
    });
    const json = await response.json();

    return { json, cookie: response.headers.get('set-cookie') || '' };
};

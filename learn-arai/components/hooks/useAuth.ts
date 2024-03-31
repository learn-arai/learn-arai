'use client';

import { useLocalStorage } from './useLocalStorage';
import { User, useUser } from './useUser';

export const useAuth = () => {
    const { addUser, removeUser, user } = useUser();
    const { getItem } = useLocalStorage();

    const signIn = async (credentials: FormData) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-in`,
            {
                method: 'POST',
                body: credentials,
                credentials: 'include',
            }
        );

        const data = await response.json();
        const message = data.message;
        const status = data.status;

        if (status == 'success') {
            const email = credentials.get('email')!.toString();

            addUser({ email: email, package: data.data.package });
        } else {
            removeUser();
        }

        return { message, status };
    };

    const signOut = () => {
        removeUser();
    };

    const checkSession = async (): Promise<User | null> => {
        const currentPath = window.location.pathname;
        const userLocalStorage = getItem('user');
        if (!userLocalStorage) {
            return null;
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/session-check`,
            {
                method: 'GET',
                credentials: 'include',
            }
        );

        const data = await response.json();
        const isSessionExpire = data.is_session_expire;

        if (isSessionExpire && currentPath != '/login') {
            // window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            removeUser();
            return null;
        }

        return JSON.parse(userLocalStorage);
    };

    return {
        signIn,
        signOut,
        user,
        checkSession,
        addUser,
    };
};

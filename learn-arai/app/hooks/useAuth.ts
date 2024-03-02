'use client';

// this react hook responsible for checking if user is logged in.
import { useEffect, useState } from 'react';

import { useLocalStorage } from './useLocalStorage';
import { useUser } from './useUser';

export const useAuth = () => {
    const { addUser, removeUser, user } = useUser();
    const { getItem } = useLocalStorage();

    useEffect(() => {
        checkSession();
    });

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
            addUser({ email: email });
        } else {
            removeUser();
        }

        return { message, status };
    };

    const signOut = () => {
        removeUser();
    };

    const checkSession = async () => {
        const currentPath = window.location.pathname;
        const isUserEmpty = !getItem("user");
        if ( isUserEmpty ) {
            return;
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
            removeUser();
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }

    };

    return {
        signIn,
        signOut,
        user,
        checkSession,
    };
};

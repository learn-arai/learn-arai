'use client';

// this react hook responsible for checking if user is logged in.
import { useEffect, useState } from 'react';

import { useUser } from './useUser';
import { useLocalStorage } from './useLocalStorage';

export const useAuth = () => {
    const { addUser, removeUser, user, getUserFromLocalStorage, setUser } =
        useUser();
    const { getItem } = useLocalStorage();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>();

    useEffect(() => {
        checkSession();
    });

    const signIn = async (credentials: FormData) => {
        const response = await fetch('http://localhost:3000/auth/sign-in', {
            method: 'POST',
            body: credentials,
            credentials: 'include',
        });

        const data = await response.json();
        const message = data.message;
        const status = data.status;

        if ( status == 'success') {
            const email = credentials.get('email')!.toString();
            addUser({email : email});
        }

        return { message, status };
    };

    const signOut = () => {
        removeUser();
    };

    const checkSession = async () => {
        const isUserEmpty = getItem("user");
        if ( !isUserEmpty ) {
            return;
        }
        
        const response = await fetch(
            'http://localhost:3000/auth/session-check',
            {
                method: 'GET',
                credentials: 'include',
            }
        );

        const data = await response.json();
        const isSessionExpire = data.is_session_expire;

        const currentPath = window.location.pathname;
        if (isSessionExpire && currentPath != '/login') {
            removeUser();
            window.location.href = '/login?redirect=' + currentPath;
        }

        setIsAuthenticated(!isSessionExpire); 
    };

    return {
        signIn,
        signOut,
        user,
        isAuthenticated,
        checkSession,
    };
};

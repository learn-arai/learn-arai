'use client';

// this react hook responsible for checking if user is logged in.
import { useEffect, useState } from 'react';

import { User } from './useUser';
import { useUser } from './useUser';
import { redirect } from 'next/navigation';

export const useAuth = () => {
    const { addUser, removeUser, user, fetchedUser, getUserFromLocalStorage } = useUser();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>();

    useEffect(() => {
        checkSession();
    });

    const signIn = async (credentials  : FormData) => {
        const response = await sendCredentialToServer( credentials );
        const email = await fetchedUser();
        addUser(email);

        return response;
    };

    const signOut = () => {
        removeUser();
    };

    const sendCredentialToServer =  async (
        formData: FormData
    ) => {
        const response = await fetch('http://localhost:3000/auth/sign-in', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        })
        
        const data = await response.json();
        const message = data.message;
        const status = data.status;

        return {message, status};
    };

    const checkSession = async () => {
        const response = await fetch('http://localhost:3000/auth/session-check', {
            method : 'GET',
            "credentials" : 'include'
        })

        const data = await response.json();
        const isSessionExpire = data.isSessionExpire;
        
        const currentPath = window.location.pathname;
        if ( isSessionExpire && currentPath != '/login' ) 
            window.location.href = "/login";

        // if session is not expire then isSession = `false` and isAuthenticated
        // will set to `true`
        setIsAuthenticated( !isSessionExpire );

        if ( !isSessionExpire ) {
            await getUserFromLocalStorage();
        }
    };

    return {
        signIn,
        signOut,
        user,
        isAuthenticated,
        sendCredentialToServer,
        checkSession,
    };
};

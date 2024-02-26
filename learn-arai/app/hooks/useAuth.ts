'use client';

// this react hook responsible for checking if user is logged in.
import { useEffect, useState } from 'react';

import { User } from './useUser';
import { useUser } from './useUser';
import { redirect } from 'next/navigation';

export const useAuth = () => {
    const { addUser, removeUser, user } = useUser();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
    const [isSessionExpire, setIsSessionExpire] = useState<boolean>();

    useEffect(() => {
        checkSession();
        if ( isSessionExpire ) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [isSessionExpire]);

    const signIn = (credentials  : FormData) => {
        // addUser(user);
        const response = sendCredentialToServer( credentials );

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
        const message = data.response.message;
        const status = data.status;

        return {message, status};
    };

    const checkSession = async () => {
            const response = await fetch('http://localhost:3000/auth/session-check', {
                method : "POST",
                "credentials" : 'include'
            })

            const data = await response.json();
            const isSessionExpire = data.response.return;
            
            const currentPath = window.location.pathname;
            if ( isSessionExpire && currentPath != '/login' ) 
                window.location.href = "/login";

            setIsSessionExpire(!isSessionExpire);

            return isSessionExpire;
    };

    const isLogin = () => {

    }

    return {
        signIn,
        signOut,
        user,
        isAuthenticated,
        sendCredentialToServer,
        checkSession
    };
};

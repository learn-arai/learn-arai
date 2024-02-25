'use client';

// this react hook responsible for checking if user is logged in.
import { useEffect, useState } from 'react';

import { User } from './useUser';
import { useUser } from './useUser';

export const useAuth = () => {
    const { addUser, removeUser, user } = useUser();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>();

    useEffect(() => {
        if (user) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [user]);

    const signIn = (user: User) => {
        addUser(user);
    };

    const signOut = () => {
        removeUser();
    };

    const sendCredentialToServer =  async (
        formData: FormData
    ) => {
        let message = '';

        // promise -> .catch
        // await -> try, catch

        const response = await fetch('http://localhost:3000/auth/sign-in', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        })
        
        const data = await response.json();
        message = data.message;

        return message;
    };

    const sendCookieRetriveUser = async () => {
            const fetchedUserRecords = await fetch('http://localhost:3000/auth/cookie-fetch', {
                method : "GET",
                "credentials" : 'include'
            })
            
            console.log( fetchedUserRecords );
            // const fetchedUser = fetchedUserRecords.data.return[0];    
            // const { email, expires_at, hashed_password } = fetchedUser;
            // signIn({
            //     email: email,
            //     expires_at: expires_at,
            //     password: hashed_password,
            // });
    };

    const isLogin = () => {

    }

    return {
        signIn,
        signOut,
        user,
        isAuthenticated,
        sendCredentialToServer,
        sendCookieRetriveUser,
    };
};

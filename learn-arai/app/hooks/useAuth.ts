'use client';

// this react hook responsible for checking if user is logged in.
import { useEffect, useState } from 'react';

import { User } from './useUser';
import { useUser } from './useUser';
import axios from 'axios';

export const useAuth = () => {
    const { addUser, removeUser, user } = useUser();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>();

    useEffect(() => {
        if ( user ) {
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

    const sendCredentialToServer = async( formData : FormData ) : Promise<string> => {
        let message = "";

        try {
            await fetch('http://localhost:3000/auth/sign-in', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            }).then( ( response ) => {
                console.log( response );
                return response.json(); 
            }).then(data => {
                message = data.message;
            });
        } catch (error) {
            console.log(error);
        }

        return message;
    }

    const sendCookieRetriveUser = async( ) => {
        await axios.get('http://localhost:3000/auth/get-user', {
            withCredentials: true,
        })
        .then(function (response) {
            const fetchedUser = response.data.return[0];
            const { email, expires_at, hashed_password } = fetchedUser;                
            signIn({
                email: email,
                expires_at: expires_at,
                password: hashed_password,
            });
        });
    }

    return { signIn, signOut, user, isAuthenticated, sendCredentialToServer, sendCookieRetriveUser };
};

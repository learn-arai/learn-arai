'use client';

// this react hook responsible for checking if user is logged in.
import { useEffect, useState } from 'react';

import { User } from './useUser';
import { useUser } from './useUser';
import { redirect } from 'next/navigation';

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

    return { signIn, signOut, user, isAuthenticated };
};

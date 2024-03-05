'use client';

import React, { useEffect } from 'react';

import { useAuth } from '@/components/hooks/useAuth';
import { User } from '@/components/hooks/useUser';

export type AuthContextType = {
    user: User | null | undefined;
    signIn: (credential: FormData) => void;
    signOut: () => void;
};

export const AuthContext = React.createContext<AuthContextType | null>(null!);

export const AuthProvider = (props: React.PropsWithChildren) => {
    const { signIn, signOut, user, checkSession, addUser } = useAuth();
    const { children } = props;

    useEffect(() => {
        console.log('AuthContext.useEffect');
        checkSession().then((_user) => {
            if (!user && _user) addUser(_user);
        });
    });

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

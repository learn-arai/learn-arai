'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { useUser, User } from '@/app/hooks/useUser';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type AuthContextType = {
    user: User | null | undefined;
    signIn: (user: User) => void;
    signOut: () => void;
    isAuthenticated: boolean | undefined;
};

export const AuthContext = React.createContext<AuthContextType | null>(null!);

export const AuthProvider = (props: React.PropsWithChildren) => {
    const { signIn, signOut, isAuthenticated } = useAuth();
    const { user } = useUser();
    const { children } = props;

    return (
        <AuthContext.Provider
            value={{ user, signIn, signOut, isAuthenticated }}
        >
            {children}
        </AuthContext.Provider>
    );
};

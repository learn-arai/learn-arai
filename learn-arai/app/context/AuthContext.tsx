'use client';

import React, { useEffect } from 'react';

import { useLocalStorage } from '../hooks/useLocalStorage';

import { useAuth } from '@/app/hooks/useAuth';
import { User, useUser } from '@/app/hooks/useUser';

export type AuthContextType = {
    user: User | null | undefined;
    signIn: (credential : FormData) => void;
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

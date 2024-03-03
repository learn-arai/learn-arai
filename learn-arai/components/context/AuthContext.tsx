'use client';

import React from 'react';

import { useAuth } from '@/components/hooks/useAuth';
import { User, useUser } from '@/components/hooks/useUser';

export type AuthContextType = {
    user: User | null | undefined;
    signIn: (credential: FormData) => void;
    signOut: () => void;
};

export const AuthContext = React.createContext<AuthContextType | null>(null!);

export const AuthProvider = (props: React.PropsWithChildren) => {
    const { signIn, signOut } = useAuth();
    const { user } = useUser();
    const { children } = props;
    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

'use client';

import { useState } from 'react';

import { useLocalStorage } from './useLocalStorage';

export type User = {
    email: string;
};

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const { setItem, removeItem, getItem } = useLocalStorage();

    const addUser = (user: User) => {
        setUser(user);
        setItem('user', JSON.stringify(user));
    };

    const getUserFromLocalStorage = async () => {
        let user = getItem('user');

        setUser(JSON.parse(user!));
    }

    const removeUser = () => {
        setUser(null);
        removeItem('user');
    };

    return { setUser, addUser, removeUser, user, getUserFromLocalStorage };
};

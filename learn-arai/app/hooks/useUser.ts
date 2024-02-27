'use client';

import { useEffect, useState } from 'react';

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
        if (!user) {
            addUser( await fetchedUser() );
            user = getItem('user');
        }

        setUser(JSON.parse(user!));

        // in case there is no user in local storage.
    }

    const removeUser = () => {
        setUser(null);
        removeItem('user');
    };

    const fetchedUser = async () => {
        const fetched = await fetch('http://localhost:3000/get/email', {
            method : "GET",
            credentials : "include"
        }).then(
            response => response.json()
        ).then(
            data => {
                return data.data[0].email
            }
        )

        const email = fetched;

        return email;
    }

    return { addUser, removeUser, user, fetchedUser, getUserFromLocalStorage };
};

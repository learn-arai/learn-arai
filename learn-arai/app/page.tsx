'use client';

import { useContext } from 'react';

import { AuthContext } from './context/AuthContext';

export default function Home() {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    return (
        <div>
            <p>welcome : {user?.email}</p>
            <p>your hashed_password is : {user?.password}</p>
        </div>
    );
}

'use client';

import { useContext } from 'react';

import { AuthContext } from './context/AuthContext';

export default function Home() {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    return (
        <div>
            <p>welcome : {user?.email}</p>
        </div>
    );
}

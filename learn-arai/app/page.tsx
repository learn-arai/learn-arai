'use client';

import { useContext } from 'react';

import { AuthContext } from '@/components/context/AuthContext';
import Client from '@/components/module/landing/client';
import Hero from '@/components/module/landing/hero';
import LandingNavbar from '@/components/module/landing/landing-navbar';

export default function Home() {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    return (
        <div className="">
            <LandingNavbar />
            <Hero />
            <Client />
            <p>welcome : {user?.email}</p>
        </div>
    );
}

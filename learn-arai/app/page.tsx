'use client';

import { useContext } from 'react';

import { AuthContext } from '@/components/context/AuthContext';
import Client from '@/components/module/landing/client';
import Hero from '@/components/module/landing/hero';
import LandingNavbar from '@/components/module/landing/landing-navbar';
import Footer from '@/components/ui/footer/footer';

export default function Home() {
    const auth = useContext(AuthContext);
    const user = auth?.user;
    return (
        <>
            <LandingNavbar />
            <Hero />
            <Client />
            <p>welcome : {user?.email}</p>

            <Footer />
        </>
    );
}

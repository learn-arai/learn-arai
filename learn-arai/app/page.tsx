'use client';

import { useContext } from 'react';

import { AuthContext } from '@/components/context/AuthContext';
import Client from '@/components/module/landing/client';
import GettingStarted from '@/components/module/landing/getting-started';
import Hero from '@/components/module/landing/hero';
import LandingNavbar from '@/components/module/landing/landing-navbar';
import Testimonial from '@/components/module/landing/testimonial';
import Footer from '@/components/ui/footer/footer';

export default function Home() {
    const { user } = useContext(AuthContext);

    return (
        <>
            <LandingNavbar />
            <Hero />
            <Client />
            <Testimonial />
            <GettingStarted />

            <p>welcome : {user?.email}</p>
            <Footer />
        </>
    );
}

'use client';

import { useContext } from 'react';

import { AuthContext } from '@/components/context/AuthContext';
import Client from '@/components/module/landing/client';
import Feature from '@/components/module/landing/feature';
import GettingStarted from '@/components/module/landing/getting-started';
import Hero from '@/components/module/landing/hero';
import LandingNavbar from '@/components/module/landing/landing-navbar';
import Testimonial from '@/components/module/landing/testimonial';
import Footer from '@/components/ui/footer/footer';

export default function Home() {
    const auth = useContext(AuthContext);

    return (
        <>
            <LandingNavbar />
            <Hero />
            <Client />
            <Feature />
            <Testimonial />
            <GettingStarted />

            <p>welcome : {auth?.user?.email}</p>
            <Footer />
        </>
    );
}

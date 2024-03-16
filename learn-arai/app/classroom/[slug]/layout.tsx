'use client';

import SlugContext from '@/components/context/SlugContext';
import Navbar from '@/components/module/classrooom/navbar/navbar';
import SubNavBar from '@/components/module/classrooom/sub-navbar/sub-navbar';
import Footer from '@/components/ui/footer/footer';

export default function Layout({
    children,
    params: { slug },
}: Readonly<{
    children: React.ReactNode;
    params: {
        slug: string;
    };
}>) {
    return (
        <SlugContext.Provider value={slug}>
            <Navbar no-create-classroom title={slug} />
            <SubNavBar />

            <div className="mx-auto max-w-5xl">{children}</div>

            <Footer />
        </SlugContext.Provider>
    );
}

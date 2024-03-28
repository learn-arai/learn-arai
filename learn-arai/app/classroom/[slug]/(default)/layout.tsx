'use client';

import Navbar from '@/components/module/classroom/navbar/navbar';
import SubNavBar from '@/components/module/classroom/sub-navbar/sub-navbar';
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
        <>
            <Navbar no-create-classroom title={slug} />
            <SubNavBar />

            <div className="mx-auto max-w-5xl">{children}</div>

            <Footer />
        </>
    );
}

'use client';

import SlugContext from '@/components/context/SlugContext';
import Navbar from '@/components/module/classrooom/navbar/navbar';
import SubNavBar from '@/components/module/classrooom/sub-navbar/sub-navbar';

export default function Layout({
    children,
    params: { slug },
}: Readonly<{
    children: React.ReactNode;
    params: {
        slug: string;
    };
}>) {
    console.log(slug);

    return (
        <SlugContext.Provider value={slug}>
            <Navbar no-create-classroom title={slug} />
            <SubNavBar />
            <div className="mx-auto max-w-7xl">{children}</div>
        </SlugContext.Provider>
    );
}

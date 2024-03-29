'use client';

import SubNavBar from '@/components/module/classroom/sub-navbar/sub-navbar';

export default function Layout({
    children,
    // params: { slug },
}: Readonly<{
    children: React.ReactNode;
    params: {
        slug: string;
    };
}>) {
    return (
        <div className="h-screen flex flex-col max-h-full">
            {/* <Navbar no-create-classroom title={slug} /> */}
            <SubNavBar />

            <div className="flex-grow min-h-0">{children}</div>
        </div>
    );
}

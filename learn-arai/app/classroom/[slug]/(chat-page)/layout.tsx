'use client';

import SlugContext from '@/components/context/SlugContext';
import Navbar from '@/components/module/classroom/navbar/navbar';
import SubNavBar from '@/components/module/classroom/sub-navbar/sub-navbar';

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
          <div className='h-screen max-h-screen flex flex-col margin-0'>
            <div className='shrink-0'>
                <Navbar no-create-classroom title={slug} />
                <SubNavBar />
            </div>
            <div className="flex grow overflow-hidden">{children}</div>
          </div>
        </SlugContext.Provider>
    );
}

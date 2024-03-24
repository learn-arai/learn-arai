'use client';

import { ClassroomProvider } from '@/components/context/ClassroomContext';
import SlugContext from '@/components/context/SlugContext';
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
            <SlugContext.Provider value={slug}>
                <ClassroomProvider slug={slug}>{children}</ClassroomProvider>
            </SlugContext.Provider>

            <Footer />
        </>
    );
}

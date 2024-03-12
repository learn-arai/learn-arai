'use client';

import SlugContext from '@/components/context/SlugContext';

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

    return <SlugContext.Provider value={slug}>{children}</SlugContext.Provider>;
}

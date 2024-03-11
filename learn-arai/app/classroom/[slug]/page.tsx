'use client';

import SlugContext from '@/components/context/SlugContext';
import CreateInvite from '@/components/module/classrooom/create-invited-code/create-invited-code';
import ChipInput from '@/components/ui/chip-input';

export default function Page({ params }: { params: { slug: string } }) {
    return (
        <>
            <SlugContext.Provider value={params.slug}>
                <h1>Slug is {params.slug}</h1>
                <CreateInvite />
                <ChipInput/>
            </SlugContext.Provider>
        </>
    );
}

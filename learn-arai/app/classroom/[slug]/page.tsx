'use client';

import { useContext } from 'react';

import SlugContext from '@/components/context/SlugContext';
import CreateInvite from '@/components/module/classrooom/create-invited-code/create-invite-code';
import MemberList from '@/components/ui/member-list';

export default function Page() {
    const slug = useContext(SlugContext);

    return (
        <>
            <h1>Slug is {slug}</h1>
            <CreateInvite />
            <MemberList />
        </>
    );
}

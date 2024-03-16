'use client';

import { useContext } from 'react';

import SlugContext from '@/components/context/SlugContext';
import CreateAssignment from '@/components/module/classrooom/create-assignment/create-assignment';

export default function Page() {
    const slug = useContext(SlugContext);

    return (
        <>
            <div className="py-12">
                <CreateAssignment classroomSlug={slug} />
            </div>
        </>
    );
}

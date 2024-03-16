'use client';

import { useContext } from 'react';

import SlugContext from '@/components/context/SlugContext';
import CreateAssignment from '@/components/module/classrooom/create-assignment/create-assignment';

import AssignmentList from './assignment-list';

export default function Page() {
    const slug = useContext(SlugContext);

    return (
        <>
            <div className="py-4 space-y-4">
                <CreateAssignment classroomSlug={slug} />

                <AssignmentList classroomSlug={slug} />
            </div>
        </>
    );
}

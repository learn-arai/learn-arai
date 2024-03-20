'use client';

import { useContext } from 'react';

import { ClassroomContext } from '@/components/context/ClassroomContext';
import SlugContext from '@/components/context/SlugContext';
import CreateAssignment from '@/components/module/classrooom/create-assignment/create-assignment';

import AssignmentList from './assignment-list';

export default function Page() {
    const classroom = useContext(ClassroomContext);
    const slug = useContext(SlugContext);

    return (
        <>
            <div className="py-4 space-y-4">
                {classroom && classroom.type === 'teacher' && (
                    <CreateAssignment classroomSlug={slug} />
                )}

                <AssignmentList classroomSlug={slug} />
            </div>
        </>
    );
}

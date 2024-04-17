'use client';

import { useContext } from 'react';

import SlugContext from '@/components/context/SlugContext';

import ClassroomDetail from './classroom-detail';
import ClassroomGeneral from './classroom-general';
import DangerZone from './danger-zone';

export default function Page() {
    const slug = useContext(SlugContext);

    return (
        <div className="py-12 space-y-8">
            <ClassroomDetail />

            <ClassroomGeneral classroomSlug={slug} />

            <DangerZone />
        </div>
    );
}

'use client';

import { useContext } from 'react';

import SlugContext from '@/components/context/SlugContext';

import ClassroomDetail from './classroom-detail';
import ClassroomGeneral from './classroom-general';
import DangerZone from './danger-zone';

export default function Page() {
    const slug = useContext(SlugContext);

    return (
        <div className="space-y-8 py-12">
            <ClassroomDetail />

            <ClassroomGeneral classroomSlug={slug} />

            <DangerZone />
        </div>
    );
}

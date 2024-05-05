'use client';

import { useContext } from 'react';
import { MdDangerous } from 'react-icons/md';

import SlugContext from '@/components/context/SlugContext';
import { useClassroom } from '@/components/hooks/useClassroom';
import DeleteClassroom from '@/components/module/classroom/delete-classroom/delete-classroom';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function DangerZone() {
    const slug = useContext(SlugContext);

    return (
        <Card id="danger-zone" className="border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <MdDangerous className="h-5 w-5" />
                    Danger Zone
                </CardTitle>
                <CardDescription>
                    Be careful when using these settings. They can have a
                    negative impact on your classroom.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p>Delete this classroom</p>
                        <p className="text-sm text-muted-foreground">
                            Once you delete a classroom, You will have 30 days
                            to restore it before it is permanently deleted.
                        </p>
                    </div>

                    <DeleteClassroom classroomSlug={slug} />
                </div>
            </CardContent>
        </Card>
    );
}

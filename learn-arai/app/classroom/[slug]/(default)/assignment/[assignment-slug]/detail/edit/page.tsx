'use client';

import { Settings } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import AttachFile from './attach-file';
import AttachmentList from './attachment-list';
import EditAssignment from './edit-assignment';

export default function Page({
    params,
}: {
    params: { slug: string; 'assignment-slug': string };
}) {
    const { slug, 'assignment-slug': assignmentSlug } = params;

    return (
        <>
            <div className="min-h-[65vh] space-y-6 py-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings /> Edit Assignment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <EditAssignment
                            classSlug={slug}
                            assignmentSlug={assignmentSlug}
                        />

                        <AttachmentList
                            classSlug={slug}
                            assignmentSlug={assignmentSlug}
                        />
                    </CardContent>
                </Card>

                <AttachFile
                    assignmentSlug={assignmentSlug}
                    classroomSlug={slug}
                />
            </div>
        </>
    );
}

'use client';

import { useClassroomAssignment } from '@/components/hooks/useClassroomAssignment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import AttachFile from './attach-file';

export default function Page({
    params,
}: {
    params: { slug: string; 'assignment-slug': string };
}) {
    const { slug, 'assignment-slug': assignmentSlug } = params;
    const { useGetAssignmentDetail } = useClassroomAssignment(slug);
    const { data } = useGetAssignmentDetail(assignmentSlug);

    return (
        <>
            <div className="py-6 h-[65vh] space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {data?.status === 'success' && data.data.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="max-w-xl">uwu</CardContent>
                </Card>

                <AttachFile
                    assignmentSlug={assignmentSlug}
                    classroomSlug={slug}
                />
            </div>
        </>
    );
}

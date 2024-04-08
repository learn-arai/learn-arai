'use client';

import { useContext } from 'react';

import { Settings } from 'lucide-react';

import { ClassroomContext } from '@/components/context/ClassroomContext';
import { useClassroomGrader } from '@/components/hooks/useClassroomGrader';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import EditGrader from './edit-grader';

export default function Page({
    params,
}: {
    params: { slug: string; 'grader-slug': string };
}) {
    const { slug, 'grader-slug': graderSlug } = params;
    const classroom = useContext(ClassroomContext);

    const { useGetDetail } = useClassroomGrader(slug);
    const { data } = useGetDetail(graderSlug);

    if (data?.status === 'error') {
        return <>{data.message}</>;
    }

    return (
        <div className="pb-4">
            <Breadcrumb className="py-4">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/classroom/${slug}`}>
                            {classroom?.name}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/classroom/${slug}/grader`}>
                            Grader
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{data?.data.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings /> Edit Grader
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <EditGrader classroomSlug={slug} graderSlug={graderSlug} />
                </CardContent>
            </Card>
        </div>
    );
}

'use client';

import { BsPerson } from 'react-icons/bs';
import { FaClipboardList } from 'react-icons/fa';
import { MdOutlinePeopleAlt } from 'react-icons/md';

import { Plus } from 'lucide-react';

import { formatDate } from '@/lib/utils';

import { useClassroomAssignment } from '@/components/hooks/useClassroomAssignment';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page({
    params,
}: {
    params: { slug: string; 'assignment-slug': string };
}) {
    const { slug, 'assignment-slug': assignmentSlug } = params;
    const { useGetAssignmentDetail } = useClassroomAssignment(slug);
    const { data, isLoading } = useGetAssignmentDetail(assignmentSlug);

    return (
        <>
            {data?.status === 'error' && <p>{data.message}</p>}

            <div className="py-6 flex gap-5 h-[65vh]">
                <span className="bg-muted-foreground text-primary-foreground p-2 rounded-full h-fit">
                    <FaClipboardList className="w-5 h-5" />
                </span>

                <div className="flex-grow space-y-2">
                    <h3 className="text-3xl font-medium">
                        {data?.status === 'success' && (
                            <span>{data.data.title}</span>
                        )}
                        {isLoading && (
                            <Skeleton className="h-[32px] w-[150px] bg-primary/50" />
                        )}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                        Athicha Leksansern
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>100 Score</span>
                        <span suppressHydrationWarning>
                            {data?.status === 'success' && (
                                <span>
                                    Due {formatDate(data.data.due_date)}
                                </span>
                            )}
                        </span>
                    </div>

                    <Separator className="bg-primary" />

                    <p className="text-muted-foreground text-sm py-2">
                        {data?.status === 'success' && data.data.description}
                    </p>

                    <Separator className="bg-muted-foreground/15 h-[3px]" />

                    <div className="py-2 text-muted-foreground flex items-center gap-2 text-sm">
                        <MdOutlinePeopleAlt className="w-6 h-6" />
                        <span>Class comments</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="w-[300px] shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-lg font-medium text-primary">
                                    Your work
                                </h4>
                                <span className="text-green-700 text-sm font-semibold">
                                    Assigned
                                </span>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full mt-2 flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Add or Create
                            </Button>

                            <Button className="w-full mt-6">
                                Mark as done
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="w-[300px] shadow-lg">
                        <CardContent className="p-6">
                            <h4 className="text-sm text-primary flex gap-2 font-semibold items-center">
                                <BsPerson className="w-5 h-5" />
                                Private Comments
                            </h4>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

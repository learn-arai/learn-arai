'use client';

import Link from 'next/link';

import { useContext } from 'react';
import { BsPerson } from 'react-icons/bs';
import { FaClipboardList } from 'react-icons/fa';
import { MdOutlinePeopleAlt } from 'react-icons/md';

import { Plus } from 'lucide-react';

import { formatDate } from '@/lib/utils';

import { ClassroomContext } from '@/components/context/ClassroomContext';
import {
    Attachment,
    useClassroomAssignment,
} from '@/components/hooks/useClassroomAssignment';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

import SettingPopover from './setting-popover';

export default function Page({
    params,
}: {
    params: { slug: string; 'assignment-slug': string };
}) {
    const { slug, 'assignment-slug': assignmentSlug } = params;

    const classroom = useContext(ClassroomContext);

    const { useGetAssignmentDetail, useGetAttachmentList } =
        useClassroomAssignment(slug);
    const { data, isLoading } = useGetAssignmentDetail(assignmentSlug);
    const { data: attachment, isLoading: isLoadingAttachment } =
        useGetAttachmentList(assignmentSlug);

    return (
        <>
            {data?.status === 'error' && <p>{data.message}</p>}

            <div className="py-6 flex gap-5 min-h-[65vh]">
                <span className="bg-muted-foreground text-primary-foreground p-2 rounded-full h-fit">
                    <FaClipboardList className="w-5 h-5" />
                </span>

                <div className="flex-grow space-y-2">
                    <h3 className="text-3xl font-medium flex items-center justify-between">
                        {data?.status === 'success' && (
                            <span>{data.data.title}</span>
                        )}
                        {isLoading && (
                            <Skeleton className="h-[32px] w-[150px] bg-primary/35" />
                        )}

                        {classroom && classroom.type === 'teacher' && (
                            <SettingPopover
                                slug={slug}
                                assignmentSlug={assignmentSlug}
                            />
                        )}
                    </h3>

                    <div className="text-sm text-muted-foreground !mt-0">
                        Athicha Leksansern
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                            {data?.status === 'success' && (
                                <span>{data.data.max_score}</span>
                            )}
                            {isLoading && (
                                <Skeleton className="h-[18px] w-[38px] bg-primary/35" />
                            )}
                            <span>Score</span>
                        </span>
                        <span
                            suppressHydrationWarning
                            className="flex items-center"
                        >
                            {data?.status === 'success' && (
                                <span>
                                    Due {formatDate(data.data.due_date)}
                                </span>
                            )}
                            {isLoading && (
                                <Skeleton className="h-[18px] w-[240px] bg-primary/35" />
                            )}
                        </span>
                    </div>

                    <Separator className="bg-primary" />

                    <div className="text-primary text-sm py-2">
                        {data?.status === 'success' && (
                            <p className="whitespace-pre-line">
                                {data.data.description}
                            </p>
                        )}
                        {isLoading && (
                            <div className="space-y-1">
                                <Skeleton className="h-[18px] w-full bg-primary/35" />
                                <Skeleton className="h-[18px] w-full bg-primary/35" />
                                <Skeleton className="h-[18px] w-1/3 bg-primary/35" />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 pt-4">
                            {isLoadingAttachment && <AttachmentCard />}

                            {attachment?.status === 'success' &&
                                attachment.data.map((a) => (
                                    <AttachmentCard key={a.file_id} data={a} />
                                ))}
                        </div>
                    </div>

                    <Separator className="bg-muted-foreground/15 h-[3px]" />

                    <div className="py-2 text-muted-foreground flex items-center gap-2 text-sm">
                        <MdOutlinePeopleAlt className="w-6 h-6" />
                        <span>Class comments</span>
                    </div>
                </div>

                {classroom && classroom.type === 'student' && (
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
                )}
            </div>
        </>
    );
}

function AttachmentCard(props: { data?: Attachment }) {
    const { data } = props;

    if (!data) {
        return (
            <Card className="p-0 flex overflow-clip hover:cursor-pointer group">
                <Skeleton className="h-full aspect-[4/3] bg-primary/35 rounded-none" />
                <CardContent className="p-4">
                    <div className="font-semibold group-hover:underline">
                        <Skeleton className="h-[18px] w-[85px] bg-primary/35" />
                    </div>
                    <Skeleton className="h-[16px] w-[40px] bg-primary/35 mt-1.5" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Link
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${data.file_id}`}
            target="_blank"
            className="flex w-full"
        >
            <Card className="p-0 flex overflow-clip hover:cursor-pointer group w-full">
                <div className="bg-muted h-full aspect-[4/3]" />
                <CardContent className="p-4">
                    <p className="font-semibold group-hover:underline">
                        {data.name}
                    </p>
                    <p>{data.type}</p>
                </CardContent>
            </Card>
        </Link>
    );
}

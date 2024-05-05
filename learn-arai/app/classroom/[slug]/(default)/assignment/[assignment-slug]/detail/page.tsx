'use client';

import Link from 'next/link';

import { useContext } from 'react';
import { FaClipboardList } from 'react-icons/fa';
import { MdOutlinePeopleAlt } from 'react-icons/md';

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
import SubmissionBox from './submission-box';

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

            <div className="flex min-h-[65vh] gap-5 py-6">
                <span className="h-fit rounded-full bg-muted-foreground p-2 text-primary-foreground">
                    <FaClipboardList className="h-5 w-5" />
                </span>

                <div className="flex-grow space-y-2">
                    <h3 className="flex items-center justify-between text-3xl font-medium">
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

                    <div className="!mt-0 text-sm text-muted-foreground">
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

                    <div className="py-2 text-sm text-primary">
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

                    <div className="flex justify-end">
                        <Link
                            href={`/classroom/${slug}/assignment/${assignmentSlug}/submissions`}
                        >
                            <Button className="" variant="outline" size="sm">
                                View score
                            </Button>
                        </Link>
                    </div>

                    <Separator className="h-[3px] bg-muted-foreground/15" />

                    <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                        <MdOutlinePeopleAlt className="h-6 w-6" />
                        <span>Class comments</span>
                    </div>
                </div>

                {classroom && classroom.type === 'student' && (
                    <SubmissionBox
                        assignmentSlug={assignmentSlug}
                        classroomSlug={slug}
                    />
                )}
            </div>
        </>
    );
}

function AttachmentCard(props: { data?: Attachment }) {
    const { data } = props;

    if (!data) {
        return (
            <Card className="group flex overflow-clip p-0 hover:cursor-pointer">
                <Skeleton className="aspect-[4/3] h-full rounded-none bg-primary/35" />
                <CardContent className="p-4">
                    <div className="font-semibold group-hover:underline">
                        <Skeleton className="h-[18px] w-[85px] bg-primary/35" />
                    </div>
                    <Skeleton className="mt-1.5 h-[16px] w-[40px] bg-primary/35" />
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
            <Card className="group flex w-full overflow-clip p-0 hover:cursor-pointer">
                <div className="aspect-[4/3] h-full bg-muted" />
                <CardContent className="p-4">
                    <p className="font-semibold group-hover:underline">
                        {data.name}
                    </p>
                    <p className="text-muted-foreground">{data.type}</p>
                </CardContent>
            </Card>
        </Link>
    );
}

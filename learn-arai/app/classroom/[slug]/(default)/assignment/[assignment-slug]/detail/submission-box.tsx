'use client';

import Link from 'next/link';

import { BsPerson } from 'react-icons/bs';
import { IoLink } from 'react-icons/io5';

import { Plus } from 'lucide-react';

import {
    Attachment,
    useClassroomAssignment,
} from '@/components/hooks/useClassroomAssignment';
import AssignmentAttachFileStudent from '@/components/module/classroom/assignment-attach-file-student/assignment-attach-file-student';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function SubmissionBox(props: {
    assignmentSlug: string;
    classroomSlug: string;
}) {
    const { assignmentSlug, classroomSlug } = props;

    return (
        <div className="space-y-6">
            <Card className="w-[300px] shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-primary">
                            Your work
                        </h4>
                        <span className="text-sm font-semibold text-green-700">
                            Assigned
                        </span>
                    </div>

                    <AttachmentList
                        assignmentSlug={assignmentSlug}
                        classroomSlug={classroomSlug}
                    />

                    <AddOrCreateButton
                        assignmentSlug={assignmentSlug}
                        classroomSlug={classroomSlug}
                    />

                    <SubmitButton
                        assignmentSlug={assignmentSlug}
                        classroomSlug={classroomSlug}
                    />
                </CardContent>
            </Card>

            <Card className="w-[300px] shadow-lg">
                <CardContent className="p-6">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <BsPerson className="h-5 w-5" />
                        Private Comments
                    </h4>
                </CardContent>
            </Card>
        </div>
    );
}

function AttachmentList(props: {
    assignmentSlug: string;
    classroomSlug: string;
}) {
    const { assignmentSlug, classroomSlug } = props;

    const { useGetSubmissionAttachmentList } =
        useClassroomAssignment(classroomSlug);
    const { data, isLoading } = useGetSubmissionAttachmentList(assignmentSlug);

    return (
        <div className="mb-4 mt-2 flex flex-col gap-2">
            {data?.status === 'success' &&
                data.data.map((a) => (
                    <AttachmentCard key={a.file_id} data={a} />
                ))}

            {isLoading && <AttachmentCard />}
        </div>
    );
}

function AttachmentCard(props: { data?: Attachment }) {
    const { data } = props;

    if (!data) {
        return (
            <Card className="flex overflow-clip p-0 shadow-none">
                <div className="h-14 w-14 bg-muted"></div>

                <Separator orientation="vertical" />

                <div className="p-2 text-sm">
                    <div className="truncate font-semibold">
                        <Skeleton className="h-[15px] w-[100px]" />
                    </div>
                    <div className="pt-2 text-muted-foreground">
                        <Skeleton className="h-[15px] w-[60px]" />
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Link
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${data.file_id}`}
            target="_blank"
        >
            <Card className="flex overflow-clip p-0 shadow-none">
                <div className="h-14 w-14 shrink-0 bg-muted"></div>

                <Separator orientation="vertical" />

                <div className="p-2 text-sm">
                    <p className="truncate font-medium">{data.name}</p>
                    <p className="text-muted-foreground">{data.type}</p>
                </div>
            </Card>
        </Link>
    );
}

function SubmitButton(props: {
    assignmentSlug: string;
    classroomSlug: string;
}) {
    const { assignmentSlug, classroomSlug } = props;

    const {
        useGetSubmissionAttachmentList,
        useGetAssignmentDetail,
        submit,
        unsubmit,
    } = useClassroomAssignment(classroomSlug);

    const { data: attachment, isLoading: attachmentIsLoading } =
        useGetSubmissionAttachmentList(assignmentSlug);
    const {
        data: detail,
        isLoading: detailIsLoading,
        refetch,
    } = useGetAssignmentDetail(assignmentSlug);

    if (
        attachmentIsLoading ||
        detailIsLoading ||
        detail?.status !== 'success' ||
        attachment?.status !== 'success'
    ) {
        return (
            <Button className="mt-6 w-full leading-none" variant="outline">
                Loading...
            </Button>
        );
    }

    /* Turn in, Mark as done, Unsubmit */

    if (detail.data.is_submitted) {
        return (
            <Button
                className="mt-6 w-full leading-none"
                variant="outline"
                onClick={async (e) => {
                    e.preventDefault();
                    const res = await unsubmit(assignmentSlug);
                    if (res.status === 'success') {
                        await refetch();
                    }
                }}
            >
                Unsubmit
            </Button>
        );
    }

    const emptyAttachment = attachment.data.length === 0;

    return (
        <Button
            className="mt-6 w-full leading-none"
            onClick={async (e) => {
                e.preventDefault();
                const res = await submit(assignmentSlug);
                if (res.status === 'success') {
                    await refetch();
                }
            }}
        >
            {emptyAttachment ? 'Mark as done' : 'Turn in'}
        </Button>
    );
}

function AddOrCreateButton(props: {
    assignmentSlug: string;
    classroomSlug: string;
}) {
    const { assignmentSlug, classroomSlug } = props;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="mt-2 flex w-full items-center gap-1 leading-none"
                >
                    <Plus className="h-4 w-4" />
                    Add or Create
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(300px-3rem)]">
                <DropdownMenuItem className="px-2 py-3" disabled>
                    <div className="flex items-center font-semibold">
                        <IoLink className="ml-2 mr-4 text-primary/95" />
                        Link
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="m-0 w-full p-0">
                    <div onClick={(e) => e.preventDefault()} className="w-full">
                        <AssignmentAttachFileStudent
                            assignmentSlug={assignmentSlug}
                            classroomSlug={classroomSlug}
                        />
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

'use client';

import Link from 'next/link';

import { BsPerson } from 'react-icons/bs';
import { IoLink } from 'react-icons/io5';

import { Plus } from 'lucide-react';

import {
    Attachment,
    useClassroomAssignment,
} from '@/components/hooks/useClassroomAssignment';
import AssignmentAttachFileStudent from '@/components/module/classrooom/assignment-attach-file-student/assignment-attach-file-student';
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
                        <span className="text-green-700 text-sm font-semibold">
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
                    <Button className="w-full mt-6 leading-none">
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

    console.log(data);

    return (
        <div className="flex flex-col gap-2 mt-2 mb-4">
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
            <Card className="p-0 flex overflow-clip">
                <div className="w-14 h-14 bg-muted"></div>

                <Separator orientation="vertical" />

                <div className="p-2 text-sm">
                    <div className="font-semibold truncate">
                        <Skeleton className="h-[15px] w-[100px]" />
                    </div>
                    <div className="text-muted-foreground pt-2">
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
            <Card className="p-0 flex overflow-clip">
                <div className="w-14 h-14 bg-muted shrink-0"></div>

                <Separator orientation="vertical" />

                <div className="p-2 text-sm">
                    <p className="font-medium truncate">{data.name}</p>
                    <p className="text-muted-foreground">{data.type}</p>
                </div>
            </Card>
        </Link>
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
                    className="w-full mt-2 flex items-center gap-1 leading-none"
                >
                    <Plus className="w-4 h-4" />
                    Add or Create
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(300px-3rem)]">
                <DropdownMenuItem className="px-2 py-3" disabled>
                    <div className="flex items-center font-semibold">
                        <IoLink className="mr-4 ml-2 text-primary/95" />
                        Link
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0 m-0 w-full">
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

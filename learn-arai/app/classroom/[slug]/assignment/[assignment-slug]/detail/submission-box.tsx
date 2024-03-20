'use client';

import { BsPerson } from 'react-icons/bs';
import { IoLink } from 'react-icons/io5';

import { Plus } from 'lucide-react';

import AssignmentAttachFileStudent from '@/components/module/classrooom/assignment-attach-file-student/assignment-attach-file-student';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

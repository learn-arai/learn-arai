'use client';

import * as React from 'react';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { FiPaperclip } from 'react-icons/fi';
import { IoIosImages } from 'react-icons/io';
import { LuUpload } from 'react-icons/lu';

import { cn } from '@/lib/utils';

import { useClassroomAssignment } from '@/components/hooks/useClassroomAssignment';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';

import Dropzone from './dropzone';

export default function AssignmentAttachFileStudent(props: {
    assignmentSlug: string;
    classroomSlug: string;
}) {
    const { assignmentSlug, classroomSlug } = props;

    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const title = 'Upload new file';

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div className="flex items-center font-semibold w-full px-2 py-3 hover:cursor-pointer">
                        <FiPaperclip className="mr-4 ml-2 text-primary/95" />
                        File
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[850px] p-0 gap-0">
                    <DialogHeader className="p-6">
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <AssignmentAttachFileForm
                        assignmentSlug={assignmentSlug}
                        classroomSlug={classroomSlug}
                        setOpen={setOpen}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <div className="flex items-center font-semibold w-full px-2 py-3 hover:cursor-pointer">
                    <FiPaperclip className="mr-4 ml-2 text-primary/95" />
                    File
                </div>
            </DrawerTrigger>
            <DrawerContent className="p-0 gap-0">
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                <AssignmentAttachFileForm
                    className="px-4"
                    assignmentSlug={assignmentSlug}
                    classroomSlug={classroomSlug}
                    setOpen={setOpen}
                />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function AssignmentAttachFileForm(
    props: React.ComponentProps<'form'> & {
        assignmentSlug: string;
        classroomSlug: string;
        setOpen?: (open: boolean) => void;
    }
) {
    const { className, assignmentSlug, classroomSlug, setOpen } = props;

    const { submitAttach } = useClassroomAssignment(classroomSlug);

    const onDrop = async (files: File[]) => {
        console.log(files);

        const data = await submitAttach(classroomSlug, assignmentSlug, files);
        console.log(data);

        if (setOpen) setOpen(false);
    };

    return (
        <form className={cn('grid items-start', className)}>
            <Dropzone onDrop={onDrop} />

            {/* {state.status === 'error' && (
                <p className="pt-1 text-xs text-destructive text-right">
                    {state.message}
                </p>
            )} */}
        </form>
    );
}

'use client';

import * as React from 'react';
import { useState } from 'react';
import { useFormState } from 'react-dom';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AssignmentAttachFile(props: {
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
                    <Button
                        className="flex flex-col items-center gap-1"
                        variant="none"
                        size="none"
                    >
                        <div className="w-fit rounded-full border p-4 hover:cursor-pointer hover:bg-muted">
                            <LuUpload />
                        </div>
                        <p className="text-sm font-semibold">Upload</p>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
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
                <Button
                    className="flex flex-col items-center gap-1"
                    variant="none"
                    size="none"
                >
                    <div className="w-fit rounded-full border p-4 hover:cursor-pointer hover:bg-muted">
                        <LuUpload />
                    </div>
                    <p className="text-sm font-semibold">Upload</p>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
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

function AssignmentAttachFileForm({
    className,
    assignmentSlug,
    classroomSlug,
    setOpen,
}: React.ComponentProps<'form'> & {
    assignmentSlug: string;
    classroomSlug: string;
    setOpen?: (open: boolean) => void;
}) {
    const { attachFile } = useClassroomAssignment(classroomSlug);

    const [state, formAction] = useFormState(attachFile, {
        status: 'idle',
        assignmentSlug,
    });

    React.useEffect(() => {
        if (state.status === 'success') {
            // redirect(`/classroom/${state.data.classroom.slug}`);
            if (setOpen) setOpen(false);
            console.log(state);
        }
    }, [state, setOpen]);

    return (
        <form
            className={cn('grid items-start gap-4', className)}
            action={formAction}
        >
            <FormInput name="file" label="File" type="file">
                <IoIosImages className="bg-primary text-primary-foreground" />
            </FormInput>

            <div className="w-full">
                <Button type="submit" className="w-full">
                    Upload
                </Button>
                <p className="pt-1 text-right text-xs text-destructive">
                    {state.status === 'error' && state.message}
                </p>
            </div>
        </form>
    );
}

function FormInput({
    name,
    label,
    defaultValue,
    type,
    children,
    placeholder,
}: {
    name: string;
    label: string;
    defaultValue?: string;
    type?: string;
    children?: React.ReactNode;
    placeholder?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name} className="relative">
                {label}
                <Input
                    type={type || 'text'}
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    className={cn(
                        'mt-2',
                        !!children && 'pl-9',
                        type === 'file' &&
                            'h-10 py-0 pl-0 file:mr-2 file:h-full file:w-0 file:bg-primary file:pl-9 file:pr-0 file:text-primary'
                    )}
                    placeholder={placeholder}
                />
                <div
                    className={cn(
                        'absolute bottom-3 mx-3 text-muted-foreground',
                        type === 'file' && 'bg-background'
                    )}
                >
                    {children}
                </div>
            </Label>
        </div>
    );
}

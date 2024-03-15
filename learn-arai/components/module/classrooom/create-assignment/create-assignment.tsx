'use client';

import { redirect } from 'next/navigation';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { BiRename } from 'react-icons/bi';
import { CgDetailsMore } from 'react-icons/cg';
import { FaRegCalendar } from 'react-icons/fa';
import { GrScorecard } from 'react-icons/gr';
import { IoIosImages } from 'react-icons/io';

import { PlusIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useClassroom } from '@/components/hooks/useClassroom';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { DatePicker } from '@/components/module/classrooom/create-assignment/date-picker';
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
import { Textarea } from '@/components/ui/textarea';

function CreateAssignmentButton(props: React.ComponentProps<'button'>) {
    return (
        <Button className="flex gap-1 items-center" {...props}>
            Create
            <PlusIcon className="w-4 h-4" />
        </Button>
    );
}

export default function CreateAssignment() {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const title = 'Create new assignment';

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <CreateAssignmentButton />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <CreateAssignmentForm />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <CreateAssignmentButton />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                <CreateAssignmentForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function CreateAssignmentForm({ className }: React.ComponentProps<'form'>) {
    // const { createClassroom } = useClassroom();

    // const [state, formAction] = useFormState(createClassroom, {
    //     status: 'idle',
    // });

    // useEffect(() => {
    //     if (state.status === 'success') {
    //         redirect(`/classroom/${state.data.classroom.slug}`);
    //     }
    // }, [state]);

    return (
        <form
            className={cn('grid items-start gap-4', className)}
            // action={formAction}
        >
            <div className="grid gap-2">
                <Label htmlFor="title" className="relative">
                    Name
                    <Input
                        type="text"
                        id="title"
                        name="title"
                        className="mt-2 pl-9"
                    />
                    <div className="absolute bottom-3 mx-3 text-muted-foreground">
                        <BiRename />
                    </div>
                </Label>
            </div>

            <div className="grid gap-2 grid-cols-2">
                <Label htmlFor="score" className="relative">
                    Score
                    <Input
                        type="number"
                        id="score"
                        name="score"
                        className="mt-2 pl-9"
                        defaultValue={100}
                    />
                    <div className="absolute bottom-3 mx-3 text-muted-foreground">
                        <GrScorecard />
                    </div>
                </Label>

                <Label htmlFor="due_date" className="relative">
                    Due date
                    <DatePicker/>
                </Label>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description" className="relative">
                    Description
                    <Textarea
                        id="description"
                        name="description"
                        className="mt-2"
                    />
                </Label>
            </div>

            <div className="w-full">
                <Button type="submit" className="w-full">
                    Create
                </Button>
                <p className="pt-1 text-xs text-destructive text-right">
                    {/* {state.status === 'error' && state.message} */}
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
                        children && 'pl-9',
                        type === 'file' &&
                            'file:bg-primary file:text-primary h-10 py-0 file:h-full pl-0 file:pl-9 file:w-0 file:pr-0 file:mr-2'
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

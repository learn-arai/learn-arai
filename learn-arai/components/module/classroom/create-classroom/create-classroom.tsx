'use client';

import { redirect } from 'next/navigation';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { BiRename } from 'react-icons/bi';
import { CgDetailsMore } from 'react-icons/cg';
import { IoIosImages } from 'react-icons/io';

import { cn } from '@/lib/utils';

import { useClassroom } from '@/components/hooks/useClassroom';
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

export default function CreateClassroom() {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const title = 'Create Classroom';

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <span>Create Classroom</span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <CreateClassroomForm />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <span>Create Classroom</span>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                <CreateClassroomForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function CreateClassroomForm({ className }: React.ComponentProps<'form'>) {
    const { createClassroom } = useClassroom();

    const [state, formAction] = useFormState(createClassroom, {
        status: 'idle',
    });

    useEffect(() => {
        if (state.status === 'success') {
            redirect(`/classroom/${state.data.classroom.slug}`);
        }
    }, [state]);

    return (
        <form
            className={cn('grid items-start gap-4', className)}
            action={formAction}
        >
            <FormInput name="name" label="Title" placeholder="...">
                <BiRename />
            </FormInput>

            <FormInput name="description" label="Description" placeholder="...">
                <CgDetailsMore />
            </FormInput>

            <FormInput name="thumbnail" label="Thumbnail" type="file">
                <IoIosImages className="bg-primary text-primary-foreground" />
            </FormInput>

            <div className="w-full">
                <Button type="submit" className="w-full">
                    Create
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

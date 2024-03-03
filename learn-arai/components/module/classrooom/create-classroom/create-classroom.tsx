'use client';

import * as React from 'react';
import { BiRename } from 'react-icons/bi';
import { CgDetailsMore } from 'react-icons/cg';
import { FaPlus } from 'react-icons/fa6';
import { IoIosImages } from 'react-icons/io';

import { cn } from '@/lib/utils';

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

function CreateClassroomButton(props: React.ComponentProps<'button'>) {
    return (
        <button
            className="hover:bg-muted mx-auto mr-0 p-3 rounded-full"
            {...props}
        >
            <FaPlus className="" />
        </button>
    );
}

export default function CreateClassroom() {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const title = 'Create Classroom';

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <CreateClassroomButton />
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
                <CreateClassroomButton />
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
    return (
        <form className={cn('grid items-start gap-4', className)}>
            <FormInput name="name" label="Title" placeholder="...">
                <BiRename />
            </FormInput>

            <FormInput name="description" label="Description" placeholder="...">
                <CgDetailsMore />
            </FormInput>

            <FormInput name="thumbnail" label="Thumbnail" type="file">
                <IoIosImages />
            </FormInput>

            <Button type="submit">Create</Button>
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
                    defaultValue={defaultValue}
                    className={cn('mt-2', children && 'px-9')}
                    placeholder={placeholder}
                />
                <div className="absolute bottom-3 mx-3 text-muted-foreground">
                    {children}
                </div>
            </Label>
        </div>
    );
}

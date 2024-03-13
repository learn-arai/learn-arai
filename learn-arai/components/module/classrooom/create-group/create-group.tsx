'use client';

import { redirect } from 'next/navigation';

import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { BiRename } from 'react-icons/bi';
import { useQueryClient } from 'react-query';

import { Plus } from 'lucide-react';

import { cn } from '@/lib/utils';

import SlugContext from '@/components/context/SlugContext';
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

function CreateGroupButton(props: React.ComponentProps<'button'>) {
    return (
        <Button className="flex items-center gap-1" size="sm" {...props}>
            Create Group <Plus className="w-4 h-4" />
        </Button>
    );
}

export default function CreateGroup() {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const title = 'Create Group';

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <CreateGroupButton />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <CreateGroupForm setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <CreateGroupButton />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                <CreateGroupForm className="px-4" setOpen />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function CreateGroupForm({
    className,
    setOpen,
}: React.ComponentProps<'form'> & {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const slug = useContext(SlugContext);
    const queryClient = useQueryClient();

    const { createGroup } = useClassroom();
    const [state, formAction] = useFormState(createGroup, {
        slug,
    });

    useEffect(() => {
        if (state.status === 'success') {
            queryClient
                .invalidateQueries({
                    queryKey: ['get-group-list', slug],
                })
                .then((_) => {
                    setOpen(false);
                });
        } else {
            console.log(state);
        }
    }, [state, queryClient, slug, setOpen]);

    return (
        <form
            className={cn('grid items-start gap-4', className)}
            action={formAction}
        >
            <FormInput name="title" label="Name" placeholder="...">
                <BiRename />
            </FormInput>

            <div className="w-full">
                <Button type="submit" className="w-full">
                    Create
                </Button>
                <p className="pt-1 text-xs text-destructive text-right">
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

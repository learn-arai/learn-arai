'use client';

import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { BiRename } from 'react-icons/bi';
import { FaTrashAlt } from 'react-icons/fa';
import { useQueryClient } from 'react-query';

import { cn } from '@/lib/utils';

import SlugContext from '@/components/context/SlugContext';
import { useClassroom } from '@/components/hooks/useClassroom';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function DeleteGroupButton(props: React.ComponentProps<'button'>) {
    return (
        <Button size="icon" variant="destructive" {...props}>
            <FaTrashAlt className="w-4 h-4" />
        </Button>
    );
}

export default function DeleteGroup(props: {
    groupSlug: string;
    name: string;
}) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const { groupSlug, name } = props;
    const title = 'Delete Group';
    const description = 'Are you sure you want to delete this group?';

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <DeleteGroupButton />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <DeleteGroupForm setOpen={setOpen} name={name} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <DeleteGroupButton />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                <DeleteGroupForm
                    className="px-4"
                    setOpen={setOpen}
                    name={name}
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

function DeleteGroupForm({
    className,
    name,
    setOpen,
}: React.ComponentProps<'form'> & {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    name: string;
}) {
    const slug = useContext(SlugContext);
    const queryClient = useQueryClient();

    const { createGroup } = useClassroom();
    // const [state, formAction] = useFormState(createGroup, {
    //     slug,
    // });

    // useEffect(() => {
    //     if (state.status === 'success') {
    //         queryClient
    //             .invalidateQueries({
    //                 queryKey: ['get-group-list', slug],
    //             })
    //             .then((_) => {
    //                 setOpen(false);
    //             });
    //     } else {
    //         console.log(state);
    //     }
    // }, [state, queryClient, slug, setOpen]);

    return (
        <form
            className={cn('grid items-start gap-4', className)}
            // action={formAction}
        >
            <FormInput
                name="title"
                label="Name"
                defaultValue={name}
                type="text"
                disabled
            >
                <BiRename />
            </FormInput>

            <div className="w-full">
                <Button
                    type="submit"
                    className="w-full"
                    variant="destructive"
                    disabled
                >
                    Delete
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
    disabled,
}: {
    name: string;
    label: string;
    defaultValue?: string;
    type?: string;
    children?: React.ReactNode;
    placeholder?: string;
    disabled?: boolean;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={name} className="relative">
                {label}
                <Input
                    disabled={disabled}
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

'use client';

import { redirect } from 'next/navigation';

import * as React from 'react';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { FaPlus } from 'react-icons/fa6';
import { FaXmark } from 'react-icons/fa6';
import { GrGroup } from 'react-icons/gr';

import { cn } from '@/lib/utils';

import SlugContext from '@/components/context/SlugContext';
import { useClassroom } from '@/components/hooks/useClassroom';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import CodeLine from '@/components/ui/code-line';
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

import './input-chip.css';

function CreateInviteButton(props: React.ComponentProps<'button'>) {
    return (
        <button
            className="hover:bg-muted mx-auto mr-0 p-3 rounded-full"
            {...props}
        >
            <FaPlus className="" />
        </button>
    );
}

export default function CreateInvite() {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const title = 'Create Invite Code';

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <CreateInviteButton />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <CreateInviteForm />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <CreateInviteButton />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                <CreateInviteForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function CreateInviteForm({ className }: React.ComponentProps<'form'>) {
    const slug = React.useContext(SlugContext);
    const { createInviteCode } = useClassroom();

    const [state, formAction] = useFormState(createInviteCode, {
        status: 'idle',
    });

    return (
        <form
            className={cn('grid items-start gap-4', className)}
            action={formAction}
        >
            <input type="hidden" name="slug" value={slug} />

            {/* <FormInput name="section" label="For Section" placeholder="...">
                <GrGroup />
            </FormInput> */}

            {/* under construct */}

            {/* under construct */}

            <div className="w-full">
                <Button type="submit" className="w-full">
                    Create
                </Button>
                <p className="pt-1 text-xs text-destructive text-right">
                    {/* {state.status === 'error' && state.message} */}
                </p>
            </div>

            {/* {state.inviteCode && (
                <div className="flex gap-2">
                    <p>Invite code for section:</p>
                    <CodeLine content={state.section} />
                    <p>is</p>
                    <CodeLine content={state.inviteCode} />
                    <p>.</p>
                </div>
            )} */}
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

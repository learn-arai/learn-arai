'use client';

import * as React from 'react';
import { useState } from 'react';
import { BiRename } from 'react-icons/bi';

import { cn } from '@/lib/utils';

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

export default function DeleteClassroom(props: { classroomSlug: string }) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const { useGetClassroomDetail } = useClassroom();
    const { data } = useGetClassroomDetail(props.classroomSlug);

    const { classroomSlug } = props;
    const title = 'Delete Classroom';
    const description =
        'You will have 20 days to restore it before it is permanently deleted.';

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive">Delete this classroom</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogHeader>
                    <DeleteGroupForm
                        setOpen={setOpen}
                        name={data?.status === 'success' ? data.data.name : ''}
                        classroomSlug={classroomSlug}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="destructive">Delete this classroom</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DrawerHeader>
                <DeleteGroupForm
                    className="px-4"
                    setOpen={setOpen}
                    name={data?.status === 'success' ? data.data.name : ''}
                    classroomSlug={classroomSlug}
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
    setOpen,
    classroomSlug,
    name,
}: React.ComponentProps<'form'> & {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    classroomSlug: string;
    name: string;
}) {
    const { setDeleteTime } = useClassroom();

    const [state, setState] = useState<any>();

    return (
        <form className={cn('grid items-start gap-4', className)}>
            <input
                type="hidden"
                name="group-slug"
                id="group-slug"
                value={classroomSlug}
            />

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
                    onClick={async (_) => {
                        const res = await setDeleteTime(classroomSlug);
                        if (res.status === 'success') setOpen(false);

                        setState(res);
                    }}
                >
                    Delete
                </Button>
                <p className="pt-1 text-xs text-destructive text-right">
                    {state?.status === 'error' && state?.message}
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
                        !!children && 'pl-9',
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

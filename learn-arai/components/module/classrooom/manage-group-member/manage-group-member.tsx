'use client';

import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { BiRename } from 'react-icons/bi';
import { FaPeopleGroup } from 'react-icons/fa6';
import { RiLoader5Fill } from 'react-icons/ri';
import { useQueryClient } from 'react-query';

import { Plus } from 'lucide-react';

import { cn } from '@/lib/utils';

import SlugContext from '@/components/context/SlugContext';
import {
    GroupMember,
    getGroupMemberResult,
    useClassroom,
} from '@/components/hooks/useClassroom';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

import { AddMemberCombo } from './add-member-combo';

function CreateGroupButton(props: React.ComponentProps<'button'>) {
    return (
        <Button size="icon" variant="outline" {...props}>
            <FaPeopleGroup className="w-4 h-4" />
        </Button>
    );
}

export default function ManageGroupMember({
    groupSlug,
}: {
    groupSlug: string;
}) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const title = 'Manage Group Member';

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
                    <CreateGroupForm setOpen={setOpen} groupSlug={groupSlug} />
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
                <CreateGroupForm
                    className="px-4"
                    setOpen={setOpen}
                    groupSlug={groupSlug}
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

function CreateGroupForm({
    className,
    setOpen,
    groupSlug,
}: React.ComponentProps<'form'> & {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    groupSlug: string;
}) {
    const slug = useContext(SlugContext);

    const { useGetGroupMember } = useClassroom();
    const { data, isLoading } = useGetGroupMember(slug, groupSlug);

    console.log(data);

    return (
        <div className={cn('grid items-start gap-4', className)}>
            <Label htmlFor="" className="relative">
                {isLoading && (
                    <div className="text-center text-muted-foreground flex items-center gap-2 justify-center mx-auto py-8">
                        Loading...
                        <RiLoader5Fill className="animate-spin" />
                    </div>
                )}

                {data?.status === 'success' && data.data.length === 0 && (
                    <div className="text-center text-muted-foreground text-xs flex items-center gap-2 justify-center mx-auto py-8">
                        Seem like there is
                        <br />
                        no member in this group...
                    </div>
                )}

                <ul className="mt-2 grid grid-cols-2 gap-2">
                    {data?.status === 'success' &&
                        data.data.map((m) => (
                            <li key={m.userId}>
                                <Card>
                                    <CardContent className="p-3 text-muted-foreground">
                                        {m.userId}
                                    </CardContent>
                                </Card>
                            </li>
                        ))}
                </ul>
            </Label>

            <div className="">
                <Label htmlFor="" className="relative">
                    Add new member
                    <div className="mt-2">
                        <AddMemberCombo />
                    </div>
                </Label>

                <div className="w-full">
                    <p className="pt-1 text-xs text-destructive text-right">
                        hi, im not a error :D
                    </p>
                </div>
            </div>
        </div>
    );
}

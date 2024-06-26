'use client';

import * as React from 'react';
import { useContext, useState } from 'react';
import { FaPeopleGroup } from 'react-icons/fa6';
import { RiLoader5Fill } from 'react-icons/ri';

import { cn } from '@/lib/utils';

import SlugContext from '@/components/context/SlugContext';
import { useClassroom } from '@/components/hooks/useClassroom';
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
import { Label } from '@/components/ui/label';

import { AddMemberCombo } from './add-member-combo';

export default function ManageGroupMember({
    groupSlug,
    defaultGroup,
}: {
    groupSlug: string;
    defaultGroup?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const title = 'Manage Group Member';

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button size="icon" variant="outline">
                        <FaPeopleGroup className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <ManageGroupForm
                        groupSlug={groupSlug}
                        defaultGroup={defaultGroup}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button size="icon" variant="outline">
                    <FaPeopleGroup className="h-4 w-4" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                <ManageGroupForm
                    className="px-4"
                    groupSlug={groupSlug}
                    defaultGroup={defaultGroup}
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

function ManageGroupForm({
    className,
    groupSlug,
    defaultGroup,
}: React.ComponentProps<'form'> & {
    groupSlug: string;
    defaultGroup?: boolean;
}) {
    const slug = useContext(SlugContext);

    const { useGetGroupMember } = useClassroom();
    const { data, isLoading } = useGetGroupMember(slug, groupSlug);

    return (
        <div className={cn('grid items-start gap-4', className)}>
            <Label htmlFor="" className="relative">
                {isLoading && (
                    <div className="mx-auto flex items-center justify-center gap-2 py-8 text-center text-muted-foreground">
                        Loading...
                        <RiLoader5Fill className="animate-spin" />
                    </div>
                )}

                {data?.status === 'success' && data.data.length === 0 && (
                    <div className="mx-auto flex items-center justify-center gap-2 py-8 text-center text-xs text-muted-foreground">
                        Seem like there is
                        <br />
                        no member in this group...
                    </div>
                )}

                <ul className="mt-2 grid grid-cols-2 gap-2">
                    {data?.status === 'success' &&
                        data.data.map((m) => (
                            <li key={m.id}>
                                <Card>
                                    <CardContent className="p-3 text-muted-foreground">
                                        {m.firstName} {m.lastName}
                                    </CardContent>
                                </Card>
                            </li>
                        ))}
                </ul>
            </Label>

            {!defaultGroup && (
                <Label htmlFor="" className="relative">
                    Add new member
                    <div className="mt-2">
                        <AddMemberCombo
                            groupSlug={groupSlug}
                            groupMember={
                                data?.status === 'success' ? data.data : []
                            }
                        />
                    </div>
                </Label>
            )}
        </div>
    );
}

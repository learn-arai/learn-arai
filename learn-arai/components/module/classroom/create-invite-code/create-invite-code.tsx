'use client';

import * as React from 'react';
import { useState } from 'react';
import { useFormState } from 'react-dom';

import { Plus } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useClassroom } from '@/components/hooks/useClassroom';
import { SelectedGroup } from '@/components/hooks/useCreateInviteCode';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { GroupSelectedInput } from '@/components/module/classroom/create-invite-code/group-selected-input';
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
import { Label } from '@/components/ui/label';

import GroupSelectedDisplay from './group-selected-display';
import './input-chip.css';

export default function CreateInvite(props: { classroomSlug: string }) {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [open, setOpen] = useState(false);
    const title = 'Create Invite Code';

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="flex items-center gap-1" size="sm">
                        Create Invite Code <Plus className="w-4 h-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <CreateInviteForm classroomSlug={props.classroomSlug} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button className="flex items-center gap-1" size="sm">
                    Create Invite Code <Plus className="w-4 h-4" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>{title}</DrawerTitle>
                </DrawerHeader>
                <CreateInviteForm
                    classroomSlug={props.classroomSlug}
                    className="px-4"
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

function CreateInviteForm({
    className,
    classroomSlug,
}: React.ComponentProps<'form'> & { classroomSlug: string }) {
    const { createInviteCode } = useClassroom();
    const [selectedGroup, setSelectedGroup] = useState<SelectedGroup>({});

    const [state, formAction] = useFormState(createInviteCode, {
        status: 'idle',
    });

    const deleteChip = (key: string) => {
        if (selectedGroup[key] == 'General') {
            return;
        }

        setSelectedGroup((prev) => {
            delete prev[key];
            return { ...prev };
        });
    };

    return (
        <form
            className={cn('grid items-start gap-4', className)}
            action={formAction}
        >
            <GroupSelectedInput
                classroomSlug={classroomSlug}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
                deleteChip={deleteChip}
            />

            <input
                type="hidden"
                name="group_slug"
                value={(() => {
                    let selectedGroups = [];
                    for (let key in selectedGroup) {
                        selectedGroups.push(key);
                    }
                    return JSON.stringify(selectedGroups);
                })()}
            />

            <div className="grid w-full items-center gap-1.5">
                <Label>Selected Group</Label>
                <div className="p-2 border-2 rounded-md">
                    {Object.values(selectedGroup).length != 0 && (
                        <GroupSelectedDisplay
                            selectedGroup={selectedGroup}
                            deleteChip={deleteChip}
                        />
                    )}
                </div>
            </div>

            <div className="w-full">
                <Button type="submit" className="w-full">
                    Create
                </Button>
                <p className="pt-1 text-xs text-destructive text-right">
                    {state.status === 'error' && state.message}
                </p>
            </div>

            {state.status == 'success' && (
                <>
                    <div className="flex gap-2">
                        <p>Invite code is : </p>
                        <CodeLine content={state.invite_code} />
                        <p>.</p>
                    </div>

                    <p className="text-center text-gray-400">{state.message}</p>
                </>
            )}
        </form>
    );
}

'use client';

import * as React from 'react';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { FaPlus } from 'react-icons/fa6';

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
            // <Dialog open={open} onOpenChange={setOpen}>
            //     <DialogTrigger asChild>
            //         <CreateInviteButton />
            //     </DialogTrigger>
            //     <DialogContent className="sm:max-w-[425px]">
            //         <DialogHeader>
            //             <DialogTitle>{title}</DialogTitle>
            //         </DialogHeader>
                    <CreateInviteForm />
            //     </DialogContent>
            // </Dialog>
        );
    }

    return (
        // <Drawer open={open} onOpenChange={setOpen}>
        //     <DrawerTrigger asChild>
        //         <CreateInviteButton />
        //     </DrawerTrigger>
        //     <DrawerContent>
        //         <DrawerHeader className="text-left">
        //             <DrawerTitle>{title}</DrawerTitle>
        //         </DrawerHeader>
                <CreateInviteForm className="px-4" />
        //          <DrawerFooter className="pt-2">
        //             <DrawerClose asChild>
        //                 <Button variant="outline">Cancel</Button>
        //             </DrawerClose>
        //         </DrawerFooter>
        //     </DrawerContent>
        // </Drawer>
    ); 
}

function CreateInviteForm({ className }: React.ComponentProps<'form'>) {
    const { createInviteCode } = useClassroom();
    const [selectedGroup, setSelectedGroup] = useState<SelectedGroup>({});

    const [state, formAction] = useFormState(createInviteCode, {
        status: 'idle',
    });

    const deleteChip = (key: string) => {
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

            {Object.values(selectedGroup).length != 0 && (
                <div className="grid w-full items-center gap-1.5">
                    <Label>Selected Group</Label>
                    <div className="p-2 border-2 rounded-md">
                        <GroupSelectedDisplay
                            selectedGroup={selectedGroup}
                            deleteChip={deleteChip}
                        />
                    </div>
                </div>
            )}

            <div className="w-full">
                <Button type="submit" className="w-full">
                    Create
                </Button>
                <p className="pt-1 text-xs text-destructive text-right">
                    {/* {state.status === 'error' && state.message} */}
                </p>
            </div>

            {state.status == 'success' && (
                <>
                    <div className="flex gap-2">
                        <p>Invite code is : </p>
                        <CodeLine content={state.invite_code} />
                        <p>.</p>
                    </div>
                    
                <p className='text-center text-gray-400'>{state.message}</p>
                </>
            )}
        </form>
    );
}

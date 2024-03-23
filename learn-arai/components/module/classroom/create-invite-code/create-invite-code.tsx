'use client';

import * as React from 'react';
import { useState } from 'react';
import { useFormState } from 'react-dom';

import { cn } from '@/lib/utils';

import { useClassroom } from '@/components/hooks/useClassroom';
import { SelectedGroup } from '@/components/hooks/useCreateInviteCode';
import { useMediaQuery } from '@/components/hooks/useMediaQuery';
import { GroupSelectedInput } from '@/components/module/classroom/create-invite-code/group-selected-input';
import { Button } from '@/components/ui/button';
import CodeLine from '@/components/ui/code-line';
import { Label } from '@/components/ui/label';

import GroupSelectedDisplay from './group-selected-display';
import './input-chip.css';

export default function CreateInvite() {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    if (isDesktop) {
        return <CreateInviteForm />;
    }

    return <CreateInviteForm className="px-4" />;
}

function CreateInviteForm({ className }: React.ComponentProps<'form'>) {
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

'use client';

import * as React from 'react';
import { useContext, useEffect, useState } from 'react';

import { Check, ChevronsUpDown, Mail, PhoneCall } from 'lucide-react';
import { useDebounceCallback } from 'usehooks-ts';

import { cn } from '@/lib/utils';

import SlugContext from '@/components/context/SlugContext';
import { GroupMember, useClassroom } from '@/components/hooks/useClassroom';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface Student {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export function AddMemberCombo(props: {
    groupSlug: string;
    groupMember: GroupMember[];
}) {
    const slug = useContext(SlugContext);
    const { groupSlug, groupMember } = props;

    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [users, setUsers] = useState<Student[]>([]);

    const {
        useSearchStudentMember,
        searchStudentMember,
        addMemberToGroup,
        removeMemberToGroup,
        useGetGroupMember,
    } = useClassroom();
    const { data } = useSearchStudentMember(slug, '');
    useEffect(() => {
        if (data === undefined || data.data.student === undefined) return;

        if (data?.status === 'error') {
            setError(data.message);
        }

        setUsers(data.data.student);
    }, [data]);

    const onChange = async (e: string) => {
        const data = await searchStudentMember(slug, e);
        if (data === undefined || data.data.student === undefined) return;

        if (data?.status === 'error') {
            setError(data.message);
        }

        setUsers(data.data.student);
    };

    const debounced = useDebounceCallback(onChange, 500);
    const { refetch } = useGetGroupMember(slug, groupSlug, {
        enabled: false,
    });

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        <span className="text-muted-foreground">
                            Search using Email, Name, Phone, ...
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <div className="w-full">
                    <p className="pt-1 text-xs text-destructive text-right">
                        {error}
                    </p>
                </div>

                <PopoverContent className="w-[calc(425px_-_3rem)] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search user..."
                            onValueChange={debounced}
                        />
                        <CommandEmpty>No user found.</CommandEmpty>

                        <CommandList>
                            {users.map((u) => {
                                const isMember =
                                    groupMember.find((m) => m.id === u.id) !==
                                    undefined;

                                return (
                                    <CommandItem
                                        key={u.id}
                                        value={u.id}
                                        onSelect={async (
                                            currentValue: string
                                        ) => {
                                            let data;
                                            if (isMember) {
                                                data =
                                                    await removeMemberToGroup(
                                                        slug,
                                                        groupSlug,
                                                        currentValue
                                                    );
                                            } else {
                                                data = await addMemberToGroup(
                                                    slug,
                                                    groupSlug,
                                                    currentValue
                                                );
                                            }

                                            if (data.success === 'error') {
                                                setError(data.message);
                                                return;
                                            }

                                            await refetch();
                                        }}
                                        className="hover:cursor-pointer"
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                isMember
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />

                                        <div>
                                            <p className="font-bold">
                                                {u.firstName} {u.lastName}{' '}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <PhoneCall className="h-3 w-3" />{' '}
                                                {u.phoneNumber}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Mail className="h-3 w-3" />{' '}
                                                {u.email}
                                            </p>
                                        </div>
                                    </CommandItem>
                                );
                            })}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}

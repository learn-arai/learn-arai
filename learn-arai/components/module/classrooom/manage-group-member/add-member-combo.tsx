'use client';

import * as React from 'react';
import { useContext, useEffect, useState } from 'react';

import { ChevronsUpDown, Mail, PhoneCall } from 'lucide-react';
import { useDebounceCallback } from 'usehooks-ts';

import SlugContext from '@/components/context/SlugContext';
import { useClassroom } from '@/components/hooks/useClassroom';
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

export function AddMemberCombo() {
    const slug = useContext(SlugContext);

    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState<Student[]>([]);

    const { useSearchStudentMember, searchStudentMember } = useClassroom();
    const { data } = useSearchStudentMember(slug, '');
    useEffect(() => {
        if (data === undefined || data.data.student === undefined) return;

        setUsers(data.data.student);
    }, [data]);

    const onChange = async (e: string) => {
        const data = await searchStudentMember(slug, e);
        if (data === undefined || data.data.student === undefined) return;

        setUsers(data.data.student);
    };

    const debounced = useDebounceCallback(onChange, 500);

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
                <PopoverContent className="w-[calc(425px_-_3rem)] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search user..."
                            onValueChange={debounced}
                        />
                        <CommandEmpty>No user found.</CommandEmpty>

                        <CommandList>
                            {users.map((u) => (
                                <CommandItem
                                    key={u.id}
                                    value={u.id}
                                    onSelect={(currentValue: string) => {
                                        console.log(currentValue);
                                    }}
                                    className="hover:cursor-pointer"
                                >
                                    <ChevronsUpDown className="mr-2 h-4 w-4" />

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
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}

'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { Check, ChevronsUpDown, Mail, PhoneCall } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
}

export function AddMemberCombo() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | undefined>();

    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        onChange('');
    }, []);

    const onChange = async (e: string) => {
        const res = await fetch(
            `/api/user/search?query=${encodeURIComponent(e)}`
        );
        const data = await res.json();

        if (data.status === 'error') {
            return;
        }

        setUsers(data.data);
    };

    return (
        <>
            <input type="hidden" value={value} />

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {value && selectedUser ? (
                            selectedUser.email
                        ) : (
                            <span className="text-muted-foreground">
                                Search using Email, Name, Phone, ...
                            </span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(425px_-_3rem)] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search user..."
                            // onValueChange={(e) => debounced(e)}
                        />
                        <CommandEmpty>No user found.</CommandEmpty>
                        <CommandGroup>
                            {users.map((u) => (
                                <CommandItem
                                    key={u.id}
                                    value={u.id}
                                    onSelect={(currentValue) => {
                                        if (currentValue === value) {
                                            setValue('');
                                            setSelectedUser(undefined);
                                            setOpen(false);
                                            return;
                                        }

                                        setValue(currentValue);
                                        setSelectedUser(u);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === u.id
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
                                            {u.phone}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Mail className="h-3 w-3" />{' '}
                                            {u.email}
                                        </p>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}

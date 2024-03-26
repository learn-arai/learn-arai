'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import {
    Group,
    SelectedGroup,
    useCreateInviteCode,
} from '../../../hooks/useCreateInviteCode';
import { Separator } from '../../../ui/separator';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import GroupSelectedDisplay from './group-selected-display';

type Prop = {
    selectedGroup: SelectedGroup;
    setSelectedGroup: React.Dispatch<React.SetStateAction<SelectedGroup>>;
    deleteChip: (title: string) => void;
};

export function GroupSelectedInput({
    selectedGroup,
    setSelectedGroup,
    deleteChip,
}: Prop) {
    const [query, setQuery] = useState('');
    const [queryData, setQueryData] = useState<Group[]>([]);
    const { getQueryGroup } = useCreateInviteCode();
    const { createNewGroup } = useCreateInviteCode();
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        getQueryGroup(query).then((res) => {
            setQueryData(
                res!.groupList.map((row) => {
                    return {
                        slug: row.slug,
                        title: row.title,
                    };
                })
            );

            if (selectedGroup[res!.defaultGroup] == undefined) {
                setSelectedGroup({
                    [res!.defaultGroup]: 'General',
                });
            }
        });
    }, [getQueryGroup, query, selectedGroup, setSelectedGroup]);

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <div>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        id="selectGroupBtn"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        Select Group
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </div>
            </PopoverTrigger>
            <PopoverContent className={`p-0 w-full`} aria-modal>
                <Command className="w-[60vh]" shouldFilter={false}>
                    <CommandInput
                        placeholder="Search group..."
                        id="searchBox"
                        value={query ? query : ''}
                        onChangeCapture={(e) => {
                            setQuery(e.currentTarget.value);
                        }}
                    />
                    <CommandEmpty className="p-4">
                        No group found, press enter to create new group.
                    </CommandEmpty>

                    <CommandList>
                        <Separator />

                        <CommandGroup className="relative">
                            <div className="p-2 sticky top-0 h-fit">
                                <GroupSelectedDisplay
                                    selectedGroup={selectedGroup}
                                    deleteChip={deleteChip}
                                />
                            </div>

                            {query &&
                                queryData.filter((row) => row.title == query)
                                    .length == 0 && (
                                    <div className="relative">
                                        <CommandItem
                                            className="hover:cursor-pointer"
                                            onSelect={async (currentValue) => {
                                                const data =
                                                    await createNewGroup(
                                                        currentValue
                                                    );
                                                setQuery('');
                                                setSelectedGroup((prev) => {
                                                    return {
                                                        ...prev,
                                                        [data.data.slug]:
                                                            currentValue,
                                                    };
                                                });
                                            }}
                                        >
                                            {query}{' '}
                                        </CommandItem>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                            {' '}
                                            <Icon icon="icon-park-outline:enter-key" />{' '}
                                            create new group{' '}
                                        </div>
                                    </div>
                                )}

                            <Separator />

                            {queryData.map((row) => {
                                return (
                                    <CommandItem
                                        className="hover:cursor-pointer"
                                        key={row.slug}
                                        value={row.slug}
                                        onSelect={() => {
                                            setSelectedGroup((prev) => {
                                                // if already selected, remove it\
                                                if (row.title == 'General') {
                                                    return { ...prev };
                                                }

                                                if (prev[row.slug]) {
                                                    delete prev[row.slug];
                                                    return { ...prev };
                                                }
                                                return {
                                                    ...prev,
                                                    [row.slug]: row.title,
                                                };
                                            });
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                selectedGroup[row.slug] !=
                                                    undefined
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                        {row.title}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

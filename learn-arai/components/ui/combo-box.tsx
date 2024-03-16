'use client';

import * as React from 'react';
import { MdCancel } from 'react-icons/md';

import SlugContext from '../context/SlugContext';
import { useClassroom } from '../hooks/useClassroom';
import { useGroup } from '../hooks/useGroup';
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

import './chip.css';
import { Group, SelectedGroup, useCreateInviteCode } from '../hooks/useCreateInviteCode';
import { useEffect, useState } from 'react';

export function ComboBox() {
    const [ query, setQuery ] = useState('');
    const [ queryData, setQueryData ] = useState<Group[]>([]);
    const { getQueryGroup } = useCreateInviteCode();
    const { createNewGroup } = useCreateInviteCode();
    const [ selectedGroup, setSelectedGroup ] = useState<SelectedGroup>({});
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        getQueryGroup(query).then((res) => {
            setQueryData(
                res!.map((row) => {
                    return {
                        slug: row.slug,
                        title: row.title,
                    };
                })
            );
        });
    }, [query]);

    
    

    // const handleFunction = (e: any) => {
    //     const groupTitle = e.target.value;

    //     if (groupTitle == '') {
    //         return;
    //     }

    //     const isGroupExist = ( groupTitle : string) => {
    //         for (let i = 0; i < data.length; i++) {
    //             if (data[i].title == groupTitle ) {
    //                 return true;
    //             }
    //         }

    //         return false;
    //     };

    //     // if (!isGroupExist(newLabel)) {
    //     //     setIsCurrentSearchGroupExist(false);
    //     // }

    //     // if (!isGroupExist(newLabel) && e.key == 'Enter') {
    //         // setValue('');

    //         // const formData = new FormData();

    //         // formData.append('title', newLabel);

    //         // createNewGroup(formData).then((response) => {
    //         //     setData([
    //         //         ...data,
    //         //         {
    //         //             label: newLabel,
    //         //             value: response.data.slug,
    //         //             isSelected: true,
    //         //         },
    //         //     ]);
    //         // });
    //     // }
    // };

    // const deleteChip = (label: string) => {
    //     setData((prev) => {
    //         for (let i = 0; i < data.length; i++) {
    //             if (prev[i].label == label) {
    //                 prev[i].isSelected = false;
    //                 break;
    //             }
    //         }

    //         return [...prev];
    //     });
    // };

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <div>
                    <Button
                        variant="outline"
                        role="combobox"
                        id="selectGroupBtn"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        Select Group
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>

                    {/* {data.filter((item) => item.isSelected).length == 0 && (
                        <ul>
                            {data.map((row) => {
                                if (row.isSelected) {
                                    return (
                                        <Chip
                                            key={row.value}
                                            label={row.label}
                                            deleteChip={deleteChip}
                                        />
                                    );
                                }
                            })}
                        </ul>
                    )} */}
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
                        <CommandGroup>
                            { (!Object.values(selectedGroup).includes(query) 
                                && 
                                (query)
                                &&
                                queryData.filter(row => row.title == query).length == 0) && (
                                <div className="relative">
                                    <CommandItem
                                        className="hover:cursor-pointer"
                                        onSelect={(currentValue) => {
                                            createNewGroup(currentValue);
                                            setQuery('');

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

                            {queryData.map((row) => (
                                <CommandItem
                                    className="hover:cursor-pointer"
                                    key={row.slug}
                                    value={row.slug}
                                    onSelect={() => {
                                        setSelectedGroup(
                                            (prev) => {
                                                // if already selected, remove it
                                                if (prev[row.slug]) {
                                                    delete prev[row.slug];
                                                    return {...prev};
                                                }
                                                return {
                                                    ...prev,
                                                    [row.slug]: row.title,
                                                };
                                            }
                                        );
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            selectedGroup[row.slug] != undefined
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                    {row.title}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

function Chip({
    label,
    deleteChip,
}: {
    label: string;
    deleteChip: (label: string) => void;
}) {
    return (
        <li>
            <button
                type="button"
                className="chip"
                onClick={() => deleteChip(label)}
            >
                {label}
                <MdCancel />
            </button>
        </li>
    );
}

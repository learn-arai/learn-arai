'use client';

import * as React from 'react';
import { MdCancel } from 'react-icons/md';

import SlugContext from '../context/SlugContext';
import { useGroup } from '../hooks/useGroup';
import { Group } from '../module/classrooom/create-invited-code/create-invite-code';
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

interface prop {
    data: Group[];
    setData: React.Dispatch<React.SetStateAction<Group[]>>;
}

export function ComboBox({ data, setData }: prop) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<string | null>(null);
    const selectGroupBtn = React.useRef<HTMLButtonElement>(null);
    const { createNewGroup } = useGroup();

    const handleFunction = (e: any) => {
        const newLabel = e.target.value;

        if ( newLabel == '' ) {
            return;
        }

        const isGroupExist = (newLabel: string) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].label == newLabel) {
                    return true;
                }
            }

            return false;
        };

        if (!isGroupExist(newLabel) && e.key == 'Enter') {
            setValue('');

            const formData = new FormData();

            formData.append('title', newLabel);

            createNewGroup(formData).then((response) => {
                setData([
                    ...data,
                    {
                        label: newLabel,
                        value: response.data.slug,
                        isSelected: true,
                    },
                ]);
            });
        }
    };

    const deleteChip = (label: string) => {
        setData((prev) => {
            for (let i = 0; i < data.length; i++) {
                if (prev[i].label == label) {
                    prev[i].isSelected = false;
                    break;
                }
            }

            return [...prev];
        });
    };

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
                        ref={selectGroupBtn}
                    >
                        Select Group
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>

                    {data.filter((item) => item.isSelected).length == 0 && (
                        <ul >
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
                    )}

                </div>
            </PopoverTrigger>
            <PopoverContent className={`p-0 w-full`} aria-modal>
                <Command className="w-full" shouldFilter={false}>
                    <CommandInput
                        placeholder="Search group..."
                        id="searchBox"
                        onKeyDown={(e) => {
                            handleFunction(e);
                        }}
                        value={value ? value : ''}
                        onChangeCapture={(e) => {
                            setValue(e.currentTarget.value);
                        }}
                    />
                    <CommandEmpty className="p-4">
                        No group found, press enter to create new group.
                    </CommandEmpty>

                    <CommandList>
                        <CommandGroup>
                            {data.map((framework) => (
                                <CommandItem
                                    className="hover:cursor-pointer"
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={(currentValue) => {
                                        setData(
                                            data.map((row) => {
                                                if (row.value == currentValue) {
                                                    row.isSelected =
                                                        !row.isSelected;
                                                }
                                                return row;
                                            })
                                        );
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            framework.isSelected
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                    {framework.label}
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

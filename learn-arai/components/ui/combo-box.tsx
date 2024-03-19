'use client';

import * as React from 'react';
import { MdCancel } from 'react-icons/md';

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

type Framework = {
    label: string;
    value: string;
    isSelected: boolean;
};

interface prop {
    data: Framework[];
    setData: React.Dispatch<React.SetStateAction<Framework[]>>;
}

export function ComboBox({ data, setData }: prop) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<string | null>(null);

    const handleFunction = (e: any) => {
        const value = e.target.value;
        const isValueExist = (value: string) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].value == value) {
                    return true;
                }
            }

            return false;
        };

        if (!isValueExist(value) && e.key == 'Enter') {
            setValue('');

            setData([
                ...data,
                { label: value, value: value, isSelected: true },
            ]);
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
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {/* {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."} */}
                    select group
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" aria-modal>
                <Command className="w-full">
                    <CommandInput
                        placeholder="Search framework..."
                        id="searchBox"
                        onKeyDown={(e) => {
                            handleFunction(e);
                        }}
                        value={value ? value : ''}
                        onChangeCapture={(e) => {
                            setValue(e.currentTarget.value);
                        }}
                    />
                    <CommandEmpty>No framework found.</CommandEmpty>

                    <ul className="table">
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

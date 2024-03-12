'use client';

import * as React from 'react';

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

type Framework = {
  label : string,
  value : string
  isSelected : boolean,
}

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<Framework[]>([]);
  const isValueExist = (value : string) => {
    for ( let i = 0; i < value.length; i++ ){
      if ( data[i].value == value ) {
        return true;
      }
    }

    return false;
  }

  const handleFunction = (e : any) => {
    const value = e.target.value;
    
    if (!isValueExist( value ) && e.key == 'Enter') {
      setData((prev) => {
        prev.push({label : value, value, isSelected : true});
        return [...prev];
      })
    }

  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {/* {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."} */}
            select
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" aria-modal>
        <Command>
          <CommandInput placeholder="Search framework..." onKeyDown={(e) => { handleFunction(e) }}/>
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandList>
          <CommandGroup>
            {data.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  setData((prev) => {
                    for( const row in prev ){
                      if ( prev[row].value == currentValue ) {
                        prev[row].isSelected = true;
                        break;
                      }
                    }
                    return [...prev];
                  })
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    framework.isSelected ? "opacity-100" : "opacity-0"
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
  )
}

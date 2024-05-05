'use client';

import * as React from 'react';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import { TimePicker } from './time-picker';

export function DatePicker(props: { defaultDate?: Date; disabled?: boolean }) {
    const { defaultDate, disabled } = props;

    const [date, setDate] = React.useState<Date | undefined>(defaultDate);

    return (
        <>
            <input
                type="hidden"
                name="due_date"
                id="due_date"
                value={date?.toISOString() || ''}
            />

            <Popover>
                <PopoverTrigger asChild disabled={disabled}>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'mt-2 w-full justify-start px-2 text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                        disabled={disabled}
                    >
                        <CalendarIcon className="mr-3 h-4 w-4" />
                        {date ? (
                            format(date, 'PPP HH:mm:ss')
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="relative w-auto p-0">
                    <div className="border-b border-border p-3">
                        <TimePicker setDate={setDate} date={date} />
                    </div>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        fromDate={new Date()}
                    />
                </PopoverContent>
            </Popover>
        </>
    );
}

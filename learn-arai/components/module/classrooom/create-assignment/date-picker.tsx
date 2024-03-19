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
                            'w-full justify-start text-left font-normal mt-2 px-2',
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
                <PopoverContent className="w-auto p-0 relative">
                    <div className="p-3 border-b border-border">
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

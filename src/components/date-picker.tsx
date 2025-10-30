'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';

interface DatePickerDemoProps {
  onChange?: (date: Date | null) => void;
  value?: Date | null;
}

export function DatePickerDemo({ onChange, value }: DatePickerDemoProps) {
  const [date, setDate] = React.useState<Date | null>(value || null);

  const handleSelect = (selectedDate: Date | undefined) => {
    const newDate = selectedDate ?? null;
    setDate(newDate);
    onChange?.(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );
}

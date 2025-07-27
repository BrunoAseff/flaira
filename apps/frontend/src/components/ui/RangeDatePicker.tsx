'use client';

import { useId, useState } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { X } from 'lucide-react';

export default function RangeDatePicker() {
  const id = useId();
  const [date, setDate] = useState<DateRange | undefined>();

  const handleClear = () => {
    setDate(undefined);
  };

  return (
    <div>
      <div className="*:not-first:mt-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="ghost"
              className="group bg-muted border border-accent w-full hover:bg-muted justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px] relative shadow-xs"
            >
              <span className={cn('truncate', !date && 'text-foreground/60')}>
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'dd/MM/yyyy')} -{' '}
                      {format(date.to, 'dd/MM/yyyy')}
                    </>
                  ) : (
                    format(date.from, 'dd/MM/yyyy')
                  )
                ) : (
                  'Pick a date range'
                )}
              </span>
              {date && (
                <div
                  onClick={handleClear}
                  className="absolute flex items-center justify-center w-6 h-6 text-foreground/30 hover:text-foreground cursor-pointer rounded-sm hover:bg-popover-foreground/10 right-13 transition-all"
                  tabIndex={0}
                  aria-label="Clear input"
                >
                  <X size={26} />
                </div>
              )}
              <div className="absolute flex items-center justify-center w-6 h-6 text-foreground/30 hover:text-foreground cursor-pointer rounded-sm hover:bg-popover-foreground/10 right-3 transition-all">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  tabIndex={0}
                  className="size-6"
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <Calendar mode="range" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

'use client';

import { useId } from 'react';
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

interface RangeDatePickerProps {
  value?: DateRange;
  onValueChange?: (date: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function RangeDatePicker({
  value,
  onValueChange,
  placeholder = 'Pick a date range',
  disabled = false,
  className,
}: RangeDatePickerProps) {
  const id = useId();

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    onValueChange?.(selectedDate);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.(undefined);
  };

  return (
    <div className={className}>
      <div className="*:not-first:mt-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="ghost"
              disabled={disabled}
              className="group bg-muted border border-accent w-full hover:bg-muted justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px] relative shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className={cn('truncate', !value && 'text-foreground/60')}>
                {value?.from ? (
                  value.to ? (
                    <>
                      {format(value.from, 'dd/MM/yyyy')} -{' '}
                      {format(value.to, 'dd/MM/yyyy')}
                    </>
                  ) : (
                    format(value.from, 'dd/MM/yyyy')
                  )
                ) : (
                  placeholder
                )}
              </span>
              {value && !disabled && (
                <div
                  onClick={handleClear}
                  className="absolute flex items-center justify-center size-6 text-foreground/30 hover:text-foreground cursor-pointer rounded-sm hover:bg-popover-foreground/10 right-13 transition-all"
                  tabIndex={0}
                  aria-label="Clear input"
                >
                  <X size={26} />
                </div>
              )}
              <div className="absolute flex items-center justify-center size-6 text-foreground/30 hover:text-foreground cursor-pointer rounded-sm hover:bg-popover-foreground/10 right-3 transition-all">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  className="size-6"
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <Calendar
              mode="range"
              selected={value}
              onSelect={handleDateSelect}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

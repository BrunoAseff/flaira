'use client';

import { AutocompleteInput } from '@/components/autocompleteInput';
import { Button } from '@/components/ui/button';
import {
  Cancel01Icon,
  PlusSignIcon,
  Location01Icon,
  StopCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { useLayoutEffect, useRef, useState } from 'react';
import type { Location } from '@/types/route';

interface AnimatedStopsProps {
  children: React.ReactNode;
}

function AnimatedStops({ children }: AnimatedStopsProps) {
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [currentMaxHeight, setCurrentMaxHeight] = useState('0px');

  useLayoutEffect(() => {
    if (contentWrapperRef.current) {
      const hasStops = contentWrapperRef.current.scrollHeight > 0;
      const marginOffset = hasStops ? 16 : 0;

      const height = contentWrapperRef.current.scrollHeight + marginOffset;
      setCurrentMaxHeight(`${height}px`);
    }
  }, [children]);

  return (
    <div
      style={{ maxHeight: currentMaxHeight }}
      className="w-full overflow-hidden transition-[max-height] duration-500 ease-in-out"
    >
      <div ref={contentWrapperRef} className="flex flex-col gap-3 m-2">
        {children}
      </div>
    </div>
  );
}

interface LocationInputsProps {
  stops: { id: number }[];
  inputValues: Record<string, string>;
  onAddStop: () => void;
  onRemoveStop: (id: number) => void;
  onLocationSelect: (key: string, location: Location) => void;
  onInputChange: (key: string, value: string) => void;
}

export default function LocationInputs({
  stops,
  inputValues,
  onAddStop,
  onRemoveStop,
  onLocationSelect,
  onInputChange,
}: LocationInputsProps) {
  const renderInputRow = (
    icon: IconSvgElement,
    placeholder: string,
    key: string,
    onRemove?: () => void
  ) => (
    <div
      key={key}
      className="flex items-center gap-3 w-full text-foreground/60"
    >
      <HugeiconsIcon
        icon={icon}
        size={28}
        className="min-w-[18px] rounded-full"
      />
      <AutocompleteInput
        placeholder={placeholder}
        value={inputValues[key] || ''}
        onChange={(value) => onInputChange(key, value)}
        onLocationSelect={(location) => onLocationSelect(key, location)}
        className="w-full max-w-none flex-1"
      />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-accent-foreground hover:text-error hover:bg-error/10 transition-all rounded-lg p-1"
          aria-label="Remove stop"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={17} />
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-1 pt-5">
      {renderInputRow(Location01Icon, 'Start location', 'start')}

      <AnimatedStops>
        {stops.map((stop, index) =>
          renderInputRow(
            StopCircleIcon,
            `Stop ${index + 1}`,
            `stop-${stop.id}`,
            () => onRemoveStop(stop.id)
          )
        )}
      </AnimatedStops>

      <div className="flex items-start w-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddStop}
          aria-label="Add a new stop"
          className="flex items-start text-foreground/60 justify-start size-6 rounded-full bg-transparent hover:bg-popover hover:text-foreground transition-all duration-300"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={12} />
        </Button>
      </div>

      {renderInputRow(Location01Icon, 'End location', 'end')}
    </div>
  );
}

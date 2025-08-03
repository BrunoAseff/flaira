'use client';

import { GeoSearchInput } from '@/components/ui/geo-search';
import { Button } from '@/components/ui/button';
import {
  Cancel01Icon,
  PlusSignIcon,
  Location01Icon,
  StopCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { AnimatedList } from '@/components/ui/AnimatedList';
import type { Location } from '@/types/route';

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
      <GeoSearchInput
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

      <AnimatedList marginOffset={16} gap="gap-3">
        {stops.map((stop, index) =>
          renderInputRow(
            StopCircleIcon,
            `Stop ${index + 1}`,
            `stop-${stop.id}`,
            () => onRemoveStop(stop.id)
          )
        )}
      </AnimatedList>

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

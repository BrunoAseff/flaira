'use client';

import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { HugeiconsIcon } from '@hugeicons/react';
import { TRANSPORT_OPTIONS } from '@/constants/trip';

interface TransportModeSelectorProps {
  onTransportModeChange: (value: string) => void;
}

export default function TransportModeSelector({
  onTransportModeChange,
}: TransportModeSelectorProps) {

  return (
    <div className="flex flex-col gap-3 pt-4">
      <Label className="text-base">Transportation</Label>
      <ToggleGroup
        type="single"
        onValueChange={(value) => value && onTransportModeChange(value)}
        variant="outline"
        className="grid grid-cols-2 gap-3"
      >
        {TRANSPORT_OPTIONS.map(({ value, label, icon }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-label={label}
            className="flex gap-2 items-center flex-1"
          >
            <HugeiconsIcon icon={icon} size={18} />
            <span>{label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

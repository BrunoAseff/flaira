'use client';

import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  AirplaneModeIcon,
  BicycleIcon,
  Bus01Icon,
  Car05Icon,
  CargoShipIcon,
  FerryBoatIcon,
  Motorbike02Icon,
  WorkoutRunIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface TransportModeSelectorProps {
  onTransportModeChange: (value: string[]) => void;
}

export default function TransportModeSelector({
  onTransportModeChange,
}: TransportModeSelectorProps) {
  const transportOptions = [
    { value: 'feet', label: 'On feet', icon: WorkoutRunIcon },
    { value: 'bicycle', label: 'Bicycle', icon: BicycleIcon },
    { value: 'car', label: 'Car', icon: Car05Icon },
    { value: 'motorbike', label: 'Motorbike', icon: Motorbike02Icon },
    { value: 'bus', label: 'Bus', icon: Bus01Icon },
    { value: 'plane', label: 'Plane', icon: AirplaneModeIcon },
    { value: 'ship', label: 'Ship', icon: CargoShipIcon },
    { value: 'boat', label: 'Boat', icon: FerryBoatIcon },
  ];

  return (
    <div className="flex flex-col gap-3 pt-4">
      <Label className="text-base">Transportation</Label>
      <ToggleGroup
        type="multiple"
        onValueChange={(value) => value && onTransportModeChange([value[0]])}
        variant="outline"
        className="grid grid-cols-2 gap-3"
      >
        {transportOptions.map(({ value, label, icon }) => (
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

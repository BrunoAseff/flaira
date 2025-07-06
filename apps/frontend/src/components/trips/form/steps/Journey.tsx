"use client";

import MapView from "@/components/map/MapView";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  AirplaneModeIcon,
  BicycleIcon,
  Bus01Icon,
  Car05Icon,
  CargoShipIcon,
  FerryBoatIcon,
  MapsCircle02Icon,
  Motorbike02Icon,
  PlusSignIcon,
  CircleArrowRightDoubleIcon,
  WorkoutRunIcon,
  Cancel01Icon,
  StopCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";

interface AnimatedStopsProps {
  children: React.ReactNode;
}

function AnimatedStops({ children }: AnimatedStopsProps) {
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [currentMaxHeight, setCurrentMaxHeight] = useState("0px");

  // biome-ignore lint:
  useEffect(() => {
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
export default function Journey() {
  const [hasTripFinished, setHasTripFinished] = useState(false);
  const [stops, setStops] = useState<{ id: number }[]>([]);

  const handleTripStatusChange = (checked: boolean) => {
    setHasTripFinished(!checked);
  };

  const handleAddStop = () => {
    setStops((prev) => [...prev, { id: Date.now() }]);
  };

  const handleRemoveStop = (id: number) => {
    setStops((prev) => prev.filter((stop) => stop.id !== id));
  };

  const transportOptions = [
    { value: "feet", label: "On feet", icon: WorkoutRunIcon },
    { value: "bicycle", label: "Bicycle", icon: BicycleIcon },
    { value: "car", label: "Car", icon: Car05Icon },
    { value: "motorbike", label: "Motorbike", icon: Motorbike02Icon },
    { value: "bus", label: "Bus", icon: Bus01Icon },
    { value: "plane", label: "Plane", icon: AirplaneModeIcon },
    { value: "ship", label: "Ship", icon: CargoShipIcon },
    { value: "boat", label: "Boat", icon: FerryBoatIcon },
  ];

  const renderInputRow = (
    icon: IconSvgElement,
    placeholder: string,
    key: string,
    onRemove?: () => void,
  ) => (
    <div
      key={key}
      className="flex items-center gap-3 w-full text-foreground/80"
    >
      <HugeiconsIcon
        icon={icon}
        size={28}
        className="min-w-[18px] rounded-full"
      />
      <Input
        className="w-full max-w-none flex-1"
        placeholder={placeholder}
        type="text"
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
    <div className="flex flex-col md:flex-row mx-6 md:ml-10 gap-6 h-full scrollbar-gutter-stable overflow-y-auto">
      <div className="flex flex-col justify-start w-full md:w-[40%] gap-2">
        <div className="flex flex-col flex-1 gap-1 pt-5">
          {renderInputRow(
            CircleArrowRightDoubleIcon,
            "Start location",
            "start-location",
          )}

          <AnimatedStops>
            {stops.map((stop, index) =>
              renderInputRow(
                StopCircleIcon,
                `Stop ${index + 1}`,
                `stop-${stop.id}`,
                () => handleRemoveStop(stop.id),
              ),
            )}
          </AnimatedStops>

          <div className="flex items-start w-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddStop}
              aria-label="Add a new stop"
              className="flex items-start text-foreground/60 justify-start size-6 rounded-full bg-transparent hover:bg-muted hover:text-foreground transition-all duration-300"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={12} />
            </Button>
          </div>

          {renderInputRow(MapsCircle02Icon, "End location", "end-location")}
        </div>
        <div className="flex flex-col gap-1 w-full px-1">
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="current-trip"
              checked={!hasTripFinished}
              onCheckedChange={handleTripStatusChange}
            />
            <Label htmlFor="current-trip">I am still on this trip.</Label>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-4">
          <Label className="text-base">Transportation</Label>
          <ToggleGroup
            type="multiple"
            variant="outline"
            className="grid grid-cols-4 gap-3"
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
      </div>

      <div className="w-[60%] mx-2 mt-2 rounded-xl hidden md:flex justify-start">
        <MapView
          containerStyle={{
            borderRadius: "16px",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}

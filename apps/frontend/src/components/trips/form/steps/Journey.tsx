"use client";

import MapView from "@/components/map/MapView";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  AirplaneModeIcon,
  BicycleIcon,
  Bus01Icon,
  Car05Icon,
  CargoShipIcon,
  FerryBoatIcon,
  Location09Icon,
  Motorbike02Icon,
  PlusSignIcon,
  RouteBlockIcon,
  WorkoutRunIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
      setCurrentMaxHeight(`${contentWrapperRef.current.scrollHeight}px`);
    }
  }, [children]);

  return (
    <div
      style={{ maxHeight: currentMaxHeight }}
      className="w-full overflow-hidden transition-[max-height] duration-500 ease-in-out"
    >
      <div ref={contentWrapperRef} className="flex flex-col gap-3">
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

  return (
    <div className="flex flex-col md:flex-row mx-6 md:ml-10 gap-6 h-full scrollbar-gutter-stable overflow-y-auto">
      <div className="flex flex-col w-full md:w-[40%] gap-2 h-full">
        <div className="flex flex-col w-full gap-1  px-1">
          <div className="flex flex-col gap-1 w-full">
            <Label className="text-base">Start</Label>
            <Input
              className="w-full max-w-none"
              iconLeft={
                <HugeiconsIcon icon={RouteBlockIcon} color="currentColor" />
              }
              type="text"
            />
          </div>

          <AnimatedStops>
            {stops.map((stop, index) => (
              <div
                key={stop.id}
                className={cn(
                  "flex flex-col p-1 w-full z-50",
                  index === 0 ? "mt-3" : "",
                )}
              >
                <div className="flex justify-between items-center">
                  <Label className="text-sm opacity-80">Stop {index + 1}</Label>
                  <button
                    type="button"
                    onClick={() => handleRemoveStop(stop.id)}
                    className="text-accent-foreground hover:text-error hover:bg-error/10 transition-all mb-1 rounded-lg p-1"
                    aria-label="Remove stop"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={17} />
                  </button>
                </div>
                <Input
                  className="w-full max-w-none"
                  iconLeft={
                    <HugeiconsIcon icon={Location09Icon} color="currentColor" />
                  }
                  type="text"
                />
              </div>
            ))}
          </AnimatedStops>

          <div className="flex items-center gap-2 w-full mt-2 px-1">
            <div className="flex-grow border-t-2 border-dashed border-muted" />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddStop}
              aria-label="Add a new stop"
              className="flex items-center text-accent-foreground justify-center size-3 p-4 rounded-full bg-transparent hover:bg-muted hover:text-foreground transition-all duration-300"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={10} />
            </Button>
            <div className="flex-grow border-t-2 border-dashed border-muted" />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <Label className="text-base">End</Label>
            <Input
              className="w-full max-w-none"
              iconLeft={
                <HugeiconsIcon icon={Location09Icon} color="currentColor" />
              }
              type="text"
            />
          </div>
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

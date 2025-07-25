'use client';

import { AutocompleteInput } from '@/components/autocompleteInput';
import MapView from '@/components/map/MapView';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useRouting } from '@/hooks/use-routing';
import {
  AirplaneModeIcon,
  BicycleIcon,
  Bus01Icon,
  Cancel01Icon,
  Car05Icon,
  CargoShipIcon,
  CircleArrowRightDoubleIcon,
  Clock01Icon,
  FerryBoatIcon,
  MapsCircle02Icon,
  Motorbike02Icon,
  PlusSignIcon,
  RouteIcon,
  StopCircleIcon,
  WorkoutRunIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { useEffect, useRef, useState } from 'react';
import type { Location } from '@/types/route';

interface AnimatedStopsProps {
  children: React.ReactNode;
}

function AnimatedStops({ children }: AnimatedStopsProps) {
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [currentMaxHeight, setCurrentMaxHeight] = useState('0px');

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
  const [transportMode, setTransportMode] = useState<string[]>(['car']);
  const [locations, setLocations] = useState<Location[]>([]);
  const [inputValues, setInputValues] = useState<Record<string, string>>({
    start: '',
    end: '',
  });

  const {
    route,
    loading: routeLoading,
    error: routeError,
    calculateRoute,
  } = useRouting();

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

  const handleTripStatusChange = (checked: boolean) => {
    setHasTripFinished(!checked);
  };

  const handleAddStop = () => {
    setStops((prev) => [...prev, { id: Date.now() }]);
  };

  const handleRemoveStop = (id: number) => {
    setStops((prev) => prev.filter((stop) => stop.id !== id));

    setLocations((prev) =>
      prev.filter((loc) => !loc.id.includes(`stop-${id}`))
    );
    setInputValues((prev) => {
      const newValues = { ...prev };
      delete newValues[`stop-${id}`];
      return newValues;
    });
  };

  const handleLocationSelect = (key: string, location: Location) => {
    const updatedLocation = { ...location, id: key };

    setLocations((prev) => {
      const filtered = prev.filter((loc) => loc.id !== key);
      return [...filtered, updatedLocation];
    });
  };

  const handleInputChange = (key: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [key]: value }));

    if (!value.trim()) {
      setLocations((prev) => prev.filter((loc) => loc.id !== key));
    }
  };

  useEffect(() => {
    if (locations.length >= 2) {
      const sortedLocations = [...locations].sort((a, b) => {
        const order = ['start', ...stops.map((s) => `stop-${s.id}`), 'end'];
        return order.indexOf(a.id) - order.indexOf(b.id);
      });

      calculateRoute(sortedLocations, transportMode[0]);
    }
  }, [locations, transportMode, calculateRoute, stops]);

  console.log(route);
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
        onChange={(value) => handleInputChange(key, value)}
        onLocationSelect={(location) => handleLocationSelect(key, location)}
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
    <TooltipProvider>
      <div className="flex flex-col md:flex-row mx-6 h-full">
        <div className="flex flex-col justify-start w-full md:w-[40%] gap-2 max-h-full scrollbar-gutter-stable overflow-y-auto p-1">
          <div className="flex flex-col gap-1 pt-5">
            {renderInputRow(
              CircleArrowRightDoubleIcon,
              'Start location',
              'start'
            )}

            <AnimatedStops>
              {stops.map((stop, index) =>
                renderInputRow(
                  StopCircleIcon,
                  `Stop ${index + 1}`,
                  `stop-${stop.id}`,
                  () => handleRemoveStop(stop.id)
                )
              )}
            </AnimatedStops>

            <div className="flex items-start w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAddStop}
                aria-label="Add a new stop"
                className="flex items-start text-foreground/60 justify-start size-6 rounded-full bg-transparent hover:bg-popover hover:text-foreground transition-all duration-300"
              >
                <HugeiconsIcon icon={PlusSignIcon} size={12} />
              </Button>
            </div>

            {renderInputRow(MapsCircle02Icon, 'End location', 'end')}
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
              onValueChange={(value) => value && setTransportMode([value[0]])}
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

          <div className="flex-1" />
        </div>

        <div className="w-full md:w-[60%] flex flex-col mx-2 mt-2">
          <div className="flex-1 rounded-xl p-2 hidden md:flex justify-start min-h-0">
            <MapView
              containerStyle={{
                borderRadius: '16px',
                width: '100%',
                height: '100%',
              }}
              locations={locations}
              route={route}
              routeLoading={routeLoading}
            />
          </div>

          {route && (
            <div className="flex justify-center items-center gap-8 py-2">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2 text-sm text-foreground/80 cursor-default">
                    <HugeiconsIcon icon={RouteIcon} size={20} />
                    <span>{(route.totalDistance / 1000).toFixed(1)} km</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total estimated trip distance</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2 text-sm text-foreground/80 cursor-default">
                    <HugeiconsIcon icon={Clock01Icon} size={20} />
                    <span>{Math.round(route.totalDuration / 60)} minutes</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total estimated trip duration</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

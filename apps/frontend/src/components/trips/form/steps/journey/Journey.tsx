'use client';

import MapView from '@/components/map/MapView';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useRouting } from '@/hooks/use-routing';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import type { Location } from '@/types/route';
import LocationInputs from './LocationInputs';
import TransportModeSelector from './TransportModeSelector';
import RouteStats from './RouteStats';

export default function Journey() {
  const [hasTripFinished, setHasTripFinished] = useState(false);
  const [stops, setStops] = useState<{ id: number }[]>([]);
  const [transportMode, setTransportMode] = useState<string[]>(['car']);
  const [locations, setLocations] = useState<Location[]>([]);
  const [inputValues, setInputValues] = useState<Record<string, string>>({
    start: '',
    end: '',
  });

  const isMobile = useIsMobile();
  const {
    route,
    loading: routeLoading,
    calculateRoute,
    clearRoute,
  } = useRouting();

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
    if (isMobile) {
      return;
    }

    const validLocations = locations.filter(
      (loc) => loc.coordinates && loc.coordinates.length === 2
    );

    if (validLocations.length >= 2) {
      const sortedLocations = [...validLocations].sort((a, b) => {
        const order = ['start', ...stops.map((s) => `stop-${s.id}`), 'end'];
        return order.indexOf(a.id) - order.indexOf(b.id);
      });

      calculateRoute(sortedLocations, transportMode[0]);
    } else {
      clearRoute();
    }
  }, [locations, transportMode, stops, isMobile]);

  return (
    <TooltipProvider>
      <div className="flex flex-col md:flex-row mx-6 h-full">
        <div className="flex flex-col justify-start w-full md:w-[40%] gap-2 max-h-full scrollbar-gutter-stable overflow-y-auto p-1">
          <LocationInputs
            stops={stops}
            inputValues={inputValues}
            onAddStop={handleAddStop}
            onRemoveStop={handleRemoveStop}
            onLocationSelect={handleLocationSelect}
            onInputChange={handleInputChange}
          />

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

          <TransportModeSelector onTransportModeChange={setTransportMode} />

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

          <RouteStats route={route} />
        </div>
      </div>
    </TooltipProvider>
  );
}

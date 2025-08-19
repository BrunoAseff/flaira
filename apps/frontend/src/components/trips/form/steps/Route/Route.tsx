'use client';

import MapView from '@/components/map/MapView';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useRouting } from '@/hooks/use-routing';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRoute, useTripActions } from '@/stores/trip-store';
import { useEffect, useState } from 'react';
import type { Location } from '@/types/route';
import LocationInputs from './LocationInputs';
import TransportModeSelector from './TransportModeSelector';
import RouteStats from './RouteStats';
import CurrentLocationDialog from './CurrentLocationDialog';

export default function Route() {
  const route = useRoute();
  const actions = useTripActions();
  const [inputValues, setInputValues] = useState<Record<string, string>>({
    start: '',
    end: '',
  });
  const [showGeoModal, setShowGeoModal] = useState(false);
  const [geoCoordinates, setGeoCoordinates] = useState<[number, number] | null>(
    null
  );
  const isMobile = useIsMobile();
  const {
    route: routeData,
    loading: routeLoading,
    calculateRoute,
    clearRoute,
  } = useRouting();

  const handleAddStop = () => {
    actions.addStop();
  };

  useEffect(() => {
    actions.setEstimatedDuration(routeData?.totalDuration || 0);
    actions.setEstimatedDistance(routeData?.totalDistance || 0);
  }, [routeData]);

  const handleRemoveStop = (id: number) => {
    actions.removeStop(id);

    setInputValues((prev) => {
      const newValues = { ...prev };
      delete newValues[`stop-${id}`];
      return newValues;
    });
  };

  const handleLocationSelect = (key: string, location: Location) => {
    const updatedLocation = { ...location, id: key };

    const filtered = route.locations.filter((loc) => loc.id !== key);
    actions.setLocations([...filtered, updatedLocation]);
  };

  const handleInputChange = (key: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [key]: value }));

    if (!value.trim()) {
      actions.setLocations(route.locations.filter((loc) => loc.id !== key));
    }
  };

  const handleGeolocate = (coordinates: [number, number]) => {
    setGeoCoordinates(coordinates);
    setShowGeoModal(true);
  };

  const handleLocationSet = (
    locationType: 'start' | 'end',
    location: Location
  ) => {
    const filtered = route.locations.filter((loc) => loc.id !== locationType);
    actions.setLocations([...filtered, location]);

    setInputValues((prev) => ({
      ...prev,
      [locationType]: location.name,
    }));

    setGeoCoordinates(null);
  };

  useEffect(() => {
    if (isMobile) {
      clearRoute();
      return;
    }

    const order = ['start', ...route.stops.map((s) => `stop-${s.id}`), 'end'];

    const validLocations = route.locations.filter(
      (loc) =>
        loc &&
        loc.id &&
        order.includes(loc.id) &&
        loc.coordinates &&
        loc.coordinates.length === 2
    );

    if (validLocations.length >= 2) {
      const sortedLocations = [...validLocations].sort(
        (a, b) => order.indexOf(a.id!) - order.indexOf(b.id!)
      );

      calculateRoute(sortedLocations, route.transportMode);
    } else {
      clearRoute();
    }
  }, [
    route.locations,
    route.transportMode,
    route.stops,
    isMobile,
    clearRoute,
    calculateRoute,
  ]);

  return (
    <TooltipProvider>
      <div className="flex flex-col md:flex-row mx-6 h-full">
        <div className="flex flex-col justify-start w-full md:w-[40%] gap-2 max-h-full scrollbar-gutter-stable overflow-y-auto p-1">
          <LocationInputs
            stops={route.stops}
            inputValues={inputValues}
            onAddStop={handleAddStop}
            onRemoveStop={handleRemoveStop}
            onLocationSelect={handleLocationSelect}
            onInputChange={handleInputChange}
          />

          <TransportModeSelector
            value={route.transportMode}
            onTransportModeChange={actions.setTransportMode}
          />

          <div className="flex-1" />
        </div>

        <div className="w-full md:w-[60%] flex flex-col mx-2 mt-2">
          <div className="flex-1 rounded-xl p-2 hidden md:flex justify-start min-h-0">
            <div className="w-full h-full rounded-xl overflow-hidden shadow-md">
              <MapView
                containerStyle={{
                  width: '100%',
                  height: '100%',
                }}
                locations={route.locations}
                route={routeData}
                routeLoading={routeLoading}
                onGeolocate={handleGeolocate}
              />
            </div>
          </div>

          <RouteStats route={routeData} />
        </div>
      </div>

      <CurrentLocationDialog
        open={showGeoModal}
        onOpenChange={setShowGeoModal}
        coordinates={geoCoordinates}
        onLocationSet={handleLocationSet}
      />
    </TooltipProvider>
  );
}

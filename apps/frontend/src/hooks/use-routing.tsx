import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Location, Route } from '../types/route';
import {
  calculateTotalApproximateDistance,
  OPEN_ROUTE_MAX_DISTANCE_METERS,
} from '@/utils/routing';

export function useRouting() {
  const [route, setRoute] = useState<Route | null>(null);
  const [queryParams, setQueryParams] = useState<{
    coordinates: number[][];
    profile: string;
  } | null>(null);

  const { isLoading: loading } = useQuery({
    queryKey: ['directions', queryParams],
    queryFn: async () => {
      if (!queryParams) return null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/directions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(queryParams),
        }
      );

      if (!response.ok) {
        throw new Error(`Routing failed: ${response.statusText}`);
      }

      const data = await response.json();
      const route = data.data.routes[0];

      if (!route) {
        throw new Error('No route found');
      }

      const geometry = route.geometry.coordinates;
      const lngs = geometry.map((coord: [number, number]) => coord[0]);
      const lats = geometry.map((coord: [number, number]) => coord[1]);

      const routeData: Route = {
        segments: [
          {
            coordinates: geometry,
            distance: route.distance,
            duration: route.duration,
            instructions:
              route.legs[0]?.steps?.map(
                (step: any) => step.maneuver.instruction
              ) || [],
          },
        ],
        totalDistance: route.distance,
        totalDuration: route.duration,
        bounds: {
          west: Math.min(...lngs),
          east: Math.max(...lngs),
          north: Math.max(...lats),
          south: Math.min(...lats),
        },
      };

      setRoute(routeData);
      return routeData;
    },
    enabled: !!queryParams,
  });

  const calculateRoute = useCallback(
    (locations: Location[], transportMode: string = 'driving') => {
      if (locations.length < 2) {
        setRoute(null);
        setQueryParams(null);
        return;
      }

      const coordinates = locations.map((loc) => loc.coordinates);

      const distance = calculateTotalApproximateDistance(coordinates);

      if (distance > OPEN_ROUTE_MAX_DISTANCE_METERS) return;

      const profileMap: Record<string, string> = {
        car: 'driving',
        feet: 'walking',
        bicycle: 'cycling',
        motorbike: 'driving',
        bus: 'driving',
        plane: 'driving',
        ship: 'driving',
        boat: 'driving',
      };

      const profile = profileMap[transportMode] || 'driving';

      setQueryParams({ coordinates, profile });
    },
    []
  );

  const clearRoute = useCallback(() => {
    setRoute(null);
    setQueryParams(null);
  }, []);

  return { route, loading, calculateRoute, clearRoute };
}

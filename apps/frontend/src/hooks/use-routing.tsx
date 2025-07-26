import { useState, useCallback } from 'react';
import type { Location, Route } from '../types/route';

export function useRouting() {
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateRoute = useCallback(
    async (locations: Location[], transportMode: string = 'driving') => {
      if (locations.length < 2) {
        setRoute(null);
        return;
      }

      setLoading(true);

      try {
        const coordinates = locations.map((loc) => loc.coordinates);

        const profileMap: Record<string, string> = {
          car: 'driving-car',
          feet: 'foot-walking',
          bicycle: 'cycling-regular',
          motorbike: 'driving-car',
          bus: 'driving-hgv',
          plane: 'driving-car',
          ship: 'driving-car',
          boat: 'driving-car',
        };

        const profile = profileMap[transportMode] || 'driving-car';

        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: process.env.NEXT_PUBLIC_OPENROUTE_API_KEY!,
            },
            body: JSON.stringify({
              coordinates,
              format: 'geojson',
              instructions: true,
              geometry_simplify: false,
            }),
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Invalid OpenRouteService API key');
          } else if (response.status === 422) {
            throw new Error('Invalid coordinates or routing parameters');
          }
          throw new Error(`Routing failed: ${response.statusText}`);
        }

        const data = await response.json();

        const feature = data.features[0];

        if (!feature) {
          throw new Error('No route found');
        }

        const geometry = feature.geometry.coordinates;
        const properties = feature.properties;

        const lngs = geometry.map((coord: [number, number]) => coord[0]);
        const lats = geometry.map((coord: [number, number]) => coord[1]);

        const routeData: Route = {
          segments: [
            {
              coordinates: geometry,
              distance: properties.segments?.[0]?.distance || 0,
              duration: properties.segments?.[0]?.duration || 0,
              instructions:
                properties.segments?.[0]?.steps?.map(
                  (step: any) => step.instruction
                ) || [],
            },
          ],
          totalDistance: properties.summary?.distance || 0,
          totalDuration: properties.summary?.duration || 0,
          bounds: {
            west: Math.min(...lngs),
            east: Math.max(...lngs),
            north: Math.max(...lats),
            south: Math.min(...lats),
          },
        };

        setRoute(routeData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to calculate route';
        console.error('Routing error:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearRoute = useCallback(() => {
    setRoute(null);
  }, []);

  return { route, loading, calculateRoute, clearRoute };
}

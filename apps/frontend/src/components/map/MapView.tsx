'use client';

import {
  Map as MapLibreMap,
  Source,
  Layer,
  AttributionControl,
  type ViewState,
} from 'react-map-gl/maplibre';
import { useEffect, useState, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { CSSProperties } from 'react';
import type { Location, Route } from '../../types/route';

interface MapViewProps {
  mapStyle?: string;
  containerStyle?: CSSProperties;
  initialViewState?: Partial<ViewState>;
  locations?: Location[];
  route?: Route | null;
  routeLoading?: boolean;
  onViewStateChange?: (viewState: ViewState) => void;
}

export default function MapView({
  mapStyle,
  containerStyle = { width: '100vw', height: '100vh', borderRadius: '16px' },
  initialViewState = { zoom: 1.5, longitude: 0, latitude: 0 },
  locations,
  route,
  routeLoading = false,
  onViewStateChange,
}: MapViewProps) {
  const [viewState, setViewState] = useState<ViewState>({
    longitude: initialViewState.longitude || 0,
    latitude: initialViewState.latitude || 0,
    zoom: initialViewState.zoom || 1.5,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !locations || !mapLoaded) return;

    const map = mapRef.current.getMap();

    const animateToView = () => {
      if (route) {
        const { bounds } = route;
        const padding = 50;

        map.fitBounds(
          [
            [bounds.west, bounds.south],
            [bounds.east, bounds.north],
          ],
          {
            padding: {
              top: padding,
              bottom: padding,
              left: padding,
              right: padding,
            },
            duration: 1200,
            easing: (t: number) => t * (2 - t),
          }
        );
      } else if (locations.length === 1) {
        const [lng, lat] = locations[0].coordinates;
        map.easeTo({
          center: [lng, lat],
          zoom: 14,
          duration: 1200,
          easing: (t: number) => t * (2 - t),
        });
      } else if (locations.length > 1) {
        const coordinates = locations.map((loc) => loc.coordinates);
        const bounds = coordinates.reduce(
          (bounds, coord) => {
            return [
              [
                Math.min(bounds[0][0], coord[0]),
                Math.min(bounds[0][1], coord[1]),
              ],
              [
                Math.max(bounds[1][0], coord[0]),
                Math.max(bounds[1][1], coord[1]),
              ],
            ];
          },
          [
            [coordinates[0][0], coordinates[0][1]],
            [coordinates[0][0], coordinates[0][1]],
          ]
        );

        map.fitBounds(bounds, {
          padding: { top: 80, bottom: 80, left: 80, right: 80 },
          duration: 1200,
          easing: (t: number) => t * (2 - t),
        });
      }
    };

    setTimeout(animateToView, 200);
  }, [locations, route, mapLoaded]);

  const handleViewStateChange = (evt: any) => {
    setViewState(evt.viewState);
    onViewStateChange?.(evt.viewState);
  };

  const locationsGeoJSON = {
    type: 'FeatureCollection' as const,
    features: locations
      ? locations.map((location, index) => ({
          type: 'Feature' as const,
          properties: {
            name: location.name,
            type:
              index === 0
                ? 'start'
                : index === locations.length - 1
                  ? 'end'
                  : 'waypoint',
          },
          geometry: {
            type: 'Point' as const,
            coordinates: [
              location.coordinates[0],
              location.coordinates[1] - 0.0001,
            ],
          },
        }))
      : [],
  };

  const routeGeoJSON = route
    ? {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            properties: {},
            geometry: {
              type: 'LineString' as const,
              coordinates: route.segments[0]?.coordinates || [],
            },
          },
        ],
      }
    : null;

  return (
    <MapLibreMap
      ref={mapRef}
      {...viewState}
      onMove={handleViewStateChange}
      onLoad={() => setMapLoaded(true)}
      style={containerStyle}
      mapStyle={
        mapStyle ||
        `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
      }
      fadeDuration={500}
      reuseMaps
      attributionControl={false}
    >
      <AttributionControl position="top-right" />
      {routeGeoJSON && (
        <Source id="route" type="geojson" data={routeGeoJSON}>
          <Layer
            id="route-line-shadow"
            type="line"
            paint={{
              'line-color': '#000000',
              'line-width': 8,
              'line-opacity': 0.2,
              'line-blur': 1,
            }}
            layout={{
              'line-join': 'round',
              'line-cap': 'round',
            }}
          />
          <Layer
            id="route-line"
            type="line"
            paint={{
              'line-color': '#2563eb',
              'line-offset': 2,
              'line-width': 5,
            }}
            layout={{
              'line-join': 'round',
              'line-cap': 'round',
            }}
          />
        </Source>
      )}

      {locationsGeoJSON && (
        <Source id="locations" type="geojson" data={locationsGeoJSON}>
          <Layer
            id="location-shadows"
            type="circle"
            paint={{
              'circle-radius': [
                'case',
                ['==', ['get', 'type'], 'start'],
                10,
                ['==', ['get', 'type'], 'end'],
                10,
                8,
              ],
              'circle-color': '#000000',
              'circle-opacity': 0.2,
              'circle-translate': [2, 2],
            }}
          />
          <Layer
            id="location-circles"
            type="circle"
            paint={{
              'circle-radius': [
                'case',
                ['==', ['get', 'type'], 'start'],
                8,
                ['==', ['get', 'type'], 'end'],
                8,
                6,
              ],
              'circle-color': [
                'case',
                ['==', ['get', 'type'], 'start'],
                '#22c55e',
                ['==', ['get', 'type'], 'end'],
                '#ef4444',
                '#f59e0b',
              ],
              'circle-stroke-width': 3,
              'circle-stroke-color': '#ffffff',
            }}
          />
          <Layer
            id="location-labels"
            type="symbol"
            layout={{
              'text-field': ['get', 'name'],
              'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 1],
              'text-anchor': 'top',
              'text-size': 13,
              'text-max-width': 12,
              'text-line-height': 1.2,
            }}
            paint={{
              'text-color': '#1f2937',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2.5,
              'text-halo-blur': 0.5,
            }}
          />
        </Source>
      )}

      {routeLoading && (
        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-accent">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <div className="animate-spin h-4 w-4 border-2 border-foreground/20 border-t-foreground rounded-full"></div>
            <span>Calculating route...</span>
          </div>
        </div>
      )}
    </MapLibreMap>
  );
}

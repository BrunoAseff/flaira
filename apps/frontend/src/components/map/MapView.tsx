'use client';

import {
  Map as MapLibreMap,
  Source,
  Layer,
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
  onViewStateChange?: (viewState: ViewState) => void;
}

export default function MapView({
  mapStyle,
  containerStyle = { width: '100vw', height: '100vh', borderRadius: '16px' },
  initialViewState = { zoom: 1.5, longitude: 0, latitude: 0 },
  locations,
  route,
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

  useEffect(() => {
    if (!mapRef.current || !locations) return;

    const map = mapRef.current.getMap();

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
          duration: 1000,
        }
      );
    } else if (locations.length === 1) {
      const [lng, lat] = locations[0].coordinates;
      map.easeTo({
        center: [lng, lat],
        zoom: 14,
        duration: 2000,
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
        duration: 1000,
      });
    }
  }, [locations, route]);

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
            coordinates: location.coordinates,
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
      style={containerStyle}
      mapStyle={
        mapStyle ||
        `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
      }
      fadeDuration={300}
      attributionControl={false}
    >
      {routeGeoJSON && (
        <Source id="route" type="geojson" data={routeGeoJSON}>
          <Layer
            id="route-line"
            type="line"
            paint={{
              'line-color': '#1f2937',
              'line-width': 4,
              'line-opacity': 0.8,
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
                '#328032',
                ['==', ['get', 'type'], 'end'],
                '#E85C0C',
                '#f59e0b',
              ],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            }}
          />
          <Layer
            id="location-labels"
            type="symbol"
            layout={{
              'text-field': ['get', 'name'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 1.5],
              'text-anchor': 'top',
              'text-size': 12,
            }}
            paint={{
              'text-color': '#1f2937',
              'text-halo-color': '#ffffff',
              'text-halo-width': 1,
            }}
          />
        </Source>
      )}
    </MapLibreMap>
  );
}

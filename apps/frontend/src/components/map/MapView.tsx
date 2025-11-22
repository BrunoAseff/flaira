'use client';

import {
  Map as MapBoxMap,
  Source,
  Layer,
  type ViewState,
  GeolocateControl,
} from 'react-map-gl/mapbox';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
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
  onGeolocate?: (coordinates: [number, number]) => void;
}

export default function MapView({
  mapStyle,
  containerStyle = { width: '100vw', height: '100vh' },
  initialViewState = { zoom: 1.5, longitude: 0, latitude: 0 },
  locations,
  route,
  routeLoading = false,
  onViewStateChange,
  onGeolocate,
}: MapViewProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;

  const [viewState, setViewState] = useState<ViewState>({
    longitude: initialViewState.longitude || 0,
    latitude: initialViewState.latitude || 0,
    zoom: initialViewState.zoom || 1.5,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  const mapRef = useRef<any>(null);
  const geoControlRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleGeolocate = (event: any) => {
    const { coords } = event;
    if (onGeolocate && coords) {
      onGeolocate([coords.longitude, coords.latitude]);
    }
  };

  useLayoutEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    const map = mapRef.current.getMap();

    const timer = setTimeout(() => {
      map.resize();
    }, 100);

    return () => clearTimeout(timer);
  }, [mapLoaded, containerStyle]);

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
            coordinates: [location.coordinates[0], location.coordinates[1]],
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
    <MapBoxMap
      ref={mapRef}
      {...viewState}
      onMove={handleViewStateChange}
      onLoad={() => setMapLoaded(true)}
      style={containerStyle}
      projection="mercator"
      mapboxAccessToken={mapboxToken}
      mapStyle={
        mapStyle ||
        `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12?access_token=${mapboxToken}`
      }
      fadeDuration={500}
      reuseMaps
      attributionControl={false}
    >
      <GeolocateControl
        ref={geoControlRef}
        onGeolocate={handleGeolocate}
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={false}
        showUserHeading={true}
      />

      {routeGeoJSON && (
        <Source id="route" type="geojson" data={routeGeoJSON}>
          <Layer
            id="route-line-shadow"
            type="line"
            paint={{
              'line-color': '#000000',
              'line-width': 8,
              'line-opacity': 0,
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
              'line-color': '#349dff',
              'line-offset': 0,
              'line-width': 4,
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
              'circle-color': '#2290f7',
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
                '#2290f7',
                ['==', ['get', 'type'], 'end'],
                '#17e06b',
                '#17e06b',
              ],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff',
            }}
          />
          <Layer
            id="location-labels"
            type="symbol"
            layout={{
              'text-field': ['get', 'name'],
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
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
            <div className="animate-spin h-4 w-4 border-2 border-foreground/20 border-t-foreground rounded-full" />
            <span>Calculating route...</span>
          </div>
        </div>
      )}
    </MapBoxMap>
  );
}

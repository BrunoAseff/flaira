"use client";

import { Map as MapLibreMap } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { CSSProperties } from "react";

interface MapViewProps {
  mapStyle?: string;
  containerStyle?: CSSProperties;
  initialViewState?: {
    zoom: number;
    longitude: number;
    latitude: number;
  };
}

export default function MapView({
  mapStyle,
  containerStyle = { width: "100vw", height: "100vh", position: "absolute" },
  initialViewState = {
    zoom: 1.5,
    longitude: 0,
    latitude: 0,
  },
}: MapViewProps) {
  return (
    <MapLibreMap
      initialViewState={initialViewState}
      style={containerStyle}
      mapStyle={
        mapStyle ||
        `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
      }
    />
  );
}

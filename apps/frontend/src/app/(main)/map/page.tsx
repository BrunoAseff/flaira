"use client";

// biome-ignore lint: shut up biome
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapPage() {
  return (
    <Map
      initialViewState={{
        zoom: 0,
        longitude: -122.4,
        latitude: 37.8,
      }}
      style={{ width: "100%", height: "100vh" }}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
    />
  );
}

"use client";

// biome-ignore lint: shut up biome
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import LoadingPage from "@/components/pages/LoadingPage";
import ErrorPage from "@/components/pages/ErrorPage";
import useAuth from "@/hooks/use-auth";

export default function MapPage() {
  const { session, isPending, error } = useAuth();

  if (isPending || !session) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <Map
      initialViewState={{
        zoom: 1.5,
        longitude: 0,
        latitude: 0,
      }}
      style={{ width: "100vw", height: "100vh", position: "absolute" }}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
    />
  );
}

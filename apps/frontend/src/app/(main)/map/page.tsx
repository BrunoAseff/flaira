"use client";

// biome-ignore lint: shut up biome
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { auth } from "@/auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingPage from "@/components/pages/LoadingPage";
import ErrorPage from "@/components/pages/ErrorPage";

export default function MapPage() {
  const { data: session, isPending, error } = auth.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  if (isPending || !session) return <LoadingPage />;
  if (error) return <ErrorPage />;

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

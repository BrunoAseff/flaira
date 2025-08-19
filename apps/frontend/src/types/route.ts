export interface Location {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  coordinates: [number, number];
}

export interface RouteSegment {
  coordinates: [number, number][];
  distance: number;
  duration: number;
  instructions?: string[];
}

export interface Route {
  segments: RouteSegment[];
  totalDistance: number;
  totalDuration: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface GeocodingResult {
  id: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
  text: string;
  properties?: {
    address?: string;
    category?: string;
  };
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
}

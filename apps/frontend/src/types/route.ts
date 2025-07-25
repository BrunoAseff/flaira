export interface Location {
  id: string;
  name: string;
  coordinates: [number, number];
  address?: string;
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

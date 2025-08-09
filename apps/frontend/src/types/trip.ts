import type { Location, Route } from './route';

export interface TripDetails {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  memories: File[];
}

export interface TripRoute {
  hasTripFinished: boolean;
  stops: Array<{ id: number }>;
  transportMode: string;
  locations: Location[];
  inputValues: Record<string, string>;
  showGeoModal: boolean;
  geoCoordinates: [number, number] | null;
  route: Route | null;
  routeLoading: boolean;
}

export interface TripTravelers {
  travelers: Array<{ id: number; email: string; role: string }>;
}

export interface TripForm {
  currentStep: number;
  details: TripDetails;
  route: TripRoute;
  travelers: TripTravelers;
}

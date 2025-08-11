import type { Location, Route } from './route';

export interface TripDetails {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  hasTripFinished: boolean;
}

export interface TripRoute {
  stops: Array<{ id: number }>;
  transportMode: string;
  locations: Location[];
}

export interface TripTravelers {
  users: Array<{ id: number; email: string; role: string }>;
}

export interface TripForm {
  details: TripDetails;
  route: TripRoute;
  travelers: TripTravelers;
}

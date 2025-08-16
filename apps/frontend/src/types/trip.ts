import type { Location } from './route';
import type { FileWithPreview } from '@/hooks/use-file-upload';

interface TripStoreActions {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setHasTripFinished: (finished: boolean) => void;
  addStop: () => void;
  removeStop: (id: number) => void;
  setTransportMode: (mode: string) => void;
  setLocations: (locations: Location[]) => void;
  setTravelers: (
    users: Array<{ id: number; email: string; role: string }>
  ) => void;
  setImages: (images: FileWithPreview[]) => void;
  resetForm: () => void;
}

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
  images: FileWithPreview[];
  actions: TripStoreActions;
  stopIdCounter: number;
}

import { create } from 'zustand';
import type { Location } from '@/types/route';
import type { TripForm } from '@/types/trip';

interface TripStoreActions {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setHasTripFinished: (finished: boolean) => void;
  setStops: (stops: Array<{ id: number }>) => void;
  setTransportMode: (mode: string) => void;
  setLocations: (locations: Location[]) => void;
  setTravelers: (
    users: Array<{ id: number; email: string; role: string }>
  ) => void;

  resetTrip: () => void;
}

type TripStore = TripForm & TripStoreActions;

export const useTripStore = create<TripStore>((set) => ({
  details: {
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    hasTripFinished: false,
  },
  route: {
    transportMode: 'car',
    locations: [],
    stops: [],
  },
  travelers: {
    users: [],
  },

  setTitle: (title) =>
    set((state) => ({
      details: { ...state.details, title },
    })),
  setDescription: (description) =>
    set((state) => ({
      details: { ...state.details, description },
    })),
  setStartDate: (startDate) =>
    set((state) => ({
      details: { ...state.details, startDate },
    })),
  setEndDate: (endDate) =>
    set((state) => ({
      details: { ...state.details, endDate },
    })),

  setHasTripFinished: (hasTripFinished) =>
    set((state) => ({
      route: { ...state.route, hasTripFinished },
    })),
  setStops: (stops) =>
    set((state) => ({
      route: { ...state.route, stops },
    })),
  setTransportMode: (transportMode) =>
    set((state) => ({
      route: { ...state.route, transportMode },
    })),
  setLocations: (locations) =>
    set((state) => ({
      route: { ...state.route, locations },
    })),

  setTravelers: (travelers) =>
    set((state) => ({
      travelers: { ...state.travelers, travelers },
    })),

  resetTrip: () =>
    set({
      details: {
        title: '',
        description: '',
        startDate: null,
        endDate: null,
        hasTripFinished: false,
      },
      route: {
        stops: [],
        transportMode: 'car',
        locations: [],
      },
      travelers: { users: [] },
    }),
}));

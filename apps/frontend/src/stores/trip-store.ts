import { create } from 'zustand';
import type { TripForm } from '@/types/trip';

type TripStore = TripForm;

const useTripStore = create<TripStore>((set) => ({
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
  actions: {
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
        details: { ...state.details, hasTripFinished },
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

    setTravelers: (users) =>
      set((state) => ({
        travelers: { ...state.travelers, users },
      })),
  },
}));

export const useDetails = () => useTripStore((state) => state.details);
export const useRoute = () => useTripStore((state) => state.route);
export const useTravelers = () => useTripStore((state) => state.travelers);
export const useTripActions = () => useTripStore((state) => state.actions);

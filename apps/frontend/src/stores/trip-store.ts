import { create } from 'zustand';
import type { TripForm } from '@/types/trip';

type TripStore = TripForm;

const initialTripState = {
  stopIdCounter: 0,
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
    estimatedDuration: 0,
    estimatedDistance: 0,
  },
  travelers: {
    users: [],
  },
  images: [],
};

const useTripStore = create<TripStore>((set) => ({
  ...initialTripState,
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

    addStop: () =>
      set((state) => {
        const newId = state.stopIdCounter;
        return {
          route: {
            ...state.route,
            stops: [...state.route.stops, { id: newId }],
          },
          stopIdCounter: state.stopIdCounter + 1,
        };
      }),

    removeStop: (id: number) =>
      set((state) => ({
        route: {
          ...state.route,
          stops: state.route.stops.filter((stop) => stop.id !== id),
          locations: state.route.locations.filter(
            (loc) => loc.id !== `stop-${id}`
          ),
        },
      })),

    setTransportMode: (transportMode) =>
      set((state) => ({
        route: { ...state.route, transportMode },
      })),
    setLocations: (locations) =>
      set((state) => ({
        route: { ...state.route, locations },
      })),
    setEstimatedDuration: (estimatedDuration) =>
      set((state) => ({
        route: { ...state.route, estimatedDuration },
      })),
    setEstimatedDistance: (estimatedDistance) =>
      set((state) => ({
        route: { ...state.route, estimatedDistance },
      })),

    setTravelers: (users) =>
      set((state) => ({
        travelers: { ...state.travelers, users },
      })),

    setImages: (images) =>
      set(() => ({
        images,
      })),

    resetForm: () =>
      set((state) => {
        if (typeof window !== 'undefined') {
          for (const img of state.images) {
            if (
              img?.preview &&
              typeof img.preview === 'string' &&
              img.preview.startsWith('blob:')
            ) {
              URL.revokeObjectURL(img.preview);
            }
          }
        }
        return initialTripState;
      }),
  },
}));

export const useDetails = () => useTripStore((state) => state.details);
export const useRoute = () => useTripStore((state) => state.route);
export const useTravelers = () => useTripStore((state) => state.travelers);
export const useImages = () => useTripStore((state) => state.images);
export const useTripActions = () => useTripStore((state) => state.actions);

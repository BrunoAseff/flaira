import { create } from 'zustand';
import type { TripForm } from '@/types/trip';
import {
  tripDetailsSchema,
  tripRouteSchema,
  emailSchema,
} from '@/schemas/trip';

type TripStore = TripForm;

const useTripStore = create<TripStore>((set) => ({
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
  },
  travelers: {
    users: [],
  },
  images: [],
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

    setTravelers: (users) =>
      set((state) => ({
        travelers: { ...state.travelers, users },
      })),

    setImages: (images) =>
      set(() => ({
        images,
      })),
  },
}));

export const useDetails = () => useTripStore((state) => state.details);
export const useRoute = () => useTripStore((state) => state.route);
export const useTravelers = () => useTripStore((state) => state.travelers);
export const useImages = () => useTripStore((state) => state.images);
export const useTripActions = () => useTripStore((state) => state.actions);

export const useDetailsValidation = () =>
  useTripStore((state) => {
    const result = tripDetailsSchema.safeParse(state.details);
    return {
      isValid: result.success,
      errors: result.success
        ? []
        : result.error.issues.map((issue) => issue.message),
    };
  });

export const useRouteValidation = () =>
  useTripStore((state) => {
    const result = tripRouteSchema.safeParse(state.route);
    return {
      isValid: result.success,
      errors: result.success
        ? []
        : result.error.issues.map((issue) => issue.message),
    };
  });

export const useTravelersValidation = () =>
  useTripStore((state) => {
    if (state.travelers.users.length === 0) {
      return { isValid: true, errors: [] };
    }

    const missingEmails = state.travelers.users.filter(
      (user) => !user.email.trim()
    );
    if (missingEmails.length > 0) {
      return {
        isValid: false,
        errors: ['All travelers must have an email address'],
      };
    }

    const hasInvalidEmails = state.travelers.users.some((user) => {
      return user.email.trim() && !emailSchema.safeParse(user.email).success;
    });

    if (hasInvalidEmails) {
      return { isValid: false, errors: [] };
    }

    return { isValid: true, errors: [] };
  });

import { create } from 'zustand';
import type { Location, Route } from '@/types/route';
import type { TripForm } from '@/types/trip';

interface TripStoreActions {
  setCurrentStep: (step: number) => void;

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setMemories: (memories: File[]) => void;

  setHasTripFinished: (finished: boolean) => void;
  setStops: (stops: Array<{ id: number }>) => void;
  setTransportMode: (mode: string) => void;
  setLocations: (locations: Location[]) => void;
  setInputValues: (values: Record<string, string>) => void;
  setShowGeoModal: (show: boolean) => void;
  setGeoCoordinates: (coords: [number, number] | null) => void;
  setRoute: (route: Route | null) => void;
  setRouteLoading: (loading: boolean) => void;

  setTravelers: (
    travelers: Array<{ id: number; email: string; role: string }>
  ) => void;

  resetTrip: () => void;
}

type TripStore = TripForm & TripStoreActions;

export const useTripStore = create<TripStore>((set) => ({
  currentStep: 1,
  details: {
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    memories: [],
  },
  route: {
    hasTripFinished: false,
    stops: [],
    transportMode: 'car',
    locations: [],
    inputValues: { start: '', end: '' },
    showGeoModal: false,
    geoCoordinates: null,
    route: null,
    routeLoading: false,
  },
  travelers: { travelers: [] },

  setCurrentStep: (currentStep) => set({ currentStep }),

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
  setMemories: (memories) =>
    set((state) => ({
      details: { ...state.details, memories },
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
  setInputValues: (inputValues) =>
    set((state) => ({
      route: { ...state.route, inputValues },
    })),
  setShowGeoModal: (showGeoModal) =>
    set((state) => ({
      route: { ...state.route, showGeoModal },
    })),
  setGeoCoordinates: (geoCoordinates) =>
    set((state) => ({
      route: { ...state.route, geoCoordinates },
    })),
  setRoute: (route) =>
    set((state) => ({
      route: { ...state.route, route },
    })),
  setRouteLoading: (routeLoading) =>
    set((state) => ({
      route: { ...state.route, routeLoading },
    })),

  setTravelers: (travelers) =>
    set((state) => ({
      travelers: { ...state.travelers, travelers },
    })),

  resetTrip: () =>
    set({
      currentStep: 1,
      details: {
        title: '',
        description: '',
        startDate: null,
        endDate: null,
        memories: [],
      },
      route: {
        hasTripFinished: false,
        stops: [],
        transportMode: 'car',
        locations: [],
        inputValues: { start: '', end: '' },
        showGeoModal: false,
        geoCoordinates: null,
        route: null,
        routeLoading: false,
      },
      travelers: { travelers: [] },
    }),
}));

import {
  AirplaneModeIcon,
  BicycleIcon,
  Bus01Icon,
  Car05Icon,
  CargoShipIcon,
  FerryBoatIcon,
  Motorbike02Icon,
  WorkoutRunIcon,
  ViewIcon,
  PencilEdit02Icon,
  UserIcon,
  CrownIcon,
} from '@hugeicons/core-free-icons';

export const TRANSPORT_OPTIONS = [
  { value: 'feet', label: 'On feet', icon: WorkoutRunIcon },
  { value: 'bicycle', label: 'Bicycle', icon: BicycleIcon },
  { value: 'car', label: 'Car', icon: Car05Icon },
  { value: 'motorbike', label: 'Motorbike', icon: Motorbike02Icon },
  { value: 'bus', label: 'Bus', icon: Bus01Icon },
  { value: 'plane', label: 'Plane', icon: AirplaneModeIcon },
  { value: 'ship', label: 'Ship', icon: CargoShipIcon },
  { value: 'boat', label: 'Boat', icon: FerryBoatIcon },
] as const;

export const TRAVELER_ROLE_OPTIONS = [
  {
    value: 'owner',
    label: 'Owner',
    icon: CrownIcon,
    description: 'Trip owner with full control',
  },
  {
    value: 'viewer',
    label: 'Viewer',
    icon: ViewIcon,
    description: 'Can view trip details',
  },
  {
    value: 'editor',
    label: 'Editor',
    icon: PencilEdit02Icon,
    description: 'Can edit trip details',
  },
  {
    value: 'admin',
    label: 'Admin',
    icon: UserIcon,
    description: 'Full access and control',
  },
] as const;

export const TRIP_FORM_STEPS = [
  {
    title: 'Details',
    description:
      'Give your trip a name, write a short intro, and add some photos.',
    step: 1,
  },
  {
    title: 'Route',
    description:
      'Set the starting point, stops, destination, and how you got there.',
    step: 2,
  },
  {
    title: 'Travelers',
    description: 'Add people who joined you — it’s optional.',
    step: 3,
  },
  {
    title: 'Review',
    description: 'Double-check everything before saving your trip.',
    step: 4,
  },
] as const;

import {
  AirplaneTakeOff01Icon,
  DiscoverCircleIcon,
  Image02Icon,
  MapsGlobal01Icon,
  News01Icon,
  Settings05Icon,
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';

interface Route {
  readonly title: string;
  readonly url: string;
  readonly icon: IconSvgElement;
}
export const routes = [
  {
    title: 'Overview',
    url: '/',
    icon: DiscoverCircleIcon,
  },
  {
    title: 'Trips',
    url: '/trips',
    icon: AirplaneTakeOff01Icon,
  },
  {
    title: 'Memories',
    url: '/memories',
    icon: Image02Icon,
  },
  {
    title: 'Map',
    url: '/map',
    icon: MapsGlobal01Icon,
  },
  {
    title: 'Logbook',
    url: '/logbook',
    icon: News01Icon,
  },
  {
    title: 'Preferences',
    url: '/preferences',
    icon: Settings05Icon,
  },
] as const satisfies readonly Route[];

export type AppRoute = (typeof routes)[number]['url'];

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Flaira',
    short_name: 'Flaira',
    description:
      'Track and explore your journeys effortlessly with Flaira. Record, organize, and share your travels in one place.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf7f2',
    theme_color: '#317f31',
    icons: [
      {
        src: '/favicon.ico',
        type: 'image/x-icon',
        sizes: '48x48',
      },
    ],
  };
}

'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGeocoding } from '@/hooks/use-geocoding';
import type { Location } from '@/types/route';

interface CurrentLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coordinates: [number, number] | null;
  onLocationSet: (locationType: 'start' | 'end', location: Location) => void;
}

export default function CurrentLocationDialog({
  open,
  onOpenChange,
  coordinates,
  onLocationSet,
}: CurrentLocationDialogProps) {
  const { reverseGeocode, reverseLoading } = useGeocoding();

  const setLocationFromGeo = async (locationType: 'start' | 'end') => {
    if (!coordinates) return;

    try {
      const [lng, lat] = coordinates;
      const locationName = await reverseGeocode(coordinates);

      const newLocation: Location = {
        id: locationType,
        name: locationName,
        coordinates: [lng, lat],
      };

      onLocationSet(locationType, newLocation);
      onOpenChange(false);
    } catch (error) {
      console.error('Error setting location from geo:', error);
      const [lng, lat] = coordinates;
      const locationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      const newLocation: Location = {
        id: locationType,
        name: locationName,
        coordinates: [lng, lat],
      };

      onLocationSet(locationType, newLocation);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Use your current address</DialogTitle>
          <DialogDescription>
            Where should we place your current position on the route?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Button
            size="sm"
            onClick={() => setLocationFromGeo('start')}
            className="w-full"
            disabled={reverseLoading}
          >
            {reverseLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
                Getting address...
              </div>
            ) : (
              'Use as Starting Point'
            )}
          </Button>
          <Button
            size="sm"
            onClick={() => setLocationFromGeo('end')}
            variant="outline"
            className="w-full"
            disabled={reverseLoading}
          >
            {reverseLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-current/20 border-t-current rounded-full" />
                Getting address...
              </div>
            ) : (
              'Use as Destination'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

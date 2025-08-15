'use client';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { TRANSPORT_OPTIONS, TRAVELER_ROLE_OPTIONS } from '@/constants/trip';
import {
  useDetails,
  useRoute,
  useTravelers,
  useImages,
} from '@/stores/trip-store';
import { auth } from '@/auth/client';
import {
  CalendarIcon,
  LocationIcon,
  UserMultiple02Icon,
  ImageIcon,
  CheckmarkCircle02Icon,
  ClockIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { format } from 'date-fns';
import { useMemo } from 'react';

export default function Review() {
  const { data: session } = auth.useSession();
  const details = useDetails();
  const route = useRoute();
  const travelers = useTravelers();
  const images = useImages();

  const transportOption = useMemo(
    () =>
      TRANSPORT_OPTIONS.find((option) => option.value === route.transportMode),
    [route.transportMode]
  );

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not set';
    return format(date, 'MMM dd, yyyy');
  };

  const getLocationsByOrder = () => {
    const order = ['start', ...route.stops.map((s) => `stop-${s.id}`), 'end'];
    return route.locations
      .filter((loc) => order.includes(loc.id))
      .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  };

  const orderedLocations = getLocationsByOrder();

  const getRoleInfo = (roleValue: string) => {
    return TRAVELER_ROLE_OPTIONS.find((role) => role.value === roleValue);
  };

  return (
    <div className="flex flex-col gap-6 px-6 md:px-10 py-6 max-h-full overflow-y-auto scrollbar-gutter-stable">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-muted border border-accent rounded-xl">
          <div className="flex items-center gap-2 mb-6">
            <HugeiconsIcon icon={CalendarIcon} size={20} />
            <h3 className="text-lg font-semibold">Trip Details</h3>
          </div>

          <div className="space-y-5">
            <div className="bg-background/10 rounded-lg p-4 border border-accent/50">
              <h4 className="text-lg font-medium mb-2">
                {details.title || 'Untitled Trip'}
              </h4>
              {details.description && (
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {details.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background/10 rounded-lg p-4 border border-accent/30">
                <Label className="text-xs font-medium text-foreground/60 tracking-wide">
                  Start Date
                </Label>
                <p className="text-sm font-medium mt-1">
                  {formatDate(details.startDate)}
                </p>
              </div>
              <div className="bg-background/10 rounded-lg p-4 border border-accent/30">
                <Label className="text-xs font-medium text-foreground/60 tracking-wide">
                  End Date
                </Label>
                <p className="text-sm font-medium mt-1">
                  {formatDate(details.endDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-background/10 rounded-lg border border-accent/40">
              <div className="size-8 rounded-full flex items-center justify-center">
                <HugeiconsIcon
                  icon={
                    details.hasTripFinished ? CheckmarkCircle02Icon : ClockIcon
                  }
                  size={22}
                  className="text-foreground/70"
                />
              </div>
              <span className="text-base font-medium">
                {details.hasTripFinished
                  ? 'Trip completed'
                  : 'Currently on this trip'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-muted border border-accent rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <HugeiconsIcon icon={ImageIcon} size={20} />
            <h3 className="text-lg font-medium">Memories</h3>
          </div>

          {images.length > 0 ? (
            <div>
              <p className="text-sm text-foreground/60 mb-4">
                {images.length} {images.length === 1 ? 'photo' : 'photos'} added
              </p>
              <div className="relative">
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-muted to-transparent z-10 pointer-events-none" />

                <div className="max-h-64 overflow-y-auto p-2 scrollbar-gutter-stable">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="aspect-square rounded-lg overflow-hidden bg-muted"
                      >
                        <img
                          src={image.preview!}
                          alt={
                            typeof image.file === 'object' &&
                            'name' in image.file
                              ? image.file.name
                              : 'Trip memory'
                          }
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-foreground/60 text-sm">No photos added yet</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-muted border border-accent rounded-xl">
          <div className="flex items-center gap-2 mb-6">
            <HugeiconsIcon icon={LocationIcon} size={20} />
            <h3 className="text-lg font-medium">Route</h3>
            {transportOption && (
              <div className="flex items-center gap-2 ml-auto">
                <HugeiconsIcon icon={transportOption.icon} size={16} />
                <Badge className="bg-foreground text-background">
                  {transportOption.label}
                </Badge>
              </div>
            )}
          </div>

          {orderedLocations.length > 0 ? (
            <div className="relative">
              <div className="max-h-80 overflow-y-auto scrollbar-gutter-stable">
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

                  <div className="space-y-6 pl-12">
                    {orderedLocations.map((location, index) => {
                      const isStart = location.id === 'start';
                      const isEnd = location.id === 'end';

                      return (
                        <div key={location.id} className="relative">
                          <div className="absolute -left-[29px] top-2 size-3 rounded-full border-2 border-muted z-10">
                            <div
                              className={`w-full h-full rounded-full ${
                                isStart
                                  ? 'bg-blue-500'
                                  : isEnd
                                    ? 'bg-orange-500'
                                    : 'bg-green-500'
                              }`}
                            />
                          </div>

                          <div>
                            <span className="text-xs font-medium text-foreground/60">
                              {isStart
                                ? 'Start'
                                : isEnd
                                  ? 'Destination'
                                  : `Stop ${
                                      orderedLocations
                                        .slice(0, index)
                                        .filter((loc) =>
                                          loc.id.startsWith('stop-')
                                        ).length + 1
                                    }`}
                            </span>

                            <p className="text-sm font-medium text-foreground mt-1">
                              {location.name}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-foreground/60 text-sm">
              No route information added
            </p>
          )}
        </div>

        <div className="p-6 bg-muted border border-accent rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <HugeiconsIcon icon={UserMultiple02Icon} size={20} />
            <h3 className="text-lg font-medium">Travelers</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg">
              <div>
                <p className="font-medium text-sm">
                  {session?.user?.email || 'You'}
                </p>
                <p className="text-xs text-foreground/60">Trip Owner</p>
              </div>
              <Badge variant="default">
                <HugeiconsIcon
                  icon={getRoleInfo('owner')!.icon}
                  size={12}
                  className="mr-1"
                />
                Owner
              </Badge>
            </div>

            {travelers.users.length > 0 ? (
              travelers.users.map((traveler, index) => {
                const roleInfo = getRoleInfo(traveler.role);
                return (
                  <div
                    key={traveler.id}
                    className="flex items-center justify-between mx-3 py-3  border-t-1 border-accent"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {traveler.email || `Traveler ${index + 1}`}
                      </p>
                      <p className="text-xs text-foreground/60">
                        {roleInfo?.description}
                      </p>
                    </div>
                    <Badge className="bg-foreground text-background">
                      {roleInfo && (
                        <HugeiconsIcon
                          icon={roleInfo.icon}
                          size={12}
                          className="mr-1"
                        />
                      )}
                      {roleInfo?.label}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <p className="text-foreground/60 text-sm">
                Solo trip - no additional travelers
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

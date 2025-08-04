'use client';

import { Label } from '@/components/ui/label';

const mockTripData = {
  title: 'Summer Road Trip to California',
  description:
    'A week-long adventure exploring the Pacific Coast Highway, visiting San Francisco, Los Angeles, and all the beautiful beaches in between. Planning to catch some waves and enjoy the coastal views.',
  startDate: 'June 15, 2025',
  endDate: 'June 22, 2025',
  isCurrentTrip: true,
  route: {
    start: 'Seattle, WA',
    end: 'San Diego, CA',
    stops: [
      'Portland, OR',
      'San Francisco, CA',
      'Santa Barbara, CA',
      'Los Angeles, CA',
    ],
    transportMode: 'car',
    distance: '1,255 miles',
    duration: '21h 45m',
  },
  travelers: [
    { email: 'john.doe@example.com', role: 'owner' },
    { email: 'jane.smith@example.com', role: 'editor' },
    { email: 'bob.wilson@example.com', role: 'viewer' },
    { email: 'alice.brown@example.com', role: 'admin' },
  ],
  memories: [
    'sunset-beach.jpg',
    'golden-gate.jpg',
    'highway-1.jpg',
    'santa-monica-pier.jpg',
  ],
};

export default function Review() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 scrollbar-gutter-stable overflow-y-auto px-4 sm:px-8 lg:px-32 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="border border-accent rounded-xl p-6 bg-muted/10">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">Trip Details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm text-foreground/60">Title</Label>
                <p className="text-base font-medium mt-1">
                  {mockTripData.title}
                </p>
              </div>

              <div>
                <Label className="text-sm text-foreground/60">
                  Description
                </Label>
                <p className="text-base mt-1 text-foreground/80 leading-relaxed">
                  {mockTripData.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    {mockTripData.startDate} - {mockTripData.endDate}
                  </span>
                </div>
                {mockTripData.isCurrentTrip && (
                  <div className="flex items-center gap-2 text-primary">
                    <span className="text-sm font-medium">
                      Currently on this trip
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border border-accent rounded-xl p-6 bg-muted/10">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">Route</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="w-0.5 h-16 bg-foreground/20" />
                </div>
                <div className="flex-1">
                  <Label className="text-sm text-foreground/60">Start</Label>
                  <p className="text-base font-medium">
                    {mockTripData.route.start}
                  </p>
                </div>
              </div>

              {mockTripData.route.stops.map((stop, index) => (
                <div key={index} className="flex items-start gap-3 -mt-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-foreground/40 rounded-full" />
                    <div className="w-0.5 h-16 bg-foreground/20" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm text-foreground/60">
                      Stop {index + 1}
                    </Label>
                    <p className="text-base">{stop}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-3 -mt-4">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <div className="flex-1">
                  <Label className="text-sm text-foreground/60">End</Label>
                  <p className="text-base font-medium">
                    {mockTripData.route.end}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-foreground/10">
                <div className="flex items-center gap-2">
                  <span className="text-sm capitalize">
                    {mockTripData.route.transportMode}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/60">Distance:</span>
                  <span className="text-sm font-medium">
                    {mockTripData.route.distance}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground/60">Duration:</span>
                  <span className="text-sm font-medium">
                    {mockTripData.route.duration}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-accent rounded-xl p-6 bg-muted/10">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">Travelers</h3>
            </div>

            <div className="space-y-3">
              {mockTripData.travelers.map((traveler, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-base">{traveler.email}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm capitalize text-foreground/60">
                        {traveler.role}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border border-accent rounded-xl p-6 bg-muted/10">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">Memories</h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base">
                {mockTripData.memories.length} files uploaded
              </span>
              <span className="text-sm text-foreground/60">
                ({mockTripData.memories.join(', ')})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

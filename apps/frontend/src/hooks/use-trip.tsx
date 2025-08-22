'use client';

import { useMutation } from '@tanstack/react-query';
import type { TripDetails, TripRoute, TripTravelers } from '@/types/trip';

interface CreateTripPayload {
  details: Omit<TripDetails, 'startDate' | 'endDate'> & {
    startDate: string;
    endDate?: string;
  };
  route: TripRoute;
  travelers: TripTravelers;
  memories?: Array<{
    s3Key: string;
    type: 'image' | 'video' | 'audio';
  }>;
}

interface CreateTripResponse {
  status: 'ok' | 'error';
  data?: {
    tripId: string;
    invitesSent: Array<{
      email: string;
      inviteId: string;
    }>;
  };
  message?: string;
}

const createTrip = async (
  tripData: CreateTripPayload
): Promise<CreateTripResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trip/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(tripData),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create trip');
  }

  return response.json();
};

export const useCreateTrip = () => {
  return useMutation({
    mutationFn: createTrip,
  });
};

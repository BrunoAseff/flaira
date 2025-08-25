import { db } from '@/db';
import {
  trips,
  tripLocations,
  tripUsers,
  tripInvites,
  tripMedia,
} from '@/db/schema/trip';
import { uploadUrl, getUrl, deleteObject } from '@/utils/s3';
import { v4 as uuidv4 } from 'uuid';
import type { CreateTripInput } from './validator';
import type { Transaction } from '@/db/types';

const calculateTripDuration = (
  startDate: Date,
  endDate: Date | null
): number => {
  if (!endDate) return 0;

  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return Math.max(1, Math.ceil(diffDays));
};

const insertTripRecord = async (
  tx: Transaction,
  tripData: CreateTripInput,
  userId: string
) => {
  const tripId = uuidv4();
  const startDate = new Date(tripData.details.startDate);
  const endDate = tripData.details.endDate
    ? new Date(tripData.details.endDate)
    : startDate;

  const duration = calculateTripDuration(startDate, endDate);

  await tx.insert(trips).values({
    id: tripId,
    ownerId: userId,
    title: tripData.details.title,
    description: tripData.details.description || null,
    startDate,
    endDate,
    duration,
    distance: tripData.route.estimatedDistance,
    visibility: 'private' as const,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return tripId;
};

const insertTripLocations = async (
  tx: Transaction,
  tripId: string,
  route: CreateTripInput['route']
) => {
  const locationInserts = [];

  for (const location of route.locations) {
    const getLocationType = (
      id: string
    ): { type: 'start' | 'end' | 'stop'; stopIndex: number | null } => {
      if (id === 'start') return { type: 'start', stopIndex: null };
      if (id === 'end') return { type: 'end', stopIndex: null };
      if (id.startsWith('stop-')) {
        const stopIdStr = id.slice(5);
        const stopId = parseInt(stopIdStr, 10);

        if (!Number.isFinite(stopId) || stopIdStr !== stopId.toString()) {
          throw new Error(
            `Invalid stop ID format: ${id}. Expected format: 'stop-{number}'`
          );
        }

        const stopIndex = route.stops.findIndex((stop) => stop.id === stopId);
        if (stopIndex === -1) {
          throw new Error(`Stop with ID ${stopId} not found in route stops`);
        }

        return { type: 'stop', stopIndex };
      }
      throw new Error(
        `Invalid location type: ${id}. Expected 'start', 'end', or 'stop-{number}'`
      );
    };

    const { type, stopIndex } = getLocationType(location.id);

    locationInserts.push({
      id: uuidv4(),
      tripId,
      name: location.name,
      address: location.address || '',
      country: location.country || null,
      city: location.city || null,
      lon: location.coordinates[0],
      lat: location.coordinates[1],
      type,
      stopIndex,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  if (locationInserts.length > 0) {
    await tx.insert(tripLocations).values(locationInserts);
  }
};

const addTripOwner = async (
  tx: Transaction,
  tripId: string,
  userId: string
) => {
  await tx.insert(tripUsers).values({
    id: uuidv4(),
    tripId,
    userId,
    role: 'admin',
    addedBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

const createTripInvites = async (
  tx: Transaction,
  tripId: string,
  travelers: CreateTripInput['travelers'],
  userId: string
) => {
  if (travelers.users.length === 0) return [];

  const inviteInserts = travelers.users.map((traveler) => ({
    id: uuidv4(),
    tripId,
    invitedUserId: null,
    invitedUserEmail: traveler.email,
    invitedBy: userId,
    status: 'pending' as const,
    answeredAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  return await tx.insert(tripInvites).values(inviteInserts).returning();
};

export const createTrip = async (tripData: CreateTripInput, userId: string) => {
  return await db.transaction(async (tx) => {
    const tripId = await insertTripRecord(tx, tripData, userId);

    await insertTripLocations(tx, tripId, tripData.route);

    await addTripOwner(tx, tripId, userId);

    const invites = await createTripInvites(
      tx,
      tripId,
      tripData.travelers,
      userId
    );

    if (tripData.memories && tripData.memories.length > 0) {
      await insertTripMemories(tx, tripId, tripData.memories, userId);
    }

    return {
      tripId,
      invitesSent: invites.map((invite) => ({
        email: invite.invitedUserEmail,
        inviteId: invite.id,
      })),
    };
  });
};

const insertTripMemories = async (
  tx: Transaction,
  tripId: string,
  memories: Array<{ s3Key: string; type: 'image' | 'video' | 'audio' }>,
  userId: string
) => {
  const memoryInserts = memories.map((memory) => ({
    id: uuidv4(),
    tripDayId: null,
    tripId,
    type: memory.type,
    s3Key: memory.s3Key,
    uploadedBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await tx.insert(tripMedia).values(memoryInserts);
};

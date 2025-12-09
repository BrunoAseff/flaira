import { uploadUrl, getUrl, deleteObject } from '@/utils/s3';
import { v4 as uuidv4 } from 'uuid';
import { tripMedia, trips } from '@/db/schema/trip';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/db';

export const uploadTripMemory = async ({
  fileName,
  type,
  userId,
}: {
  fileName: string;
  type: string;
  userId: string;
}) => {
  const mediaId = uuidv4();
  const s3Key = `memories/${userId}/${mediaId}/${fileName}`;
  const url = await uploadUrl({ key: s3Key, type });
  return { url, key: s3Key };
};

export const getTripMemory = async ({ key }: { key: string }) => {
  const url = await getUrl({ key });
  return url;
};

export const getRandomTripMemories = async ({ userId }: { userId: string }) => {
  const MEMORIES_AMOUNT = 5;

  const randomMedia = await db
    .select({
      title: trips.title,
      startDate: trips.startDate,
      endDate: trips.endDate,
      id: tripMedia.id,
      s3Key: tripMedia.s3Key,
      type: tripMedia.type,
      tripId: tripMedia.tripId,
      tripDayId: tripMedia.tripDayId,
      uploadedBy: tripMedia.uploadedBy,
    })
    .from(tripMedia)
    .where(eq(tripMedia.uploadedBy, userId))
    .leftJoin(trips, eq(tripMedia.tripId, trips.id))
    .orderBy(sql`RANDOM()`)
    .limit(MEMORIES_AMOUNT);

  const mediaWithUrls = await Promise.all(
    randomMedia.map(async (media) => {
      const presignedUrl = await getUrl({ key: media.s3Key });
      return {
        ...media,
        url: presignedUrl,
      };
    })
  );

  return mediaWithUrls;
};

export const deleteTripMemory = async ({
  key,
  userId,
}: {
  key: string;
  userId: string;
}) => {
  await deleteObject({ key });
  await db
    .delete(tripMedia)
    .where(and(eq(tripMedia.s3Key, key), eq(tripMedia.uploadedBy, userId)));
  return true;
};

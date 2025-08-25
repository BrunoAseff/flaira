import { uploadUrl, getUrl, deleteObject } from '@/utils/s3';
import { v4 as uuidv4 } from 'uuid';

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

export const deleteTripMemory = async ({ key }: { key: string }) => {
  const result = await deleteObject({ key });
  return result;
};

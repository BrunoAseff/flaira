import { deleteObject, getUrl, uploadUrl } from '@/utils/s3';
import { v4 as uuidv4 } from 'uuid';

export const uploadUserAvatar = async ({
  fileName,
  type,
}: {
  fileName: string;
  type: string;
}) => {
  const id = uuidv4();
  const key = `avatar/${id}/${fileName}`;
  const url = await uploadUrl({ key, type });
  return { url, key };
};

export const getUserAvatar = async ({ key }: { key: string }) => {
  const url = await getUrl({ key });
  return url;
};

export const deleteUserAvatar = async ({ key }: { key: string }) => {
  const result = await deleteObject({ key });
  return result;
};

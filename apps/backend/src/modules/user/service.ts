import { deleteObject, getUrl, uploadUrl } from "@/utils/s3";

export const uploadUserAvatar = async ({
  fileName,
  type,
}: { fileName: string; type: string }) => {
  await uploadUrl({ key: `avatar/${fileName}`, type });
};

export const getUserAvatar = async ({ key }: { key: string }) => {
  await getUrl({ key });
};

export const deleteUserAvatar = async ({ key }: { key: string }) => {
  await deleteObject({ key });
};

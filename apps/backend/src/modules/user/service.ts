import { getS3Url } from "@/utils/s3";

export const uploadUserAvatar = async ({
  fileName,
  type,
}: { fileName: string; type: string }) => {
  await getS3Url({ key: `avatar/${fileName}`, type });
};

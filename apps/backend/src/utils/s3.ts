import { env } from "@/env";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadUrl = async ({
  key,
  type,
}: { key: string; type: string }) => {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ContentType: type,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
  return url;
};

export const getUrl = async ({ key }: { key: string }) => {
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
  return url;
};

export const deleteObject = async ({ key }: { key: string }) => {
  const command = new DeleteObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
  });

  await s3.send(command);
  return true;
};

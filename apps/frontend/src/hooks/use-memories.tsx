import { useMutation } from '@tanstack/react-query';

interface UploadMemoryResponse {
  url: string;
  key: string;
}

const uploadMemoryToS3 = async (
  file: File
): Promise<{ s3Key: string; type: 'image' | 'video' | 'audio' }> => {
  const fileName = encodeURIComponent(file.name);
  const type = file.type;

  const getMemoryType = (mimeType: string): 'image' | 'video' | 'audio' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'image';
  };

  const presignedUrlResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/trip/upload-memory`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ fileName, type }),
    }
  );

  if (!presignedUrlResponse.ok) {
    const errorData = await presignedUrlResponse.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to get upload URL.');
  }

  const { url: S3UploadUrl, key: s3Key }: UploadMemoryResponse = (
    await presignedUrlResponse.json()
  ).data;

  const uploadResponse = await fetch(S3UploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': type },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error('File upload to storage failed.');
  }

  return {
    s3Key,
    type: getMemoryType(type),
  };
};

export const useUploadMemories = () => {
  return useMutation({
    mutationFn: async (
      files: File[]
    ): Promise<Array<{ s3Key: string; type: 'image' | 'video' | 'audio' }>> => {
      const uploadPromises = files.map(uploadMemoryToS3);
      return Promise.all(uploadPromises);
    },
  });
};

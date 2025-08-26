import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

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
    throw new Error(
      'Unsupported file type. Please upload an image, video, or audio file.'
    );
  };

  const presignedUrlResponse = await api.post<UploadMemoryResponse>(
    '/memory/upload-memory',
    {
      body: { fileName, type },
      auth: true,
    }
  );

  if (!presignedUrlResponse.ok) {
    throw new Error(presignedUrlResponse.error || 'Failed to get upload URL.');
  }

  const { url: S3UploadUrl, key: s3Key } = presignedUrlResponse.data!;

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

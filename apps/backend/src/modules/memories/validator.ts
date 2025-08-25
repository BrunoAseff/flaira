import { z } from 'zod';

export const uploadMemorySchema = z.object({
  fileName: z
    .string()
    .min(1, 'File name is required')
    .refine(
      (val) => !val.includes('..') && !val.includes('/') && !val.includes('\\')
    ),
  type: z.string().min(1, 'File type is required'),
});

export const getMemorySchema = z.object({
  key: z
    .string()
    .regex(
      /^memories\/[\w-]+\/[\w-]+\/[^/]+\.(jpeg|jpg|png|webp|mp4|mov|avi|mkv|webm|mp3|wav|aac|ogg|m4a)$/i,
      'Invalid memory key format. Expected: memories/{userId}/{memoryId}/{fileName}.{ext}'
    ),
});

export const deleteMemorySchema = z.object({
  key: z
    .string()
    .regex(
      /^memories\/[\w-]+\/[\w-]+\/[^/]+\.(jpeg|jpg|png|webp|mp4|mov|avi|mkv|webm|mp3|wav|aac|ogg|m4a)$/i,
      'Invalid memory key format. Expected: memories/{userId}/{memoryId}/{fileName}.{ext}'
    ),
});

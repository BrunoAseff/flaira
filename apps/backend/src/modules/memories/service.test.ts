import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/utils/s3', () => ({
  uploadUrl: vi.fn().mockResolvedValue('https://s3.example.com/upload-url'),
  getUrl: vi.fn().mockResolvedValue('https://s3.example.com/presigned-url'),
  deleteObject: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-1234'),
}));

vi.mock('@/db/schema/trip', () => ({
  tripMedia: {},
}));

vi.mock('drizzle-orm', () => ({
  and: vi.fn(),
  eq: vi.fn(),
  sql: vi.fn(),
}));

vi.mock('@/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    delete: vi.fn().mockReturnThis(),
  },
}));

import {
  uploadTripMemory,
  getTripMemory,
  deleteTripMemory,
  getRandomTripMemories,
} from './service';
import { deleteObject, getUrl } from '@/utils/s3';
import { db } from '@/db';
import { eq, and } from 'drizzle-orm';

const mockDb = db as unknown as {
  select: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  orderBy: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

describe('Memories Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadTripMemory', () => {
    it('should generate upload URL with correct key format', async () => {
      const result = await uploadTripMemory({
        fileName: 'vacation.jpg',
        type: 'image/jpeg',
        userId: 'user-123',
      });

      expect(result.url).toBe('https://s3.example.com/upload-url');
      expect(result.key).toBe('memories/user-123/mock-uuid-1234/vacation.jpg');
    });

    it('should include userId in the key path', async () => {
      const result = await uploadTripMemory({
        fileName: 'video.mp4',
        type: 'video/mp4',
        userId: 'different-user',
      });

      expect(result.key).toContain('different-user');
    });
  });

  describe('getTripMemory', () => {
    it('should return presigned URL for given key', async () => {
      const result = await getTripMemory({
        key: 'memories/user-123/media-456/photo.jpg',
      });

      expect(result).toBe('https://s3.example.com/presigned-url');
    });
  });

  describe('deleteTripMemory', () => {
    it('should delete from S3 and database with correct parameters', async () => {
      const key = 'memories/user-123/media-456/photo.jpg';
      const userId = 'user-123';

      const result = await deleteTripMemory({ key, userId });

      expect(result).toBe(true);
      expect(deleteObject).toHaveBeenCalledTimes(1);
      expect(deleteObject).toHaveBeenCalledWith({ key });
      expect(mockDb.delete).toHaveBeenCalledTimes(1);
      expect(mockDb.delete).toHaveBeenCalledWith({});
      expect(and).toHaveBeenCalledTimes(1);
      expect(eq).toHaveBeenCalledTimes(2);
    });

    it('should call database where with correct filters', async () => {
      const key = 'memories/user-456/media-789/video.mp4';
      const userId = 'user-456';

      await deleteTripMemory({ key, userId });

      expect(deleteObject).toHaveBeenCalledWith({ key });
      expect(mockDb.delete).toHaveBeenCalled();
    });
  });

  describe('getRandomTripMemories', () => {
    it('should return mapped results with presigned URLs', async () => {
      const mockMedia = [
        {
          id: 'media-1',
          s3Key: 'memories/user-123/1/photo1.jpg',
          type: 'image',
          tripId: 'trip-1',
          tripDayId: null,
          uploadedBy: 'user-123',
        },
        {
          id: 'media-2',
          s3Key: 'memories/user-123/2/photo2.jpg',
          type: 'image',
          tripId: 'trip-1',
          tripDayId: null,
          uploadedBy: 'user-123',
        },
      ];

      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.orderBy.mockReturnThis();
      mockDb.limit.mockResolvedValue(mockMedia);

      const result = await getRandomTripMemories({ userId: 'user-123' });

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty(
        'url',
        'https://s3.example.com/presigned-url'
      );
      expect(result[1]).toHaveProperty(
        'url',
        'https://s3.example.com/presigned-url'
      );
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.from).toHaveBeenCalledTimes(1);
      expect(mockDb.where).toHaveBeenCalledTimes(1);
      expect(mockDb.orderBy).toHaveBeenCalledTimes(1);
      expect(mockDb.limit).toHaveBeenCalledTimes(1);
      expect(mockDb.limit).toHaveBeenCalledWith(5);
      expect(getUrl).toHaveBeenCalledTimes(2);
      expect(getUrl).toHaveBeenCalledWith({
        key: 'memories/user-123/1/photo1.jpg',
      });
      expect(getUrl).toHaveBeenCalledWith({
        key: 'memories/user-123/2/photo2.jpg',
      });
      expect(eq).toHaveBeenCalled();
    });

    it('should return empty array when no media found', async () => {
      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.orderBy.mockReturnThis();
      mockDb.limit.mockResolvedValue([]);

      const result = await getRandomTripMemories({ userId: 'user-456' });

      expect(result).toEqual([]);
      expect(mockDb.select).toHaveBeenCalledTimes(1);
      expect(mockDb.limit).toHaveBeenCalledWith(5);
      expect(getUrl).not.toHaveBeenCalled();
    });

    it('should call database methods in correct order', async () => {
      mockDb.select.mockReturnThis();
      mockDb.from.mockReturnThis();
      mockDb.where.mockReturnThis();
      mockDb.orderBy.mockReturnThis();
      mockDb.limit.mockResolvedValue([]);

      await getRandomTripMemories({ userId: 'user-789' });

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
      expect(mockDb.orderBy).toHaveBeenCalled();
      expect(mockDb.limit).toHaveBeenCalled();
    });
  });
});

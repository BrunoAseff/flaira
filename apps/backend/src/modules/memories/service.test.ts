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

import { uploadTripMemory, getTripMemory } from './service';

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
});

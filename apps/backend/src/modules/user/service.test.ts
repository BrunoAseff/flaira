import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadUserAvatar, getUserAvatar, deleteUserAvatar } from './service';

vi.mock('@/utils/s3', () => ({
  uploadUrl: vi.fn().mockResolvedValue('https://s3.example.com/upload-url'),
  getUrl: vi.fn().mockResolvedValue('https://s3.example.com/presigned-url'),
  deleteObject: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-1234'),
}));

describe('User Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadUserAvatar', () => {
    it('should generate upload URL with correct key format', async () => {
      const result = await uploadUserAvatar({
        fileName: 'profile.jpg',
        type: 'image/jpeg',
      });

      expect(result.url).toBe('https://s3.example.com/upload-url');
      expect(result.key).toBe('avatar/mock-uuid-1234/profile.jpg');
    });

    it('should handle different file types', async () => {
      const result = await uploadUserAvatar({
        fileName: 'avatar.png',
        type: 'image/png',
      });

      expect(result.key).toContain('.png');
    });
  });

  describe('getUserAvatar', () => {
    it('should return presigned URL for given key', async () => {
      const result = await getUserAvatar({
        key: 'avatar/user-123/profile.jpg',
      });

      expect(result).toBe('https://s3.example.com/presigned-url');
    });
  });

  describe('deleteUserAvatar', () => {
    it('should delete avatar and return result', async () => {
      const result = await deleteUserAvatar({
        key: 'avatar/user-123/profile.jpg',
      });

      expect(result).toEqual({ success: true });
    });
  });
});

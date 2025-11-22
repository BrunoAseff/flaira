import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadUserAvatar, getUserAvatar, deleteUserAvatar } from './service';
import { uploadUrl, getUrl, deleteObject } from '@/utils/s3';

vi.mock('@/utils/s3', () => ({
  uploadUrl: vi.fn().mockResolvedValue('https://s3.example.com/upload-url'),
  getUrl: vi.fn().mockResolvedValue('https://s3.example.com/presigned-url'),
  deleteObject: vi.fn().mockResolvedValue(true),
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
      expect(uploadUrl).toHaveBeenCalledTimes(1);
      expect(uploadUrl).toHaveBeenCalledWith({
        key: 'avatar/mock-uuid-1234/profile.jpg',
        type: 'image/jpeg',
      });
    });

    it('should handle different file types', async () => {
      const result = await uploadUserAvatar({
        fileName: 'avatar.png',
        type: 'image/png',
      });

      expect(result.key).toContain('.png');
      expect(uploadUrl).toHaveBeenCalledTimes(1);
      expect(uploadUrl).toHaveBeenCalledWith({
        key: 'avatar/mock-uuid-1234/avatar.png',
        type: 'image/png',
      });
    });

    it('should handle S3 upload failure', async () => {
      vi.mocked(uploadUrl).mockRejectedValueOnce(new Error('S3 upload failed'));

      await expect(
        uploadUserAvatar({
          fileName: 'profile.jpg',
          type: 'image/jpeg',
        })
      ).rejects.toThrow('S3 upload failed');

      expect(uploadUrl).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserAvatar', () => {
    it('should return presigned URL for given key', async () => {
      const result = await getUserAvatar({
        key: 'avatar/user-123/profile.jpg',
      });

      expect(result).toBe('https://s3.example.com/presigned-url');
      expect(getUrl).toHaveBeenCalledTimes(1);
      expect(getUrl).toHaveBeenCalledWith({
        key: 'avatar/user-123/profile.jpg',
      });
    });

    it('should handle S3 getUrl failure', async () => {
      vi.mocked(getUrl).mockRejectedValueOnce(new Error('S3 getUrl failed'));

      await expect(
        getUserAvatar({
          key: 'avatar/user-123/profile.jpg',
        })
      ).rejects.toThrow('S3 getUrl failed');

      expect(getUrl).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteUserAvatar', () => {
    it('should delete avatar and return result', async () => {
      const result = await deleteUserAvatar({
        key: 'avatar/user-123/profile.jpg',
      });

      expect(result).toBe(true);
      expect(deleteObject).toHaveBeenCalledTimes(1);
      expect(deleteObject).toHaveBeenCalledWith({
        key: 'avatar/user-123/profile.jpg',
      });
    });

    it('should handle S3 delete failure', async () => {
      vi.mocked(deleteObject).mockRejectedValueOnce(
        new Error('S3 delete failed')
      );

      await expect(
        deleteUserAvatar({
          key: 'avatar/user-123/profile.jpg',
        })
      ).rejects.toThrow('S3 delete failed');

      expect(deleteObject).toHaveBeenCalledTimes(1);
    });
  });
});

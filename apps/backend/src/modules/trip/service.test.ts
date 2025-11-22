import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateTripDuration, getLocationType } from '@/utils/trip';

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-1234'),
}));

vi.mock('@/db', () => ({
  db: {
    transaction: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('@/db/schema/trip', () => ({
  trips: {},
  tripLocations: {},
  tripUsers: {},
  tripInvites: {},
  tripMedia: {},
}));

vi.mock('@/utils/s3', () => ({
  uploadUrl: vi.fn(),
  getUrl: vi.fn(),
  deleteObject: vi.fn(),
}));

describe('Trip Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateTripDuration', () => {
    it('should return 0 when endDate is null', () => {
      const startDate = new Date('2024-01-01');
      const endDate = null;

      expect(calculateTripDuration(startDate, endDate)).toBe(0);
    });

    it('should return at least 1 day for same start and end date', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-01');

      expect(calculateTripDuration(startDate, endDate)).toBe(1);
    });

    it('should calculate correct duration for multi-day trips', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-05');

      expect(calculateTripDuration(startDate, endDate)).toBe(4);
    });
  });

  describe('getLocationType', () => {
    it('should return start type for start id', () => {
      const result = getLocationType('start', []);
      expect(result).toEqual({ type: 'start', stopIndex: null });
    });

    it('should return end type for end id', () => {
      const result = getLocationType('end', []);
      expect(result).toEqual({ type: 'end', stopIndex: null });
    });

    it('should return stop type with correct index', () => {
      const stops = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = getLocationType('stop-2', stops);
      expect(result).toEqual({ type: 'stop', stopIndex: 1 });
    });

    it('should throw error for invalid stop id format', () => {
      expect(() => getLocationType('stop-abc', [])).toThrow(
        'Invalid stop ID format'
      );
    });

    it('should throw error for stop not found', () => {
      const stops = [{ id: 1 }];
      expect(() => getLocationType('stop-99', stops)).toThrow(
        'Stop with ID 99 not found'
      );
    });

    it('should throw error for invalid location type', () => {
      expect(() => getLocationType('invalid', [])).toThrow(
        'Invalid location type'
      );
    });
  });
});

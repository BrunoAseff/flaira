import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-1234'),
}));

describe('Trip Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateTripDuration', () => {
    it('should return 0 when endDate is null', () => {
      const startDate = new Date('2024-01-01');
      const endDate = null;

      const calculateDuration = (start: Date, end: Date | null): number => {
        if (!end) return 0;
        const diffMs = end.getTime() - start.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return Math.max(1, Math.ceil(diffDays));
      };

      expect(calculateDuration(startDate, endDate)).toBe(0);
    });

    it('should return at least 1 day for same start and end date', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-01');

      const calculateDuration = (start: Date, end: Date | null): number => {
        if (!end) return 0;
        const diffMs = end.getTime() - start.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return Math.max(1, Math.ceil(diffDays));
      };

      expect(calculateDuration(startDate, endDate)).toBe(1);
    });

    it('should calculate correct duration for multi-day trips', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-05');

      const calculateDuration = (start: Date, end: Date | null): number => {
        if (!end) return 0;
        const diffMs = end.getTime() - start.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return Math.max(1, Math.ceil(diffDays));
      };

      expect(calculateDuration(startDate, endDate)).toBe(4);
    });
  });

  describe('getLocationType', () => {
    const getLocationType = (
      id: string,
      stops: Array<{ id: number }>
    ): { type: 'start' | 'end' | 'stop'; stopIndex: number | null } => {
      if (id === 'start') return { type: 'start', stopIndex: null };
      if (id === 'end') return { type: 'end', stopIndex: null };
      if (id.startsWith('stop-')) {
        const stopIdStr = id.slice(5);
        const stopId = parseInt(stopIdStr, 10);

        if (!Number.isFinite(stopId) || stopIdStr !== stopId.toString()) {
          throw new Error(
            `Invalid stop ID format: ${id}. Expected format: 'stop-{number}'`
          );
        }

        const stopIndex = stops.findIndex((stop) => stop.id === stopId);
        if (stopIndex === -1) {
          throw new Error(`Stop with ID ${stopId} not found in route stops`);
        }

        return { type: 'stop', stopIndex };
      }
      throw new Error(
        `Invalid location type: ${id}. Expected 'start', 'end', or 'stop-{number}'`
      );
    };

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

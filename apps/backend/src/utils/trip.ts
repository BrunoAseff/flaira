export const calculateTripDuration = (
    startDate: Date,
    endDate: Date | null
  ): number => {
    if (!endDate) return 0;
  
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
    return Math.max(1, Math.ceil(diffDays));
  };
  
  export const getLocationType = (
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
import { describe, it, expect } from 'vitest';

describe('GET /status', () => {
  it('should return ok with postgres info', async () => {
    const response = await fetch('http://localhost:3001/status');
    const data = await response.json();

    expect(data.status).toBe('ok');
    expect(typeof data.data.postgres_version).toBe('string');
    expect(data.data.max_connections).toBeTypeOf('string');
    expect(Number(data.data.open_connections)).toBeGreaterThanOrEqual(0);
  });
});

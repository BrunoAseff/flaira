import { describe, it, expect } from "vitest";

describe("GET /status (integration)", () => {
  it("should return ok with postgres info", async () => {
    const res = await fetch("http://localhost:3001/status");
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe("ok");
    expect(json.data).toHaveProperty("postgres_version");
  });
});

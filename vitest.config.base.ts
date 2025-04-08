import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["dist", "node_modules"],
    coverage: {
      reporter: ["text", "html"],
    },
  },
});

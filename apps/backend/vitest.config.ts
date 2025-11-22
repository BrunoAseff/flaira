import { defineConfig, mergeConfig } from "vitest/config";
import base from "../../vitest.config.base";
import path from "path";

export default mergeConfig(
  base,
  defineConfig({
    test: {
      environment: "node",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }),
);

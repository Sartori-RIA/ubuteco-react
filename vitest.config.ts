import path from "node:path";
import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    setupFiles: ["src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "lcov"],
      include: [
        "src/app/kitchen/_lib/**/*.ts",
        "src/app/_lib/**/*.ts",
        "src/app/_services/**/*.ts",
        "src/app/_store/features/kitchen/**/*.ts",
        "src/app/_store/features/orders/**/*.ts",
        "src/app/orders/_lib/**/*.ts",
      ],
      exclude: [
        "src/app/**/*.test.{ts,tsx}",
        "src/app/**/_types/**",
        "src/test/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

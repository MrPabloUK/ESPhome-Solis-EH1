import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/main.ts",
      name: "SolisScheduleCard",
      fileName: () => "solis-schedule-card.js",
      formats: ["es"],
    },
    outDir: "dist",
    emptyOutDir: true,
    target: "es2020",
    sourcemap: false,
  },
  test: {
    environment: "node",
  },
});

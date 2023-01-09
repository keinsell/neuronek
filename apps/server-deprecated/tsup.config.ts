import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  splitting: true,
  target: "node18",
  sourcemap: true,
  clean: true,
});

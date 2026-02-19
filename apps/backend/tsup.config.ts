import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/**/*"],
  clean: true,
  format: ["esm"],

  target: "ES2022",
  splitting: false,
  external: ["cloudinary"],
  ...options,
}));

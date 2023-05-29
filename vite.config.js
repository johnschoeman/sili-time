/// <reference types="vitest" />

import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
  build: {
    outDir: "build",
  },
  test: {
    exclude: ["node_modules", "**/*.config.*", "build"],
    watchExclude: ["node_modules", "build"],
  },
  plugins: [solidPlugin()],
})

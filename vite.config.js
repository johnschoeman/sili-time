/// <reference types="vitest" />

import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import * as path from "path"

export default defineConfig({
  build: {
    outDir: "build",
    minify: false
  },
  test: {
    exclude: ["node_modules", "**/*.config.*", "build"],
    watchExclude: ["node_modules", "build"],
  },
  plugins: [solidPlugin()],
  resolve: {
    alias: [{ find: "@app", replacement: path.resolve(__dirname, "src") }],
  },
})

import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
  build: {
    outDir: "build",
  },
  plugins: [solidPlugin()]
})

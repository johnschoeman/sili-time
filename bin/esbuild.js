const esbuild = require("esbuild")
const { solidPlugin } = require("esbuild-plugin-solid")

esbuild.build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  minify: true,
  outfile: 'build/static/js/index.js',
  plugins: [solidPlugin()]
}).catch(() => process.exit(1))

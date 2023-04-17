const esbuild = require("esbuild")

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  outfile: 'build/static/js/index.js',
})

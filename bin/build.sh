#!/usr/bin/env bash
set -e

rm -rf build
mkdir build
cp -r public/* build

node bin/esbuild.js
npx tailwindcss -i src/tailwind.css -o build/static/css/index.css

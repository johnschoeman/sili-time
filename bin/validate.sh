#!/usr/bin/env bash
set -e

npm run tsc -- --noEmit
npm run prettier

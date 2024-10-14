#!/bin/bash
set -e
set -x

echo "Starting sam-build.sh"
npm ci
npm run build
cp -r node_modules dist/
echo "Contents of dist directory:"
ls -R dist/
echo "End of sam-build.sh"

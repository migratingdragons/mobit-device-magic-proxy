#!/bin/bash
set -e
set -x

echo "Starting sam-build.sh"
npm ci
npm run build
cp -r node_modules .
echo "Contents of current directory:"
ls -R
echo "End of sam-build.sh"

#!/bin/bash
npm ci
npm run build
cp -r node_modules dist/

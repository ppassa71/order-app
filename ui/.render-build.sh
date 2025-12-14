#!/bin/bash
# Render.com 프론트엔드 빌드 스크립트

echo "Installing dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Build completed!"


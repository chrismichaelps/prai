#!/bin/bash

# Exit on error
set -e

echo "Starting clean build process..."

echo "Clearing caches and build artifacts..."

# Remove Next.js specific build directories
rm -rf .next out

# Remove general build directory
rm -rf dist

# Remove Vite and Node.js caches (including Nuxt cache)
rm -rf node_modules/.vite
rm -rf node_modules/.cache

# Remove Turbo cache if exists
rm -rf .turbo

# Remove TypeScript build info files
find . -name "*.tsbuildinfo" -delete 2>/dev/null || true

echo "Installing dependencies (ensuring alignment)..."
pnpm install

echo "Building project..."
pnpm run build

echo "Clean build complete!"
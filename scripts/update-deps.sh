#!/bin/bash

# Exit on error
set -e

echo "Cleaning existing node_modules, lock file, and build artifacts..."
rm -rf node_modules pnpm-lock.yaml .next out

echo "Starting dependency update process..."

echo "Updating dependencies in package.json..."
pnpm dlx npm-check-updates -u

echo "Installing updated dependencies..."
pnpm install

echo "All dependencies updated successfully!"
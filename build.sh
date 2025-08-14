#!/bin/bash

echo "Starting build process for server only..."

# Install and build server only (for backend service)
echo "Installing server dependencies..."
cd appserver
npm install
echo "Building server..."
npm run build
cd ..

echo "Server build completed successfully!"
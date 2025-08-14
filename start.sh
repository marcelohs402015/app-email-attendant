#!/bin/bash

echo "Starting Email Attendant server..."

# Check if we're in the right directory
if [ -d "appserver" ]; then
    echo "Found appserver directory, changing to it..."
    cd appserver
fi

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "Dist directory not found, running build..."
    npm run build
fi

# Start the server
echo "Starting server from: $(pwd)"
npm start
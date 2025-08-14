#!/bin/bash
echo "Installing Email Attendant dependencies..."
echo

echo "[1/3] Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing root dependencies"
    exit 1
fi

echo
echo "[2/3] Installing client dependencies (with legacy peer deps)..."
cd appclient
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "Error installing client dependencies"
    exit 1
fi

echo
echo "[3/3] Installing server dependencies..."
cd ../appserver
npm install
if [ $? -ne 0 ]; then
    echo "Error installing server dependencies"
    exit 1
fi

cd ..
echo
echo "✅ Installation completed successfully!"
echo
echo "To start the application, run:"
echo "npm run dev"
echo
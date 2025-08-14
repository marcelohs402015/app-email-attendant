@echo off
echo Installing Email Attendant dependencies...
echo.

echo [1/3] Installing root dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error installing root dependencies
    pause
    exit /b 1
)

echo.
echo [2/3] Installing client dependencies (with legacy peer deps)...
cd appclient
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Error installing client dependencies
    pause
    exit /b 1
)

echo.
echo [3/3] Installing server dependencies...
cd ..\appserver
npm install
if %errorlevel% neq 0 (
    echo Error installing server dependencies
    pause
    exit /b 1
)

cd ..
echo.
echo ✅ Installation completed successfully!
echo.
echo To start the application, run:
echo npm run dev
echo.
pause
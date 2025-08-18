# 📦 Installation Guide - Email Attendant

## Quick Setup Instructions

### 🪟 Windows (PowerShell/CMD)

```powershell
# Clone the repository
git clone https://github.com/marcelohs402015/app-email-attendant.git
cd app-email-attendant

# Run the Windows installer (recommended)
install-windows.bat

# OR use npm command
npm run install:all
```

### 🐧 Linux/macOS (Terminal)

```bash
# Clone the repository
git clone https://github.com/marcelohs402015/app-email-attendant.git
cd app-email-attendant

# Run the Linux installer (recommended)
./install.sh

# OR use npm command
npm run install:all
```

## 🚀 Starting the Application

After installation, start the application:

```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000

## 🔧 Manual Installation (if scripts fail)

If the automatic installers don't work, follow these manual steps:

### Step 1: Install Root Dependencies
```bash
npm install
```

### Step 2: Install Client Dependencies
```bash
cd appclient
npm install --legacy-peer-deps
cd ..
```

### Step 3: Install Server Dependencies
```bash
cd appserver
npm install
cd ..
```

### Step 4: Start Application
```bash
npm run dev
```

## ❗ Troubleshooting

### Error: ERESOLVE could not resolve (TypeScript conflict)

This is a known issue with React Scripts and newer TypeScript versions. **Solution**:

```bash
cd appclient
npm install --legacy-peer-deps
```

### Error: Command not found

Make sure you have Node.js installed:
- Download from: https://nodejs.org/
- Required version: Node.js 16+ and npm 8+

### Port Already in Use

If ports 3000 or 3001 are busy:
- Stop other applications using these ports
- Or change ports in the configuration files

## 📋 System Requirements

- **Node.js**: 16.0 or higher
- **npm**: 8.0 or higher
- **OS**: Windows 10+, macOS 10.15+, or Linux
- **Memory**: 2GB RAM minimum
- **Storage**: 1GB free space

## 🎯 Project Structure

```
app-email-attendant/
├── appclient/          # React Frontend
├── appserver/          # Node.js Backend
├── install-windows.bat # Windows installer
├── install.sh          # Linux/macOS installer
└── package.json        # Root package configuration
```

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Ensure all dependencies are installed
3. Try the manual installation steps
4. Check the application logs for error details

The application uses **mock data only** - no external services required for testing.
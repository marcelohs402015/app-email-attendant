# 🏠 LOCAL DEVELOPMENT SETUP - COMPLETE GUIDE

## 🎯 Quick Start (2 Minutes Setup)

```bash
# 1. Clone the repository
git clone https://github.com/marcelohs402015/app-email-attendant.git
cd app-email-attendant

# 2. Install all dependencies
npm run install:all

# 3. Start development servers
npm run dev
```

**🌐 Access the application:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

---

## 📋 Detailed Setup Instructions

### Prerequisites

Make sure you have installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

**Check your versions:**
```bash
node --version    # Should be v18+
npm --version     # Should be 8+
git --version     # Any recent version
```

### Step 1: Clone and Navigate

```bash
# Clone the repository
git clone https://github.com/marcelohs402015/app-email-attendant.git

# Navigate to project directory
cd app-email-attendant

# Check project structure
ls -la
# You should see: client/, server/, package.json, etc.
```

### Step 2: Install Dependencies

**Option A: Install All at Once (Recommended)**
```bash
npm run install:all
```

**Option B: Install Individually**
```bash
# Install root dependencies (for development scripts)
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### Step 3: Environment Configuration (Optional)

The application works with mock data by default, but you can customize:

```bash
# Copy environment templates
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit if needed (optional for mock data)
# nano server/.env
# nano client/.env
```

**Default environment values:**
```env
# Server (.env)
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Client (.env)
REACT_APP_API_URL=http://localhost:3001
REACT_APP_NAME=Email Attendant
```

### Step 4: Start Development

**Option A: Start Both Services (Recommended)**
```bash
npm run dev
```
This starts both backend (port 3001) and frontend (port 3000) simultaneously.

**Option B: Start Services Individually**

Terminal 1 (Backend):
```bash
npm run server:dev
# OR
cd server && npm run dev
```

Terminal 2 (Frontend):
```bash
npm run client:dev
# OR  
cd client && npm run dev
```

---

## 🔧 Development Commands Reference

### Root Commands (from project root)
```bash
# Development
npm run dev              # Start both services
npm run server:dev       # Start only backend
npm run client:dev       # Start only frontend
npm run install:all      # Install all dependencies

# Build & Production
npm run build           # Build both services
npm run build:server    # Build only server
npm run build:client    # Build only client
npm run start          # Start production server

# Code Quality
npm run typecheck      # Check TypeScript in both
npm run test          # Run tests
```

### Server Commands (from /server directory)
```bash
cd server

# Development
npm run dev           # Start with hot-reload (port 3001)
npm install          # Install dependencies
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run typecheck    # Check TypeScript types

# Test API endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/emails
```

### Client Commands (from /client directory)  
```bash
cd client

# Development
npm run dev          # Start React dev server (port 3000)
npm install         # Install dependencies
npm run build       # Build for production
npm run test        # Run tests
npm run typecheck   # Check TypeScript types
```

---

## 🌐 Application Features & Access

### Main Pages
- **Dashboard**: http://localhost:3000/
- **Email Management**: http://localhost:3000/emails
- **Quotations**: http://localhost:3000/quotations
- **Services**: http://localhost:3000/services
- **Clients**: http://localhost:3000/clients
- **Calendar**: http://localhost:3000/calendar
- **Statistics**: http://localhost:3000/stats
- **Settings**: http://localhost:3000/settings

### API Endpoints (Backend)
- **Health Check**: http://localhost:3001/health
- **Emails**: http://localhost:3001/api/emails
- **Templates**: http://localhost:3001/api/templates
- **Services**: http://localhost:3001/api/services
- **Quotations**: http://localhost:3001/api/quotations
- **Clients**: http://localhost:3001/api/clients
- **Appointments**: http://localhost:3001/api/appointments
- **Statistics**: http://localhost:3001/api/stats/business

### Mock Data Features
- ✅ **50+ English emails** with categorization
- ✅ **15+ response templates** for different categories
- ✅ **20+ services** (electrical, plumbing, painting, etc.)
- ✅ **10+ clients** with contact information
- ✅ **25+ quotations** in various statuses
- ✅ **30+ appointments** distributed across dates

---

## 🔧 Development Workflow

### Making Changes

**Frontend Changes:**
1. Edit files in `/client/src/`
2. Changes auto-reload in browser
3. Check console for errors

**Backend Changes:**
1. Edit files in `/server/`  
2. Server auto-restarts with hot-reload
3. Test API endpoints

**Adding Dependencies:**
```bash
# Client dependencies
cd client && npm install package-name

# Server dependencies  
cd server && npm install package-name
```

### Testing Your Changes

```bash
# Check TypeScript types
npm run typecheck

# Build to ensure everything compiles
npm run build

# Run tests (if available)
npm run test
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 3000/3001
npx kill-port 3000
npx kill-port 3001

# Or find and kill manually
lsof -ti:3000 | xargs kill
lsof -ti:3001 | xargs kill
```

### Dependencies Issues
```bash
# Clear all node_modules and reinstall
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
```

### Build Issues
```bash
# Clear build artifacts
rm -rf server/dist client/build

# Rebuild everything
npm run build
```

### TypeScript Errors
```bash
# Check types without building
npm run typecheck

# Common fixes
cd server && npm run typecheck
cd client && npm run typecheck
```

### API Not Working
1. **Check backend is running**: http://localhost:3001/health
2. **Check browser console** for CORS errors
3. **Verify environment variables** in client/.env
4. **Restart both services**: Stop with Ctrl+C, then `npm run dev`

### Frontend Not Loading
1. **Check if running**: http://localhost:3000
2. **Clear browser cache**: Ctrl+Shift+R (hard refresh)
3. **Check client console** for JavaScript errors
4. **Verify client dependencies**: `cd client && npm install`

---

## 🚀 Production Testing Locally

Test the production build locally:

```bash
# Build both services
npm run build

# Start production server (backend only)
cd server && npm start

# Serve client build (in another terminal)
cd client
npx serve -s build -l 3000
```

Access production build at http://localhost:3000

---

## 📁 Project Structure Overview

```
app-email-attendant/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── services/    # API client code
│   │   ├── data/        # Mock data
│   │   └── types/       # TypeScript types
│   └── package.json     # Client dependencies
├── server/              # Node.js Backend  
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── shared/          # Shared utilities & data
│   ├── types/           # TypeScript types
│   └── package.json     # Server dependencies
├── package.json         # Root package.json (dev scripts)
└── README.md           # Project documentation
```

---

## 💡 Development Tips

1. **Use the integrated terminal** in VS Code for better workflow
2. **Install extensions**: ES7+ React/Redux/React-Native snippets, TypeScript Importer
3. **Enable auto-save** in your editor for hot-reload
4. **Use browser dev tools** to inspect API calls and React components
5. **Check both browser console and terminal** for errors
6. **The application is fully functional with mock data** - no external APIs needed

## ❤️ Happy Coding!

Your Email Attendant application should now be running locally. The mock data provides a complete demonstration of all features without needing any external services or databases.
# Deployment Guide for Render.com

This guide explains how to deploy the Email Attendant application on Render.com.

## Project Structure

```
project-email-attendant/
├── client/                 # React frontend
├── server/                 # Node.js backend  
├── build.sh               # Build script for Render
├── start.sh               # Start script for Render
├── render.yaml            # Render configuration
└── package.json           # Root package.json
```

## Deployment Steps

### 1. Prepare Your Repository

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Ensure all files are committed including:
   - `build.sh` and `start.sh` (executable)
   - `render.yaml` configuration
   - Both `client/` and `server/` directories

### 2. Deploy on Render.com

#### Option A: Using render.yaml (Recommended)

1. Go to [Render.com](https://render.com) and sign in
2. Click "New" > "Blueprint"
3. Connect your Git repository
4. Render will automatically detect the `render.yaml` file
5. Review and deploy both services

#### Option B: Manual Setup

**Backend Service:**
1. Click "New" > "Web Service"
2. Connect your repository
3. Configure:
   - **Name**: `email-attendant-server`
   - **Environment**: `Node`
   - **Build Command**: `./build.sh`
   - **Start Command**: `./start.sh`
   - **Plan**: Free
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `CLIENT_URL`: `https://your-frontend-url.onrender.com`

**Frontend Service:**
1. Click "New" > "Static Site"
2. Connect your repository
3. Configure:
   - **Name**: `email-attendant-client`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`
4. Add Environment Variables:
   - `REACT_APP_API_URL`: `https://your-backend-url.onrender.com`

### 3. Environment Variables

Make sure to set these environment variables on Render:

**Backend:**
- `NODE_ENV=production`
- `PORT=10000` (Render uses port 10000)
- `CLIENT_URL=https://your-frontend-url.onrender.com`

**Frontend:**
- `REACT_APP_API_URL=https://your-backend-url.onrender.com`

### 4. Domain Configuration

1. After deployment, note your service URLs
2. Update the `CLIENT_URL` in backend environment variables
3. Update the `REACT_APP_API_URL` in frontend environment variables
4. Redeploy if necessary

## Local Development

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

## Scripts Reference

### Root Scripts
- `npm run dev` - Start both client and server in development
- `npm run build` - Build both client and server for production
- `npm run start` - Start production server
- `npm run install:all` - Install dependencies for root, client, and server

### Server Scripts
- `npm run dev` - Start server in development with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server

### Client Scripts  
- `npm run dev` - Start React development server
- `npm run build` - Build React app for production
- `npm run typecheck` - Check TypeScript types

## Troubleshooting

### Build Issues
- Make sure `build.sh` and `start.sh` are executable
- Check that all dependencies are listed in package.json files
- Verify TypeScript compilation succeeds
- **If "Cannot find module dist/server.js"**: Use the alternative render configuration

### Common Render.com Deploy Errors

#### Error: "Cannot find module '/opt/render/project/src/dist/server.js'"
**Solution**: The build/start commands need to be configured correctly. Use one of these approaches:

**Option 1: Update render.yaml (Recommended)**
```yaml
buildCommand: "cd server && npm install && npm run build"
startCommand: "cd server && npm start"
```

**Option 2: Use render-alternative.yaml**
Copy `render-alternative.yaml` to `render.yaml` for more verbose build process.

**Option 3: Manual Service Configuration**
- Build Command: `cd server && npm install && npm run build`
- Start Command: `cd server && npm start`

### CORS Issues
- Ensure `CLIENT_URL` environment variable is set correctly on backend
- Check that frontend is making requests to correct API URL

### Environment Variables
- Double-check all environment variables are set on Render
- Use the exact URLs provided by Render services
- Remember to redeploy after changing environment variables

### Build Directory Issues
- Verify the server builds to `server/dist/` directory
- Check that TypeScript compiles without errors
- Ensure all imports are correctly resolved

## Features

- ✅ Mock data system (no database required)
- ✅ Email categorization and response
- ✅ Service management
- ✅ Client management  
- ✅ Calendar system
- ✅ Quotation system
- ✅ Statistics dashboard
- ✅ Responsive UI with Tailwind CSS
- ✅ TypeScript support
- ✅ Ready for Render.com deployment
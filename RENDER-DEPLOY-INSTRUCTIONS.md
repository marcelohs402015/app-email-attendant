# 🚀 RENDER.COM DEPLOYMENT - STEP BY STEP

## ⚠️ IMPORTANT: Fix for "Cannot find module" Error

The error occurs because Render needs specific build and start commands for our separated architecture.

## 🔧 SOLUTION: Use Manual Service Creation (Recommended)

### 1. Create Backend Service

1. Go to [Render.com Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure Backend Service:

**Service Details:**
- **Name**: `email-attendant-server`
- **Environment**: `Node`
- **Region**: Choose your preferred region
- **Branch**: `main` (or your main branch)

**Build & Deploy:**
- **Build Command**: 
  ```bash
  cd server && npm install && npm run build
  ```
- **Start Command**: 
  ```bash
  cd server && npm start
  ```

**Environment Variables:**
- `NODE_ENV` = `production`
- `PORT` = `10000`
- `CLIENT_URL` = `https://your-frontend-service-name.onrender.com`

### 2. Create Frontend Service

1. Click "New" → "Static Site"
2. Connect your GitHub repository
3. Configure Frontend Service:

**Service Details:**
- **Name**: `email-attendant-client`
- **Branch**: `main`

**Build & Deploy:**
- **Build Command**: 
  ```bash
  cd client && npm install && npm run build
  ```
- **Publish Directory**: 
  ```
  client/build
  ```

**Environment Variables:**
- `REACT_APP_API_URL` = `https://your-backend-service-name.onrender.com`

### 3. Update Environment Variables

After both services are created:

1. Get the URLs from Render dashboard
2. Update `CLIENT_URL` in backend service with actual frontend URL
3. Update `REACT_APP_API_URL` in frontend service with actual backend URL
4. Redeploy both services

## 📋 Alternative: Blueprint Deployment (If Fixed render.yaml)

If you want to use the blueprint approach, make sure your `render.yaml` is updated:

```yaml
services:
  - type: web
    name: email-attendant-server
    env: node
    buildCommand: "cd server && npm install && npm run build"
    startCommand: "cd server && npm start"
    plan: free
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: CLIENT_URL
        value: https://email-attendant-client.onrender.com
    
  - type: web
    name: email-attendant-client
    env: static
    buildCommand: "cd client && npm install && npm run build"
    staticPublishPath: ./client/build
    plan: free
    envVars:
      - key: REACT_APP_API_URL
        value: https://email-attendant-server.onrender.com
```

## ✅ Verification Steps

After deployment:

1. **Check Backend**: Visit `https://your-backend-url.onrender.com/health`
   - Should return: `{"status":"healthy",...}`

2. **Check Frontend**: Visit your frontend URL
   - Should load the Email Attendant interface

3. **Check API Connection**: Open browser console on frontend
   - Should not show CORS errors

## 🐛 Common Issues & Solutions

### Backend Service Issues
- **Build fails**: Check that `server/package.json` exists
- **Start fails**: Verify `server/dist/server.js` is created during build
- **Port errors**: Ensure PORT environment variable is set to 10000

### Frontend Service Issues  
- **Build fails**: Check that `client/package.json` exists
- **API calls fail**: Verify `REACT_APP_API_URL` points to correct backend URL
- **CORS errors**: Check that backend `CLIENT_URL` matches frontend URL

### Environment Variable Issues
- URLs must match exactly (no trailing slashes)
- Changes require redeployment to take effect
- Use HTTPS URLs for production

## 📞 Need Help?

If you continue having issues:
1. Check Render deployment logs for specific error messages
2. Verify file structure matches the documentation
3. Test build commands locally first: `cd server && npm run build`
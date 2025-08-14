# 📧 Email Attendant - Complete System for Service Professionals

> **Intelligent system for email categorization and automatic response with complete quote integration, developed especially for "handyman" professionals**

## 🎯 Overview

**Email Attendant** is a modern and complete web application that automates email, quote, client and appointment management for home service providers. With an intuitive interface and robust functionalities, the application uses mock data to demonstrate a complete business management system.

### 🏗️ Target Audience
**"Handyman"** professionals - contractors who perform:
- 🔧 Home repairs and maintenance
- ⚡ Electrical and plumbing services
- 🎨 Painting and finishes
- 🌿 Gardening and cleaning
- 🛠️ Small repairs in general

...
## ✨ Main Features

### 🌐 English Interface
- **Complete English interface** for professional use
- **Consistent terminology** for handyman services
- **Professional communication** templates and emails
- **Internationalization framework** ready for future expansion

### 📨 Smart Email System
- **Automatic categorization** by keywords (complaint, quote, information, support, sales)
- **Personalized templates** response with complete CRUD system
- **Modern web interface** for viewing and responding
- **Advanced filters** by category, sender and status
- **Realistic simulation** with mock data

### 💰 Advanced Quote System
- **Personalized generation** of quotes for clients
- **Automatic calculation** of totals with discount
- **📧 Direct email sending** - Complete modal with personalized composition
- **📎 Attachment in responses** - Quote selection on email response screen
- **Smart status** (draft, sent, accepted, rejected, completed)
- **Two sending methods**: attachment in response or independent direct sending

### 🏢 Complete Business Management
- **👥 Client registration** with complete history
- **🛠️ Service catalog** by category (electrical, plumbing, painting, etc.)
- **📅 Smart schedule** with weekly and daily view
- **📊 Executive dashboard** with real-time metrics

### 📈 Detailed Business Statistics
- **💰 Total revenue** and monthly evolution
- **📋 Quote performance** (accepted, pending, rejected)
- **👨‍💼 Client analysis** (active, with appointments)
- **⚡ Email response rate** with progressive visualization
- **🎯 Performance by category** of services
- **📊 Interactive charts** and visual cards

## 🚀 Technologies Used

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for responsive design
- **React Router** for navigation
- **React Query** for state management
- **Heroicons** for iconography
- **🌐 React-i18next** for translation management (English)

### Backend
- **Node.js** with Express
- **TypeScript** for typing
- **Mock REST API** with simulated delays
- **Integrated logging** system

### 🗄️ Data and Structure
- **Mock data** for complete demonstration
- **Complete CRUD** for all entities
- **Delay simulation** for API realism

## 🎨 Interface and Experience

### 📱 Responsive Design
- **Modern layout** with side navigation
- **Visual cards** for all functionalities
- **Interactive modals** for forms and confirmations
- **Loading states** and visual feedback
- **Consistent color system** for status

### 🎯 UX Features
- **Real-time preview** of templates
- **Smart form validation**
- **Security confirmations** for critical operations
- **Auto-fill** client data
- **Intuitive navigation** between modules
- **🌐 English interface** - Professional terminology and communication
- **Consistent messaging** - All texts in English

## 🛠️ Installation and Usage

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git (for deployment)

### 🚀 Quick Start - Local Development

```bash
# Clone the repository
git clone https://github.com/marcelohs402015/app-email-attendant.git
cd app-email-attendant

# Install all dependencies (root, client, server)
npm run install:all

# Start development (Backend + Frontend)
npm run dev
```

**🌐 Access:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001

#### ⚠️ **IMPORTANT: Make sure you're in the correct directory**

**If you need to start services individually, ensure you're in the project root directory:**

**Method 1 - Using root commands (Recommended):**
```bash
# Make sure you're in the correct project directory
cd /path/to/project-email-attendant

# Start both services automatically
npm run dev

# OR start individually from root
npm run server:dev  # Backend on port 3001
npm run client:dev  # Frontend on port 3000
```

**Method 2 - Manual terminal approach:**
```bash
# Terminal 1 - Start Server
cd /path/to/project-email-attendant/server
npm start

# Terminal 2 - Start Client  
cd /path/to/project-email-attendant/client
npm start
```

**📚 For detailed setup instructions:** [LOCAL-SETUP-INSTRUCTIONS.md](LOCAL-SETUP-INSTRUCTIONS.md)

### 🌍 English Interface

The application is **exclusively in English** and designed for professional handyman services.

**Interface features:**
- ✅ **Professional terminology**: Industry-standard handyman and service terms
- ✅ **Clear communication**: Email templates and client correspondence in English
- ✅ **Consistent UI**: All interface elements use English
- ✅ **Business focus**: Language optimized for service professionals

### 📋 Available Commands

#### Root Commands
```bash
# Development
npm run dev              # Starts backend (3001) + frontend (3000)
npm run install:all      # Install dependencies for all modules

# Build and Production
npm run build           # Complete build (server + client)
npm run start          # Start production server

# Code Quality
npm run typecheck      # TypeScript verification (both client & server)
npm run test          # Run tests
```

#### Server Commands (from root)
```bash
npm run server:dev     # Backend only (development with hot-reload)
npm run build:server   # Build server for production
```

#### Client Commands (from root)
```bash
npm run client:dev     # Frontend only (React development server)
npm run build:client   # Build client for production
```

#### Individual Module Commands
```bash
# Server (from /server directory)
cd server
npm run dev           # Development with hot-reload
npm run build         # Build TypeScript
npm run start         # Start production server
npm run typecheck     # TypeScript verification

# Client (from /client directory)  
cd client
npm run dev           # React development server
npm run build         # Build for production
npm run test          # Run tests
npm run typecheck     # TypeScript verification
```

## 📊 Application Modules

### 1. 📧 **Main Dashboard** (`/`)
- Overview with essential metrics
- Quick shortcuts to main functionalities
- Informative business cards

### 2. 📨 **Email Management** (`/emails`)
- Complete list with smart filters
- Response with template selection
- **Quote attachment** in responses
- Automatic categorization

### 3. 💼 **Quote System** (`/quotations`)
- Personalized quote generation
- **Direct email sending modal**
- Automatic calculations with discount
- Status tracking

### 4. 🛠️ **Service Catalog** (`/services`)
- Complete service CRUD
- Categorization by type
- Prices and necessary materials
- Active/inactive status

### 5. 👥 **Client Management** (`/clients`)
- Complete registration with contacts
- Relationship history
- Integration with quotes and schedule

### 6. 📅 **Professional Schedule** (`/calendar`)
- Weekly and daily view
- Appointments with status
- Client integration

### 7. 📊 **Advanced Statistics** (`/stats`)
- Complete executive dashboard
- Revenue and performance metrics
- Analysis by service categories
- Interactive charts

### 8. ⚙️ **Settings** (`/settings`)
- Template management
- Complete CRUD with validations
- Real-time preview

## 🔄 Email-Quote Integration

### 💡 **Featured Functionality**

The application offers **two smart ways** to send quotes:

#### 📎 **1. Attachment in Email Response**
- When replying to an email, select an existing quote
- System displays preview with detailed information
- Automatic attachment in sent response

#### 📧 **2. Direct Quote Sending**
- Complete email composition modal
- Auto-fill with client data
- Subject and message customization
- Independent sending from email conversation

## 🎯 Technical Differentials

### 🏗️ **Robust Architecture**
- **Smart componentization** with reusability
- **Efficient global state** with React Query
- **Realistic mock API** with simulated delays
- **Complete typing** in TypeScript
- **🌐 English interface** with react-i18next framework

### 🔒 **Validations and Security**
- Real-time form validation
- Confirmations for critical operations
- Comprehensive error handling
- Consistent loading states

### 📱 **Total Responsiveness**
- Mobile-first design
- Adaptive layouts for all devices
- Touch-optimized navigation
- Optimized performance

## 📈 Featured Statistics

The statistics module offers **valuable business insights**:

- 💰 **Total Revenue** with monthly evolution
- 📋 **Quote Conversion Rate**
- ⏱️ **Average Response Time** to emails
- 🏆 **Most Demanded Services** by category
- 👥 **Client Analysis** active vs new
- 📊 **Visual Performance** with charts and progress

## 🔮 Realistic Mock Data

The application includes **complete demonstration data**:
- ✅ 50+ categorized emails in English
- ✅ 15+ professional English templates
- ✅ 20+ services by category
- ✅ 10+ clients with history
- ✅ 25+ quotes in various statuses
- ✅ 30+ distributed appointments

## 🚀 Deployment on Render.com

### 🌐 Cloud Deployment Setup

The application is **ready for deployment** on Render.com with automated build and deployment scripts.

#### Quick Deploy Steps:

1. **Push to Git Repository**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy on Render.com**
   - Go to [Render.com](https://render.com) and sign in
   - Click "New" → "Blueprint"
   - Connect your Git repository
   - Render will detect `render.yaml` automatically
   - Review and deploy both services

#### Environment Variables for Production:

**Backend Service:**
- `NODE_ENV=production`
- `PORT=10000`
- `CLIENT_URL=https://your-frontend-url.onrender.com`

**Frontend Service:**
- `REACT_APP_API_URL=https://your-backend-url.onrender.com`

### 📝 Environment Configuration

#### Local Development Environment
```bash
# Server (.env)
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Client (.env)  
REACT_APP_API_URL=http://localhost:3001
REACT_APP_NAME=Email Attendant
```

#### Production Environment
The deployment uses environment variables set on Render.com platform for security and flexibility.

### 🔧 Deployment Scripts

The project includes automated deployment scripts:

- **`build.sh`** - Complete build process for Render.com
- **`start.sh`** - Production server startup
- **`render.yaml`** - Render.com service configuration

### 📚 Complete Setup & Deployment Guides

- **🏠 Local Development:** [LOCAL-SETUP-INSTRUCTIONS.md](LOCAL-SETUP-INSTRUCTIONS.md)
- **🚀 Render.com Deployment:** [RENDER-DEPLOY-INSTRUCTIONS.md](RENDER-DEPLOY-INSTRUCTIONS.md)  
- **📋 General Deployment:** [DEPLOY.md](DEPLOY.md)

## 🔧 Development Setup Guide

### 🎯 Step-by-Step Local Setup

1. **Clone and Navigate**
```bash
git clone [repository-url]
cd project-email-attendant
```

2. **Install Dependencies**
```bash
# Option A: Install all at once (recommended)
npm run install:all

# Option B: Install individually
npm install                # Root dependencies
cd client && npm install   # Frontend dependencies
cd ../server && npm install # Backend dependencies
cd ..                      # Back to root
```

3. **Environment Configuration**
```bash
# Copy environment templates
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit environment files with your settings (optional for mock data)
```

4. **Start Development**
```bash
# Start both services simultaneously
npm run dev

# OR start individually in separate terminals
npm run server:dev  # Terminal 1: Backend on port 3001
npm run client:dev  # Terminal 2: Frontend on port 3000
```

### 🏃‍♂️ Quick Test Commands

```bash
# Verify builds work
npm run build           # Build both services
npm run typecheck       # Check TypeScript types

# Test individual components
cd server && npm run build     # Server build only  
cd client && npm run build     # Client build only
```

### 🌐 Production Deployment Checklist

- ✅ **Code pushed to Git repository**
- ✅ **Environment variables configured on hosting platform**
- ✅ **Build scripts tested locally**
- ✅ **Both services configured with correct URLs**
- ✅ **CORS settings updated for production domains**

### 🔍 Troubleshooting

#### Common Local Development Issues:

**Port Already in Use (EADDRINUSE Error):**
```bash
# Option 1: Kill processes on specific ports
npx kill-port 3000
npx kill-port 3001

# Option 2: Find and kill processes manually
lsof -ti:3001 | xargs kill -9  # Kill server on port 3001
lsof -ti:3000 | xargs kill -9  # Kill client on port 3000

# Option 3: Kill all Node processes (use with caution)
pkill -f node
```

**Wrong Directory Error:**
```bash
# Make sure you're in the correct project directory
pwd  # Should show /path/to/project-email-attendant

# If you're in the wrong directory, navigate to the correct one
cd /path/to/your/project-email-attendant

# Then try starting again
npm run dev
```

**ES Module Import Errors:**
```bash
# If you see "Cannot use import statement outside a module"
cd server
# Check that package.json has "type": "module"
cat package.json | grep "type"

# If missing, the server package.json should include:
# "type": "module"
```

**TypeScript Errors:**
```bash
# Run type checking
npm run typecheck

# Clear and rebuild
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
npm run build
```

**Build Issues:**
```bash
# Clean builds and dependencies
rm -rf dist client/build server/dist
npm run build
```

**Server Won't Start - Import Path Issues:**
```bash
# If server fails with module resolution errors:
cd server
npm run build  # Rebuild TypeScript files
npm start       # Try starting again
```

#### Common Deployment Issues:

**Environment Variables:**
- Verify all required environment variables are set on hosting platform
- Check that URLs match the actual deployed service URLs
- Ensure NODE_ENV=production for server

**CORS Issues:**
- Update CLIENT_URL environment variable with actual frontend URL
- Verify REACT_APP_API_URL points to correct backend URL

**Build Failures:**
- Test build process locally first: `npm run build`
- Check deployment logs for specific error messages
- Verify all dependencies are properly listed in package.json files

## 🏗️ Project Structure

```
project-email-attendant/
├── client/                 # React Frontend (Separate Service)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Layout.tsx
│   │   │   ├── BusinessStats.tsx
│   │   │   ├── QuotationSelector.tsx
│   │   │   ├── EmailQuotationModal.tsx
│   │   │   └── [Other components]    # 🌐 English interface
│   │   ├── pages/          # Application pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── EmailList.tsx
│   │   │   ├── EmailDetail.tsx
│   │   │   ├── Quotations.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Clients.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── Stats.tsx
│   │   │   └── Settings.tsx
│   │   ├── services/       # API client
│   │   ├── config/         # API configuration
│   │   ├── data/           # Mock data
│   │   ├── locales/        # 🌐 English translations
│   │   │   └── en.json     #     English interface
│   │   ├── i18n.ts         # 🌐 react-i18next configuration
│   │   └── types/          # Frontend types
│   ├── package.json        # Client dependencies
│   └── .env.example        # Client environment template
├── server/                 # Node.js Backend (Separate Service)
│   ├── routes/             # All API routes
│   ├── services/           # Services (Gmail, Categorizer)
│   ├── shared/             # Shared utilities and data
│   ├── types/              # Backend TypeScript types
│   ├── server.ts           # Main Express server
│   ├── package.json        # Server dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   └── .env.example        # Server environment template
├── build.sh                # 🚀 Render.com build script
├── start.sh                # 🚀 Render.com start script
├── render.yaml             # 🚀 Render.com configuration
├── DEPLOY.md               # 📝 Complete deployment guide
├── package.json            # Root package.json with unified scripts
└── README.md               # This file
```

## 📡 Complete API Endpoints

### 📧 **Emails**
- `GET /api/emails` - List with filters and pagination
- `GET /api/emails/:id` - Specific details
- `POST /api/emails/sync` - Gmail synchronization
- `POST /api/emails/:id/reply` - Response (with quote attachment)
- `PATCH /api/emails/:id/status` - Update status

### 📝 **Templates**
- `GET /api/templates` - List templates
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template
- `GET /api/templates/:id` - Get by ID

### 💼 **Quotes**
- `GET /api/quotations` - List with filters
- `POST /api/quotations` - Create quote
- `PUT /api/quotations/:id` - Update quote
- `DELETE /api/quotations/:id` - Delete quote
- `POST /api/quotations/:id/send` - **Send by email**

### 🛠️ **Services**
- `GET /api/services` - Service list
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### 👥 **Clients**
- `GET /api/clients` - Client list
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### 📅 **Appointments**
- `GET /api/appointments` - Appointment list
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### 📊 **Statistics**
- `GET /api/stats/categories` - By category
- `GET /api/stats/business` - **Complete statistics**
- `GET /api/stats/revenue` - **Revenue evolution**

## 🚀 Technology Stack & Features

### ✅ Ready for Production
- **🌐 Render.com Deployment Ready** - Complete automation with build scripts
- **🔄 Separated Services** - Independent client and server deployments  
- **📦 Docker Ready** - Container support for various hosting platforms
- **🔧 Environment Flexible** - Easy configuration for different environments
- **📈 Scalable Architecture** - Microservices-ready structure

### 🎯 Key Technical Features
- **TypeScript Full Stack** - Type safety across client and server
- **React 18 with Modern Hooks** - Latest React features and patterns
- **Express.js REST API** - Robust and tested backend
- **Mock Data System** - No database setup required for development
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Hot Reload Development** - Fast development workflow

### 🔐 Production Features
- **Environment Variables** - Secure configuration management
- **CORS Configuration** - Proper cross-origin setup
- **Error Handling** - Comprehensive error management
- **Logging System** - Structured logging for debugging
- **Build Optimization** - Optimized bundles for production

## 🤝 How to Contribute

1. **Fork** the project
2. Create your **feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

## 📞 Support & Documentation

- **🏠 Local Setup Guide**: [LOCAL-SETUP-INSTRUCTIONS.md](LOCAL-SETUP-INSTRUCTIONS.md)
- **🚀 Render.com Deploy Guide**: [RENDER-DEPLOY-INSTRUCTIONS.md](RENDER-DEPLOY-INSTRUCTIONS.md)
- **📝 General Deployment Guide**: [DEPLOY.md](DEPLOY.md)
- **🏗️ Architecture Documentation**: Check `/client/src` and `/server` directories
- **🐛 Issue Reporting**: Use GitHub Issues for bug reports and feature requests
- **💬 Development Discussion**: Create GitHub Discussions for questions

## 📄 License

This project is under the MSTECH system development license. See the `LICENSE` file for more details.

---

<div align="center">

**🚀 Email Attendant - Transforming home service management with modern technology**

*Developed with ❤️ for professionals who make a difference in people's daily lives*

**✨ Now with complete Render.com deployment support and production-ready architecture ✨**

</div>

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Database } from './database/Database.js';
import { DatabaseConfig } from './types/database.js';
import { runMigrations } from './database/migrations.js';
import { ensureDatabaseExists } from './database/ensureDatabase.js';
import chatRoutes from './routes/chatRoutes.js';
import { createCategoryRoutesReal } from './routes/categoryRoutes.real.js';
import { createServicesRoutesReal } from './routes/servicesRoutes.real.js';
import { createClientsRoutesReal } from './routes/clientsRoutes.real.js';
import { createTemplatesRoutesReal } from './routes/templatesRoutes.real.js';
import { createQuotationsRoutesReal } from './routes/quotationsRoutes.real.js';
import { createAppointmentsRoutesReal } from './routes/appointmentsRoutes.real.js';
import { createAutomationRoutesReal } from './routes/automationRoutes.real.js';
import { createLogger } from './shared/logger.js';

dotenv.config();

const logger = createLogger('Server');
const PORT = process.env.PORT || 3001;
const DATA_MODE = (process.env.DATA_MODE || 'mock').toLowerCase();

function getDatabaseConfig(): DatabaseConfig {
  if (process.env.DATABASE_URL) {
    const useSSL = (process.env.DB_SSL || 'true').toLowerCase() === 'true';
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'handyman-api',
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'admin',
      ssl: useSSL ? { rejectUnauthorized: false } : false
    } as any;
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'handyman-api',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin',
    ssl: (process.env.DB_SSL || 'false') === 'true'
  } as any;
}

async function startServer() {
  try {
    logger.info(`Starting server in data mode: ${DATA_MODE} ...`);

    // Create Express app
    const app = express();

    // Middleware
    app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true
    }));
    
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Response headers with runtime metadata
    app.use((req, res, next) => {
      res.setHeader('x-data-mode', DATA_MODE);
      res.setHeader('x-app-version', process.env.APP_VERSION || '2.0.0');
      next();
    });

    // Request logging middleware
    app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      next();
    });

    // Health check endpoint v2.0
    app.get('/health', (req, res) => {
      const version = process.env.APP_VERSION || '2.0.0';
      const features = process.env.FEATURES ? process.env.FEATURES.split(',') : ['email-management', 'ai-chat', 'quotation-automation'];
      
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: version,
        features: features,
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3001,
        branch: 'feature/chat-integration-v2.0',
        dataMode: DATA_MODE
      });
    });

    // Simple endpoint to inspect current data mode
    app.get('/mode', (_req, res) => {
      res.json({ dataMode: DATA_MODE });
    });

    // API routes - Always use real mode with DB
    if (DATA_MODE === 'real') {
      try {
        const dbConfig = getDatabaseConfig();
        await ensureDatabaseExists(dbConfig.database, {
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
          ssl: dbConfig.ssl,
        });
        const db = new Database(dbConfig);
        app.set('db', db);
        await runMigrations(db);
        
        // Mount all DB-backed routes
        app.use('/api', createCategoryRoutesReal(db));
        app.use('/api', createServicesRoutesReal(db));
        app.use('/api', createClientsRoutesReal(db));
        app.use('/api', createTemplatesRoutesReal(db));
        app.use('/api', createQuotationsRoutesReal(db));
        app.use('/api', createAppointmentsRoutesReal(db));
        app.use('/api', createAutomationRoutesReal(db));
        
        logger.info('Database initialized, migrations applied, and all real DB-backed routes enabled');
      } catch (e) {
        logger.error('Failed to initialize database in real mode', (e as Error).message);
        process.exit(1);
      }
    } else {
      logger.error('Application requires DATA_MODE=real. Mock mode is no longer supported.');
      process.exit(1);
    }
    
    app.use('/api/chat', chatRoutes);

    // Error handling middleware
    app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Unhandled error:', error.message, { stack: error.stack });
      
      if (res.headersSent) {
        return next(error);
      }

      res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found'
      });
    });

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`API base URL: http://localhost:${PORT}/api`);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      logger.info('Received shutdown signal, closing server...');
      
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force close after 30 seconds
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    return server;
  } catch (error) {
    logger.error('Failed to start server:', (error as Error).message);
    process.exit(1);
  }
}

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch(error => {
    logger.error('Server startup failed:', error);
    process.exit(1);
  });
}

export { startServer };
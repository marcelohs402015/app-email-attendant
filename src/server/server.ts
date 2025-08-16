import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createEmailRoutes } from './routes/emailRoutes.js';
import { createCategoryRoutes } from './routes/categoryRoutes.js';
import { initializeDatabase, getDatabaseConfig } from './database.js';
import { createLogger } from '../shared/logger.js';

dotenv.config();

const logger = createLogger('Server');
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    logger.info('Starting server...');

    // Initialize database
    let database;
    try {
      const dbConfig = getDatabaseConfig();
      database = await initializeDatabase(dbConfig);
      logger.info('Database initialized successfully');
    } catch (error) {
      logger.warn('Failed to initialize database, using mock data:', (error as Error).message);
      database = null;
    }

    // Create Express app
    const app = express();

    // Middleware
    app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true
    }));
    
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging middleware
    app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      next();
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: database ? 'connected' : 'mock'
      });
    });

    // API routes
    app.use('/api', createEmailRoutes());
    
    // Category routes
    if (database) {
      app.use('/api', createCategoryRoutes(database));
      logger.info('Category routes enabled with database');
    } else {
      logger.warn('Category routes disabled - no database connection');
    }

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
      logger.info(`Database mode: ${database ? 'connected' : 'mock'}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      logger.info('Received shutdown signal, closing server...');
      
      server.close(async () => {
        if (database) {
          await database.close();
          logger.info('Database connection closed');
        }
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
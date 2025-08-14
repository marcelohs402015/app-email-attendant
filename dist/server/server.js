import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createEmailRoutes } from './routes/emailRoutes.js';
import { createLogger } from '../shared/logger.js';
dotenv.config();
const logger = createLogger('Server');
const PORT = process.env.PORT || 3001;
async function startServer() {
    try {
        logger.info('Starting server with mock data...');
        const app = express();
        app.use(cors({
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            credentials: true
        }));
        app.use(express.json({ limit: '10mb' }));
        app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        app.use((req, res, next) => {
            logger.info(`${req.method} ${req.path}`, {
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });
            next();
        });
        app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            });
        });
        app.use('/api', createEmailRoutes());
        app.use((error, req, res, next) => {
            logger.error('Unhandled error:', error.message, { stack: error.stack });
            if (res.headersSent) {
                return next(error);
            }
            res.status(500).json({
                success: false,
                error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
            });
        });
        app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: 'Endpoint not found'
            });
        });
        const server = app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`Health check: http://localhost:${PORT}/health`);
            logger.info(`API base URL: http://localhost:${PORT}/api`);
        });
        const gracefulShutdown = async () => {
            logger.info('Received shutdown signal, closing server...');
            server.close(() => {
                logger.info('HTTP server closed');
                process.exit(0);
            });
            setTimeout(() => {
                logger.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 30000);
        };
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);
        return server;
    }
    catch (error) {
        logger.error('Failed to start server:', error.message);
        process.exit(1);
    }
}
if (import.meta.url === `file://${process.argv[1]}`) {
    startServer().catch(error => {
        logger.error('Server startup failed:', error);
        process.exit(1);
    });
}
export { startServer };
//# sourceMappingURL=server.js.map
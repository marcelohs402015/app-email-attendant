import { Database } from '../database/Database.js';
import { DatabaseConfig } from '../types/database.js';
import { createLogger } from '../shared/logger.js';

const logger = createLogger('DatabaseInit');

export async function initializeDatabase(config: DatabaseConfig): Promise<Database> {
  try {
    logger.info('Initializing database connection...');
    
    const database = new Database(config);
    
    // Create tables
    logger.info('Creating database tables...');
    await database.createTables();
    
    // Insert default data
    logger.info('Inserting default data...');
    await database.insertDefaultTemplates();
    await database.insertDefaultCategories();
    
    logger.info('Database initialization completed successfully');
    return database;
  } catch (error) {
    logger.error('Failed to initialize database:', (error as Error).message);
    throw error;
  }
}

export function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'email_attendant',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
}

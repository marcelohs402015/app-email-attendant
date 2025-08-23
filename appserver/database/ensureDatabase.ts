import { Client } from 'pg';
import { createLogger } from '../shared/logger.js';

const logger = createLogger('EnsureDatabase');

export interface EnsureDbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  ssl?: boolean | Record<string, any>;
}

export async function ensureDatabaseExists(targetDatabase: string, config: EnsureDbConfig): Promise<void> {
  const adminClient = new Client({
    host: config.host,
    port: config.port,
    database: 'postgres',
    user: config.user,
    password: config.password,
    ssl: config.ssl,
  });

  try {
    await adminClient.connect();
    logger.info(`Connected to postgres database to ensure '${targetDatabase}' exists`);

    const existsResult = await adminClient.query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1) as exists`,
      [targetDatabase]
    );

    const exists = (existsResult.rows[0] as any).exists === true;
    if (exists) {
      logger.info(`Database '${targetDatabase}' already exists`);
      return;
    }

    logger.info(`Creating database '${targetDatabase}' ...`);
    await adminClient.query(`CREATE DATABASE "${targetDatabase}"`);
    logger.info(`Database '${targetDatabase}' created`);
  } catch (error) {
    logger.error('Failed to ensure database exists', (error as Error).message);
    throw error;
  } finally {
    await adminClient.end().catch(() => {});
  }
}



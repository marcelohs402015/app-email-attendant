import { PoolClient, QueryResult } from 'pg';
import { DatabaseConfig } from '../types/database.js';
export declare class Database {
    private pool;
    private logger;
    constructor(config: DatabaseConfig);
    query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
    getClient(): Promise<PoolClient>;
    transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T>;
    close(): Promise<void>;
    createTables(): Promise<void>;
    insertDefaultTemplates(): Promise<void>;
}
//# sourceMappingURL=Database.d.ts.map
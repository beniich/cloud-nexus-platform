import { Pool as PGPool } from 'pg';

export const pool = new PGPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'ai_site_builder',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export async function initializeDatabase() {
    try {
        await pool.query('SELECT NOW()');
        console.log('Database connection established');
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

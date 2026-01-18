import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'cloud_nexus',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;

export async function initializeDatabase() {
    try {
        await pool.query('SELECT NOW()');
        console.log('✅ Connexion base de données établie');
    } catch (error) {
        console.error('❌ Échec connexion base de données:', error);
        // Ne pas throw pour éviter de crasher tout le serveur au démarrage si DB pas prête
    }
}

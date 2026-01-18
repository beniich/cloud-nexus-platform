import { createClient } from 'redis';

export const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
    }
});

redisClient.on('error', (err) => console.error('Redis error:', err));

// Cache helpers
export async function getCache(key: string): Promise<any> {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
}

export async function setCache(key: string, value: any, ttl: number = 3600): Promise<void> {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
}

export async function delCache(key: string): Promise<void> {
    await redisClient.del(key);
}

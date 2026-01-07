const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.error('❌ Redis error:', err));

// Cache utilities
class CacheManager {
    async get(key) {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set(key, value, ttl = 3600) {
        await redis.setex(key, ttl, JSON.stringify(value));
    }

    async delete(key) {
        await redis.del(key);
    }

    async deletePattern(pattern) {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }

    // Rate limiting
    async rateLimit(key, limit, window) {
        const current = await redis.incr(key);
        if (current === 1) {
            await redis.expire(key, window);
        }
        return current <= limit;
    }

    // Session management
    async createSession(userId, sessionData, ttl = 86400) {
        const sessionId = `session:${userId}:${Date.now()}`;
        await this.set(sessionId, sessionData, ttl);
        return sessionId;
    }

    async getSession(sessionId) {
        return await this.get(sessionId);
    }

    async destroySession(sessionId) {
        await this.delete(sessionId);
    }
}

const cache = new CacheManager();

module.exports = { redis, cache };

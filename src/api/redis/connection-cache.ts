import Redis from 'ioredis';
import { env } from '~/api/env';

class ConnectionCache {

    private static instance: Redis;

    private static getInstance(): Redis {
        if (!ConnectionCache.instance) {
            ConnectionCache.instance = new Redis({
                host: env.REDIS_HOST,
                port: env.REDIS_PORT
            });
        }
        return ConnectionCache.instance;
    }

    public static async get(key): Promise<any> {
        var cachedObject = await ConnectionCache.getInstance().get(key);

        if (cachedObject != null) {
            return JSON.parse(cachedObject);
        } else {
            return {}
        }
    }

    public static async set(key, value) {
        await ConnectionCache.getInstance().set(key, JSON.stringify(value));
    }
}

export default ConnectionCache;
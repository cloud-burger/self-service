import Redis from 'ioredis';
import { env } from '~/api/env';

class ConnectionCache {

    private instance: Redis;

    constructor() {
        this.instance = new Redis(env.REDIS_PORT, env.REDIS_HOST);
    }

    private getInstance() {
        return this.instance;
    }

    public async isConnected(): Promise<boolean> {
        try {
          await this.instance.ping();
          return true;
        } catch (error) {
          return false;
        }
    }

    public async get(key): Promise<any> {
        var cachedObject = await this.getInstance().get(key);

        if (cachedObject != null) {
            return JSON.parse(cachedObject);
        } else {
            return {}
        }
    }

    public async set(key, value) {
        await this.getInstance().set(key, JSON.stringify(value));
    }
}

export default ConnectionCache;
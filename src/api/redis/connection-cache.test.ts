import Redis from 'ioredis';
import ConnectionCache from './connection-cache';

jest.mock('ioredis');

const MockedRedis = Redis as jest.Mocked<typeof Redis>;

describe('ConnectionCache', () => {
  let connectionCache: ConnectionCache;

  beforeEach(() => {
    MockedRedis.prototype.ping = jest.fn();
    connectionCache = new ConnectionCache();
  });

  it('should return true if Redis is connected', async () => {
    (MockedRedis.prototype.ping as jest.Mock).mockResolvedValue('PONG');

    const isConnected = await connectionCache.isConnected();
    expect(isConnected).toBe(true);
    expect(MockedRedis.prototype.ping).toHaveBeenCalledTimes(1);
  });

  it('should return false if Redis connection fails', async () => {
    (MockedRedis.prototype.ping as jest.Mock).mockRejectedValue(new Error('Connection error'));

    const isConnected = await connectionCache.isConnected();
    expect(isConnected).toBe(false);
    expect(MockedRedis.prototype.ping).toHaveBeenCalledTimes(1);
  });

  it('should set a value in Redis', async () => {
    const key = '12345678900';
    const value = [{
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
      document_number: '12345678900',
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
    }];

    const result = await connectionCache.set(key, value);
    expect(result).toBeUndefined();
    expect(MockedRedis.prototype.set).toHaveBeenCalledTimes(1);
  });

  it('should get a value from Redis', async () => {
    const key = '12345678900';
    const value = [{
      created_at: '2023-01-01',
      updated_at: '2023-01-01',
      document_number: '12345678900',
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
    }];

    (MockedRedis.prototype.get as jest.Mock).mockResolvedValue(JSON.stringify(value));

    const result = await connectionCache.get(key);
    expect(result).toStrictEqual(value);
    expect(MockedRedis.prototype.get).toHaveBeenCalledWith(key);
    expect(MockedRedis.prototype.get).toHaveBeenCalledTimes(1);
  });

  it('shouldnt get a value from Redis', async () => {
    const key = '12345678900';
    const value = {};

    (MockedRedis.prototype.get as jest.Mock).mockResolvedValue(null);

    const result = await connectionCache.get(key);
    expect(result).toStrictEqual(value);
    expect(MockedRedis.prototype.get).toHaveBeenCalledWith(key);
    expect(MockedRedis.prototype.get).toHaveBeenCalledTimes(1);
  });
});

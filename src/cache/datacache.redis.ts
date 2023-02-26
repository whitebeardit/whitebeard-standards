import Redis from 'ioredis';
import { Logger } from 'traceability';
import { IDatacache } from './datacache.interface';

export class Datacache implements IDatacache {
  private readonly REDIS_TTL_EXPIRE: string;

  private readonly REDIS_KEYPREFIX: string;

  public readonly redis;

  private static instance: Datacache;

  public static getInstance(): Datacache {
    if (!this.instance) {
      throw new Error('datacache is not initialized');
    }
    return this.instance;
  }

  constructor({
    REDIS_HOST,
    REDIS_PORT,
    REDIS_KEYPREFIX,
    REDIS_PASSWORD,
    REDIS_TTL_EXPIRE,
  }: {
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_KEYPREFIX: string;
    REDIS_PASSWORD: string;
    REDIS_TTL_EXPIRE: string;
  }) {
    if (!Datacache.instance) {
      Datacache.instance = this;
    }

    this.REDIS_TTL_EXPIRE = REDIS_TTL_EXPIRE;
    this.REDIS_KEYPREFIX = REDIS_KEYPREFIX;
    const redisConfig: Redis.RedisOptions = {
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
      keyPrefix: REDIS_KEYPREFIX,
      enableReadyCheck: false,
    };
    if (REDIS_PASSWORD) redisConfig.password = REDIS_PASSWORD;

    this.redis = new Redis(redisConfig);

    this.redis.on('error', (err: Error) => {
      Logger.error(`Error to connect - Redis: Error: ${err.message}`, {
        eventName: 'Datacache.constructor',
        eventData: { REDIS_HOST, REDIS_PORT },
      });
    });

    this.redis.on('ready', () => {});
    this.redis.on('connect', () => {
      Logger.info('Connection Stablished - Redis');
    });
  }

  async get(key: string) {
    const value = await this.redis.get(key);

    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttlInSeconds = this.REDIS_TTL_EXPIRE) {
    return this.redis.set(key, JSON.stringify(value), 'EX', ttlInSeconds);
  }

  async del(key: string) {
    return this.redis.del(key);
  }

  async setKeyWithExpire(key: string, value: any, expire: number) {
    return this.redis.set(key, JSON.stringify(value), 'EX', expire);
  }

  async delPrefix(prefix: string) {
    const keys = (
      await this.redis.keys(`${this.REDIS_KEYPREFIX}${prefix}:*`)
    ).map((key: any) => key.replace(String(this.REDIS_KEYPREFIX), ''));

    return this.redis.del(keys);
  }

  private async createList(listKey: string, listItems: Array<any>) {
    const isListCreated = await this.redis.rpush(listKey, listItems);

    return Boolean(isListCreated);
  }

  private async hasCreatedKey(key: string) {
    const hasCreatedKey = await this.redis.exists(key);

    return Boolean(hasCreatedKey);
  }

  private async addExpireTimeToKeyInSeconds(key: string, seconds: number) {
    const isExpireTimeAdd = await this.redis.expire(key, seconds);

    return Boolean(isExpireTimeAdd);
  }

  private async getItemsFromListOnRange(
    listKey: string,
    startIndex: number = 0,
    stopIndex: number = -1,
  ): Promise<any> {
    const list = await this.redis.lrange(listKey, startIndex, stopIndex);

    return list;
  }

  async getCachedItemsPaginated(key: string, offset: number, limit: number) {
    const hasCreatedKey = await this.hasCreatedKey(key);
    if (!hasCreatedKey) {
      return false;
    }

    const itemsCached = await this.getItemsFromListOnRange(
      key,
      offset,
      offset + limit - 1,
    );

    return itemsCached.map((item: string) => JSON.parse(item));
  }

  async getCachedItems(key: string) {
    const hasCreatedKey = await this.hasCreatedKey(key);
    if (!hasCreatedKey) {
      return false;
    }

    const itemsCached = await this.getItemsFromListOnRange(key);

    return itemsCached.map((item: string) => JSON.parse(item));
  }

  async createCachedItems(
    key: string,
    items: Array<any>,
    timeInSeconds: number,
  ): Promise<void> {
    await this.createList(
      key,
      items.map((item) => JSON.stringify(item)),
    );
    await this.addExpireTimeToKeyInSeconds(key, timeInSeconds);
  }
}

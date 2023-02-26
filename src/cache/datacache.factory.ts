import { IDatacache, Datacache } from ".";

export class DatacacheRedisFactory {
  static create({
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
  }): IDatacache {
    return new Datacache({
      REDIS_HOST,
      REDIS_PORT,
      REDIS_KEYPREFIX,
      REDIS_PASSWORD,
      REDIS_TTL_EXPIRE,
    });
  }
}

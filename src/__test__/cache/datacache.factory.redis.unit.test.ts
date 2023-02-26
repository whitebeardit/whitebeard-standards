import { Logger } from 'traceability';
import { Datacache, DatacacheRedisFactory } from '../../cache';

const loggerSpy = jest
  .spyOn(Logger, 'error')
  .mockReturnValue({} as unknown as typeof Logger);

describe('datacache factory redis', () => {
  it('should return a new datacache instance', async () => {
    const result = DatacacheRedisFactory.create({
      REDIS_HOST: '__TEST__',
      REDIS_PORT: '__TEST__',
      REDIS_KEYPREFIX: '__TEST__',
      REDIS_PASSWORD: '__TEST__',
      REDIS_TTL_EXPIRE: '__TEST__',
    });
    expect(result instanceof Datacache).toEqual(true);
  });
});

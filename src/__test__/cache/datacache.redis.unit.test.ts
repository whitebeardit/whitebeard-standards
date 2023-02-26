import { Logger } from 'traceability';
import { Datacache } from './../../cache/datacache.redis';

const loggerSpy = jest
  .spyOn(Logger, 'error')
  .mockReturnValue({} as unknown as typeof Logger);

describe('datacache redis', () => {
  beforeAll(() => {
    new Datacache({
      REDIS_HOST: '__TEST__',
      REDIS_PORT: '__TEST__',
      REDIS_KEYPREFIX: '__TEST__',
      REDIS_PASSWORD: '__TEST__',
      REDIS_TTL_EXPIRE: '__TEST__',
    });
  });

  it('should check the instance when get instance that already initialized before', async () => {
    const instance = Datacache.getInstance();
    expect(instance instanceof Datacache).toBe(true);
  });

  it('should return OK when set a value on a key', async () => {
    const instance = Datacache.getInstance();
    const result = await instance.set('TEST', { test: true });
    expect(result).toEqual('OK');
  });

  it('should return value when get a key that exists', async () => {
    const instance = Datacache.getInstance();
    const objToInsert = { test: true };
    await instance.set('TEST', objToInsert);
    const result = await instance.get('TEST');

    expect(objToInsert).toEqual(result);
  });

  it('should return null when try get a key that already deleted', async () => {
    const instance = Datacache.getInstance();
    const objToInsert = { test: true };
    await instance.set('TEST', objToInsert);
    await instance.del('TEST');
    const result = await instance.get('TEST');

    expect(null).toEqual(result);
  });

  it('should return null when try get a key that already deleted by ttl', async () => {
    const instance = Datacache.getInstance();
    const objToInsert = { test: true };
    await instance.setKeyWithExpire('TEST', objToInsert, 1);
  });

  it('should return null when try get a key that already deleted', async () => {
    const instance = Datacache.getInstance();
    const objToInsert = { test: true };
    await instance.set('TEST_1', objToInsert);
    await instance.set('TEST_2', objToInsert);
    await instance.set('TEST_3', objToInsert);
    await instance.delPrefix('TEST_');

    const result = await instance.get('TEST:*');

    expect(null).toEqual(result);
  });

  it('should create a list of items', async () => {
    const instance = Datacache.getInstance();
    await instance.delPrefix('TEST_');
    const KEY = 'TEST_KEY';
    const ITEMS = [{ key: 1, value: 2, anykey: 'a' }];
    const SECONDS = 1;
    await instance.createCachedItems(KEY, ITEMS, SECONDS);

    const result = await instance.getCachedItems(KEY);

    expect(ITEMS).toEqual(result);
  });
});

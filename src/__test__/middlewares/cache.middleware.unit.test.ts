import { NextFunction } from 'express';
import { Datacache } from '../../cache';
import { cacheMiddleware } from '../../middlewares';

describe('cache middleware redis', () => {
  let mockRequest = {
    originalUrl: 'url_test',
  };
  let mockResponse: any;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockResponse = {};
    mockResponse.send = jest.fn().mockReturnValue(mockResponse);
  });

  beforeAll(() => {
    new Datacache({
      REDIS_HOST: '__TEST__',
      REDIS_PORT: '__TEST__',
      REDIS_KEYPREFIX: '__TEST__',
      REDIS_PASSWORD: '__TEST__',
      REDIS_TTL_EXPIRE: '__TEST__',
    });
  });

  it('should check if cache middleware is applied', async () => {
    await cacheMiddleware(60)(mockRequest, mockResponse, nextFunction);

    expect(nextFunction).toBeCalledTimes(1);
  });
});

import { MongooseDatabase } from '../../db/database.mongoose';

const DB_URI = 'DB_URI_TEST';
const DB_NAME = 'DB_NAME_TEST';

describe('Database Mongoose', () => {
  it('should start database connection', async () => {
    const spy = jest.spyOn(MongooseDatabase.prototype, 'start');
    spy.mockResolvedValue();

    const mongooseDatabase = new MongooseDatabase(DB_URI, DB_NAME);

    await mongooseDatabase.start();

    expect(spy).toBeCalledTimes(1);
  });

  it('should close database connection', async () => {
    const spy = jest.spyOn(MongooseDatabase.prototype, 'close');

    const mongooseDatabase = new MongooseDatabase(DB_URI, DB_NAME);

    await mongooseDatabase.close();

    expect(spy).toBeCalledTimes(1);
  });
});

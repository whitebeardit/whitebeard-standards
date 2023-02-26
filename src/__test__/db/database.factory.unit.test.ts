import { DatabaseMongooseFactory, MongooseDatabase } from '../../db';

describe('Database factory', () => {
  it('should return a new database instance', async () => {
    const result = DatabaseMongooseFactory.create(
      'DB_URI_TEST',
      'DB_NAME_TEST',
    );
    expect(result instanceof MongooseDatabase).toEqual(true);
  });
});

import { IDatabase } from './database.interface';
import { MongooseDatabase } from './database.mongoose';

export class DatabaseMongooseFactory {
  static create(dbUri: string, dbName: string): IDatabase {
    return new MongooseDatabase(dbUri, dbName);
  }
}

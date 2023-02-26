export type OK = 'OK';

export interface IDatacache {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl?: string): Promise<OK | null>;
}

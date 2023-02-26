//@ts-ignore
global.process.env.NEW_RELIC_ENABLED = false;
import { IMessagingRabbitMq } from '../../messaging';
import { Server } from 'http';
import { App } from '../../server';
import { IDatabase } from '../../db';

const startAndCloseMethodsMock = {
  start: jest.fn(),
  close: jest.fn(),
};
const dbMock = startAndCloseMethodsMock;

const messagingMock = {
  ...startAndCloseMethodsMock,
  createChannel: jest.fn(),
};

const factoryApp = (attributes: any = {}) => {
  const sut = new App({
    port: 3000,
    middleWares: [],
    middleWaresToStart: [],
    controllers: [],
    database: dbMock as unknown as IDatabase,
    messaging: messagingMock as unknown as IMessagingRabbitMq,
    apiSpecLocation: 'string',
    customizers: [],
    ...attributes,
  });
  return { sut };
};

describe('App', () => {
  it('create an app and check configurations without middlewares and controllers', async () => {
    const { sut } = factoryApp();

    expect(sut).toEqual(
      expect.objectContaining({
        port: 3000,
        apiSpecLocation: 'string',
        database: dbMock,
      }),
    );
  });
  it('create an app and check configure database', async () => {
    const { sut } = factoryApp();
    sut.databaseSetup();

    expect(dbMock.start).toBeCalledTimes(1);
  });

  it('create an app and check getDatabaseInstance', async () => {
    const { sut } = factoryApp();
    const database = sut.getDatabaseInstance();

    expect(typeof database).toBe('object');
  });

  it('create an app and check close database connection', async () => {
    const { sut } = factoryApp();
    await sut.closeDatabase();

    expect(dbMock.close).toBeCalledTimes(1);
  });

  it('create an app and check configure messaging', async () => {
    const { sut } = factoryApp();

    sut.messagingSetup();

    expect(messagingMock.start).toBeCalledTimes(1);
  });

  it('create an app and check listen method return', async () => {
    const { sut } = factoryApp();

    const server = sut.listen();

    expect(server).toBeInstanceOf(Server);

    server.close();
  });

  it('create an app and check listen method return', async () => {
    const { sut } = factoryApp({ controllersBeforeMiddlewares: [] });

    const server = sut.listen();

    expect(server).toBeInstanceOf(Server);

    server.close();
  });
});

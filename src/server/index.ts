import express, { Application, RequestHandler } from 'express';
import { ContextAsyncHooks, Logger } from 'traceability';
import { IMessagingRabbitMq } from '../messaging';
import { Server } from 'http';
import cors from 'cors';
import { IDatabase } from '../db';
import { IDatacache } from '../cache';
import { IController } from '../controllers';

class App {
  public app: Application;

  public port: number;

  public apiSpecLocation: string;

  private readonly database: IDatabase;

  private readonly newRelic: any;

  private readonly datacache?: IDatacache;

  private readonly messaging?: IMessagingRabbitMq;

  private readonly timeoutMilliseconds?: number;

  private readonly middleWaresToStart = [
    express.json(),
    express.urlencoded({ extended: true }),
    ContextAsyncHooks.getExpressMiddlewareTracking(),
    cors({
      origin: 'https://services.rehem.dev',
    }),
  ];

  constructor(appInit: {
    port: number;
    middleWares: Array<RequestHandler>;
    controllersBeforeMiddlewares?: Array<IController>;
    controllers: Array<IController>;
    database: IDatabase;
    apiSpecLocation: string;
    newRelic?: any;
    datacache?: IDatacache;
    messaging?: IMessagingRabbitMq;
    customizers: Array<
      (application: Application, fileDestination: string) => void
    >;
    timeoutMilliseconds?: number;
  }) {
    this.app = express();
    this.port = appInit.port;
    this.newRelic = appInit.newRelic;

    this.database = appInit.database;
    this.messaging = appInit.messaging;
    this.datacache = appInit.datacache;
    this.apiSpecLocation = appInit.apiSpecLocation;
    this.timeoutMilliseconds = appInit.timeoutMilliseconds;

    this.middlewares(this.middleWaresToStart);

    if (appInit.controllersBeforeMiddlewares) {
      this.routes(appInit.controllersBeforeMiddlewares, '/public');
    }

    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
    this.customizers(appInit.customizers);
  }

  private customizers(
    customizers: Array<(application: Application, apiSpecFile: string) => void>,
  ) {
    customizers.forEach((customizer) =>
      customizer(this.app, this.apiSpecLocation),
    );
  }

  private middlewares(middleWares: Array<RequestHandler>) {
    middleWares.forEach((middleWare) => this.app.use(middleWare));
  }

  private routes(controllers: Array<IController>, pathRoute = '/') {
    this.newRelic?.startSegment();
    controllers.forEach((controller) =>
      this.app.use(pathRoute, controller.getRoutes()),
    );
  }

  public async databaseSetup() {
    await this.database.start();
  }

  public getDatabaseInstance() {
    return this.database;
  }

  public async closeDatabase() {
    await this.database.close();
  }

  public async messagingSetup() {
    if (this.messaging) {
      await this.messaging.start();
    }
  }

  public listen(): Server {
    return this.app
      .listen(this.port, () => {
        Logger.info(`App listening on the http://localhost:${this.port}`, {
          eventName: 'start_listening',
          process: 'Application',
        });
      })
      .setTimeout(this.timeoutMilliseconds || 29000);
  }
}

export { App };

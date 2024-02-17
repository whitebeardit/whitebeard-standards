import { IController, IDatabase, IDatacache } from './../index';
import express, { Application, RequestHandler } from 'express';
import { ContextAsyncHooks, Logger } from 'traceability';
import { IMessagingRabbitMq } from '../messaging';
import { Server } from 'http';
import cors from 'cors';

class App {
  public app: Application;

  public port: number;

  public apiSpecLocation: string;

  private readonly database?: IDatabase;

  private readonly newRelic?: any;

  private readonly datacache?: IDatacache;

  private readonly messaging?: IMessagingRabbitMq;

  private readonly timeoutMilliseconds?: number;

  private readonly middleWaresToStart = [
    express.json({ limit: '10mb' }),
    express.urlencoded({ limit: '10mb', extended: true }),
    ContextAsyncHooks.getExpressMiddlewareTracking(),
  ];

  private buildCorsOptions(
    originAllowed?: string[],
    corsWithCredentials?: boolean,
  ) {
    const corsOptions = {
      origin: [
        'https://dev-portal.services.quero.io',
        ...(originAllowed || []),
      ],
    };
    if (corsWithCredentials) {
      return { ...corsOptions, credentials: true };
    }

    return corsOptions;
  }

  constructor(appInit: {
    port: number;
    originAllowed?: string[];
    corsWithCredentials?: boolean;
    middleWares: Array<RequestHandler>;
    middlewaresToStart?: Array<RequestHandler>;
    controllersBeforeMiddlewares?: Array<IController>;
    controllers: Array<IController>;
    database?: IDatabase;
    apiSpecLocation: string;
    newRelic?: any;
    datacache?: IDatacache;
    messaging?: IMessagingRabbitMq;
    customizers: Array<
      (application: Application, fileDestination: string) => void
    >;
    timeoutMilliseconds?: number;
  }) {
    this.middleWaresToStart.push(
      cors(
        this.buildCorsOptions(
          appInit.originAllowed,
          appInit.corsWithCredentials,
        ),
      ),
    );
    if (appInit.middlewaresToStart) {
      this.middleWaresToStart.push(...appInit.middlewaresToStart);
    }
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
    await this.database?.start();
  }

  public getDatabaseInstance() {
    return this.database;
  }

  public async closeDatabase() {
    await this.database?.close();
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

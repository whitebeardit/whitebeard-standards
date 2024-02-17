import { Socket } from 'dgram';
import { IncomingMessage, Server as HttpServer, ServerResponse } from 'http';
import { Server as HttpsServer } from 'https';
import { Logger } from 'traceability';
import {
  ISocketsMap,
  ProcessEventsGracefulShutdownEnum,
} from './interfaces/graceful-shutdown.interface';

export class GracefulShutdownManager {
  private connections: ISocketsMap = {};

  private nextConnectionId = 1;

  private terminating = false;

  constructor(private readonly server?: HttpServer | HttpsServer) {
    this.startWatchingProcess();
  }

  public handleTerminateServer(callback: () => void) {
    this.startWatchingServer();

    this.handleTerminate(() => this.terminateServer(callback));
  }

  public handleTerminate(callback: () => void) {
    process.on(ProcessEventsGracefulShutdownEnum.SIGINT, () => {
      Logger.info(
        `${ProcessEventsGracefulShutdownEnum.SIGINT} has been called`,
      );
      callback();
    });

    process.on(ProcessEventsGracefulShutdownEnum.SIGTERM, () => {
      Logger.info(`SIGTERM has been called`);
      callback();
    });
  }

  /**
   * Initiates graceful termination of the server.
   * It first asks server to stop accepting new requests and then
   * terminates all open idle connections.
   * By putting the server into termination phase all active connections
   * would be automatically terminated after requests are properly complete.
   */
  public terminateServer(callback: () => void) {
    this.terminating = true;

    this.server!.close(callback);

    for (const connectionId in this.connections) {
      if (this.connections.hasOwnProperty(connectionId)) {
        const socket = this.connections[connectionId];
        this.closeIdleConnection(socket);
      }
    }
  }

  private startWatchingServer() {
    this.server!.on('connection', this.onConnection.bind(this));
    this.server!.on('request', this.onRequest.bind(this));
  }

  private startWatchingProcess() {
    // avoid system break
    process.on(
      ProcessEventsGracefulShutdownEnum.UNCAUGHT_EXCEPTION,
      (error, origin) => {
        Logger.error(error.message, {
          eventName: 'GracefulShutdownManager.startWatchingProcess',
          eventData: {
            origin,
            processName: ProcessEventsGracefulShutdownEnum.UNCAUGHT_EXCEPTION,
          },
        });
      },
    );

    // avoid warn of unhandled promise
    process.on(
      ProcessEventsGracefulShutdownEnum.UNHANDLED_REJECTION,
      (error: any) => {
        Logger.error(error.message, {
          eventName: 'GracefulShutdownManager.startWatchingProcess',
          eventData: {
            processName: ProcessEventsGracefulShutdownEnum.UNHANDLED_REJECTION,
          },
        });
      },
    );
  }

  /**
   * Initializes new connection by adding idle flag to it and
   * tracks the connection inside of internal list.
   */
  private onConnection(connection: Socket | any) {
    const connectionId = this.nextConnectionId++;

    connection.isIdle = true;

    this.connections[connectionId] = connection;

    connection.on('close', () => delete this.connections[connectionId]);
  }

  /**
   * Changes connection status to active during the request.
   * Makes sure that connection is closed when request is finished during
   * shutdown phase.
   */
  private onRequest(request: IncomingMessage, response: ServerResponse) {
    const connection = request.socket as any;

    connection.isIdle = false;

    response.on('finish', () => {
      connection.isIdle = true;

      if (this.terminating) {
        this.closeIdleConnection(connection);
      }
    });
  }

  private closeIdleConnection(connection: Socket | any) {
    if (connection.isIdle) {
      connection.destroy();
    }
  }
}

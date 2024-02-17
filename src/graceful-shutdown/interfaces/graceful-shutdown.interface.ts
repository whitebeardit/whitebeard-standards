/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-undef */
import Socket = NodeJS.Socket;

export interface ISocketsMap {
  [key: number]: Socket;
}

export enum ProcessEventsGracefulShutdownEnum {
  SIGTERM = 'SIGTERM',
  SIGINT = 'SIGINT',
  UNCAUGHT_EXCEPTION = 'uncaughtException',
  UNHANDLED_REJECTION = 'unhandledRejection',
}

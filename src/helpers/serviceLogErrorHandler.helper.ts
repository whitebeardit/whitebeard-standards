import { HttpError } from 'express-openapi-validator/dist/framework/types';
import { Logger } from 'traceability';

export const serviceLogErrorHandler = (
  error: HttpError | Error,
  event?: {
    eventName: string;
    eventData?: Object;
  },
): void => {
  if (!(error instanceof HttpError)) {
    Logger.error(error.message, event);
  }
};

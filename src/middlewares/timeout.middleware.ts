import { NextFunction, Request, Response } from 'express';
import { Logger } from 'traceability';
import { decreaseAttributesLengthFromObject } from '../helpers/utils';

export const timeoutMiddleware = (milliseconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      url: req.url,
      body: decreaseAttributesLengthFromObject(req.body),
      method: req.method,
      query: req.query,
    };
    res.setTimeout(milliseconds, () => {
      Logger.error('ERROR_RESPONSE_TIMEOUT', {
        eventName: 'ERROR_RESPONSE_TIMEOUT',
        eventData: request,
      });
      res.status(503).send({ message: 'Response timeout error' }).end();
    });

    next();
  };
};

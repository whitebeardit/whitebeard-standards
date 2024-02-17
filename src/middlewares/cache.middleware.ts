/* eslint-disable no-param-reassign */
import { Logger } from "traceability";
import { Request, Response, NextFunction, Send } from "express";
import { Datacache } from "../cache";

interface IResponse extends Response {
  sendResponse: Send;
}

export const cacheMiddleware = (seconds: number): any => {
  return async (
    req: Request,
    resp: IResponse,
    next: NextFunction
  ): Promise<any> => {
    try {
      const redis = Datacache.getInstance();
      const key = `_WB_${req.originalUrl}` || req.url;

      const cachedResponse = await redis.get(key);

      if (cachedResponse) {
        try {
          resp.contentType("application/json; charset=utf-8");
          const { statusCode, body } = JSON.parse(cachedResponse);
          return resp.status(statusCode).send(body);
        } catch (err) {
          return resp.send(cachedResponse);
        }
      }

      resp.sendResponse = resp.send;
      const newSend = (body: any) => {
        redis.set(
          key,
          JSON.stringify({ statusCode: resp.statusCode, body }),
          String(seconds)
        );
        resp.sendResponse(body);
      };

      // @ts-ignore
      resp.send = newSend;
      return next();
    } catch (ex: any) {
      Logger.warn(`cache.middleware ERROR: ${ex.message}`);

      return next();
    }
  };
};

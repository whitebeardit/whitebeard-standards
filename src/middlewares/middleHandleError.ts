/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-params */

import { NextFunction, Request, Response } from "express";
import { HttpError as OpenApiHttpError } from "express-openapi-validator/dist/framework/types";

import { Logger } from "traceability";

export const middlewareHandleError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof OpenApiHttpError) {
    if (err.status === 500) {
      Logger.error(JSON.stringify(err));
    }
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof Error) {
    Logger.error(
      JSON.stringify({
        eventName: "server.error",
        message: err.message,
        stack: err.stack,
      })
    );
  }

  return res
    .status(500)
    .json({ message: "Ops! Unexpected error 🚩, please contact tech team!" });
};

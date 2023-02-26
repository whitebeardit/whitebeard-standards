import { Application } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import * as swaggerUI from 'swagger-ui-express';
import { loadDocumentSync } from './loadDocumentsSync';

import { middlewareHandleError } from './middleHandleError';

export const swaggerAppCustomizer = (
  app: Application,
  destinationFile: string,
) => {
  const swaggerDoc = loadDocumentSync(destinationFile);
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
};

export const validationAppCustomizer = (app: Application) => {
  app.use(middlewareHandleError);
};

export const validatorMiddleware: any = (fileDestination: string) =>
  OpenApiValidator.middleware({
    apiSpec: fileDestination,
    validateRequests: true,
    validateResponses: true,
    validateFormats: 'full',
  });

export * from './cache.middleware';
export * from './timeout.middleware';

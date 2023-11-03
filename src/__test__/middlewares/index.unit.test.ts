import * as loadDocumentSyncModule from '../../middlewares/loadDocumentsSync';
import {
  swaggerAppCustomizer,
  validationAppCustomizer,
  validatorMiddleware,
} from '../../middlewares';
import * as OpenApiValidator from 'express-openapi-validator';

jest.mock('express-openapi-validator');

describe('Middlewares', () => {
  const app = {
    use: jest.fn(),
    get: jest.fn(),
  };

  describe('validationAppCustomizer', () => {
    it('should receive express app and use once', () => {
      validationAppCustomizer(app as any);
      expect(app.use).toHaveBeenCalled();
      expect(app.use).toHaveBeenCalledTimes(1);
    });
  });
  describe('swaggerAppCustomizer', () => {
    it('should receive express app and destinationfile and configure the docs page', () => {
      const spy = jest.spyOn(loadDocumentSyncModule, 'loadDocumentSync');
      spy.mockReturnValue('mocked');

      swaggerAppCustomizer(app as any, 'mocked');

      expect(app.use).toHaveBeenCalled();
      expect(app.use).toHaveBeenCalledTimes(1);
    });
  });
  describe('validatorMiddleware', () => {
    it('should receive a filePath and return an execution about the OpenAPIValidator with this configuration', () => {
      const openAPIValidatorMiddlewareSpy = jest.spyOn(
        OpenApiValidator,
        'middleware',
      );

      validatorMiddleware('PATH_TO_FILE');
      expect(openAPIValidatorMiddlewareSpy).toHaveBeenCalledWith({
        apiSpec: 'PATH_TO_FILE',
        validateRequests: true,
        validateResponses: true,
      });
      expect(openAPIValidatorMiddlewareSpy).toHaveBeenCalledTimes(1);
    });
  });
});

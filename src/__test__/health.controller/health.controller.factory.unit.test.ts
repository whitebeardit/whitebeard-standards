import { HealthControllerFactory } from '../../controllers/health.controller.factory';
import { HealthController } from '../../controllers/health.controller';
import { IController } from '../../controllers';

let result: IController;

describe('Health controller factory', () => {
  beforeEach(() => {
    result = HealthControllerFactory.create({
      notConfiguredEnvs: [],
      name: '__TEST__',
      version: '0',
      port: 0,
    });
  });

  it('should return a new Health Controller instance', async () => {
    expect(result instanceof HealthController).toEqual(true);
  });

  it('should return the routes quantity created of Health', async () => {
    expect(result.getRoutes().stack.length).toBeGreaterThan(0);
  });
});

import express, { Application, Request, Response } from 'express';
import request from 'supertest';
import { timeoutMiddleware } from '../../middlewares';

describe('timeoutMiddleware - Integration tests', () => {
  const TIMEOUT_SECONDS = 100;
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(timeoutMiddleware(TIMEOUT_SECONDS));
  });

  it(`
    should return 503 if timeout
    status code: 503
    route: POST /test-timeout
  `, async () => {
    app.post('/test-timeout', async (req: Request, res: Response) => {
      await new Promise((r) => setTimeout(r, TIMEOUT_SECONDS + 50));
      // this validation is required to avoid test to send headers again
      // only necessary for tests
      if (req.complete) return;
      res.send('Response was sent');
    });

    const response = await request(app).post('/test-timeout').send({
      test: 'test',
    });

    expect(response.statusCode).toEqual(503);
  });

  it(`
    should return 200 if timeout doesnt occur
    status code: 200
    route: GET /test-timeout
  `, async () => {
    app.post('/test-timeout', (req, res) => {
      res.send('Response was sent');
    });
    const response = await request(app).post('/test-timeout').send();

    expect(response.statusCode).toEqual(200);
  });
});

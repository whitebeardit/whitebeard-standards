import express, { Request, Response, Router } from 'express';
import { IController } from '.';

export class HealthController implements IController {
  private router: Router = express.Router();

  private readonly notConfiguredEnvs: string[];

  private readonly health: boolean;

  private readonly name: string;

  private readonly version: string;

  private readonly port: number;

  constructor({
    notConfiguredEnvs,
    name,
    version,
    port,
  }: {
    notConfiguredEnvs: string[];
    name: string;
    version: string;
    port: number;
  }) {
    this.initRoutes();
    this.notConfiguredEnvs = notConfiguredEnvs;
    this.health = true;
    this.name = name;
    this.version = version;
    this.port = port;
  }

  public initRoutes() {
    this.router.get('/health', this.getHealth);
  }

  public getRoutes(): Router {
    return this.router;
  }

  getHealth = async (req: Request, res: Response) => {
    res.send({
      notConfiguredEnvs: this.notConfiguredEnvs,
      health: this.health,
      name: this.name,
      version: this.version,
      port: this.port,
    });
  };
}

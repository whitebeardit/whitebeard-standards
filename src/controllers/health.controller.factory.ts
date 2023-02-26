import { HealthController, IController } from ".";

export class HealthControllerFactory {
  static create({
    notConfiguredEnvs,
    name,
    version,
    port,
  }: {
    notConfiguredEnvs: string[];
    name: string;
    version: string;
    port: number;
  }): IController {
    return new HealthController({
      notConfiguredEnvs,
      name,
      version,
      port,
    });
  }
}

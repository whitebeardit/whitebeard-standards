export interface IParamsCreateAnalyticProducer {
  SERVICE_NAME: string;
  KAFKA_USERNAME: string;
  KAFKA_PASSWORD: string;
  KAFKA_BROKERS: string[];
  KAFKA_LOGLEVEL: number;
}

export interface IParamsCreateDelayedProducer {
  SERVICE_NAME: string;
  KAFKA_USERNAME: string;
  KAFKA_PASSWORD: string;
  KAFKA_BROKERS: string[];
  KAFKA_LOGLEVEL: number;
}
export interface IParamsCreateAnalytic {
  event: string;
  payload: any;
}

export interface IAnalyticProducer {
  createAnalytic(params: IParamsCreateAnalytic): Promise<void>;
}

export interface IDelayMessageProducer {
  createDelayedMessage(params: any): Promise<void>;
}

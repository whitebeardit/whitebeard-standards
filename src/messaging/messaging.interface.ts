import { Channel } from 'amqplib';
import { IHeaders, KafkaConfig } from 'kafkajs';

export interface IMessagingRabbitMq {
  start(): Promise<boolean>;
  close(): Promise<boolean>;
  createChannel(): Promise<Channel>;
}

export interface IConsumeFunction {
  (params: {
    message: any;
    key?: Object;
    heartbeat?: () => Promise<void>;
    topic?: string;
    partition?: number;
    headers?: IHeaders;
  }): Promise<void> | void;
}
export interface IParamsConsumeKafka {
  topic: string;
  func: IConsumeFunction;
  fromBeginning?: boolean;
}

export interface IConsumer {
  consume(paramsConsumerKafka: IParamsConsumeKafka): Promise<void>;
  shutdown(): Promise<void>;
}

export interface IParamsProduce {
  topic: string;
  message: Object;
  key?: string;
  headers?: IHeaders;
}

export interface IParamsProduceMultipleMessages {
  topic: string;
  messages: Array<Object>;
  key?: string;
  headers?: IHeaders;
}

export interface IProducer {
  produce(paramsProducerKafka: IParamsProduce): Promise<void>;
  produceMultipleMessages(
    paramsProducerKafka: IParamsProduceMultipleMessages,
  ): Promise<void>;
}

export interface ICreateKafkaParams extends KafkaConfig {
  serviceName: string;
  username: string;
  password: string;
  brokers: Array<string>;
  logLevel: number;
}

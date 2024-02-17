import { IHeaders, Kafka, Producer, ProducerConfig, logLevel } from 'kafkajs';
import { ContextAsyncHooks, Logger } from 'traceability';
import {
  ICreateKafkaParams,
  IParamsProduce,
  IParamsProduceMultipleMessages,
  IProducer,
} from '../../messaging.interface';
import { randomUUID } from 'crypto';
import { createLoggerKafkaJs } from '../kafka.helpers';

export class KafkaProducer implements IProducer {
  private static instance: KafkaProducer | null = null;

  private readonly producer?: Producer;

  constructor(
    {
      logLevel: levelLogging,
      serviceName,
      brokers,
      password,
      username,
    }: ICreateKafkaParams,
    private readonly producerConfig: ProducerConfig,
  ) {
    const kafkaInstance = new Kafka({
      logLevel: levelLogging || logLevel.ERROR,
      clientId: serviceName,
      brokers,
      ssl: true,
      logCreator: createLoggerKafkaJs,
      sasl: {
        mechanism: 'plain',
        password,
        username,
      },
      retry: {
        initialRetryTime: 100,
        retries: 10,
      },
      connectionTimeout: 45000,
    });
    this.producer = kafkaInstance.producer(this.producerConfig);
    this.registerListener();
    this.producer?.connect();
  }

  public static getInstance(
    params: ICreateKafkaParams,
    config: ProducerConfig,
  ): KafkaProducer {
    if (!KafkaProducer.instance) {
      KafkaProducer.instance = new KafkaProducer(params, config);
    }
    return KafkaProducer.instance;
  }

  async produce({
    topic,
    message,
    key,
    headers,
  }: IParamsProduce): Promise<void> {
    const value = JSON.stringify(message);
    const { cid } = ContextAsyncHooks.getTrackId();
    headers = { cid, ...headers };
    await this.send(topic, [{ key: key || randomUUID(), value, headers }]);
  }

  async produceMultipleMessages({
    topic,
    messages,
    key,
    headers,
  }: IParamsProduceMultipleMessages): Promise<void> {
    const { cid } = ContextAsyncHooks.getTrackId();
    const messagesToSend = messages.map((eachMessage) => ({
      key: key || randomUUID(),
      value: JSON.stringify(eachMessage),
      headers: { cid, ...headers },
    }));
    await this.send(topic, messagesToSend);
  }

  private registerListener() {
    this.producer?.on(this.producer.events.CONNECT, () => {
      Logger.info('Producer Connected', {
        eventName: `KafkaProducer.registerListener.CONNECT`,
      });
    });
    this.producer?.on(this.producer.events.DISCONNECT, () => {
      Logger.warn('Producer Disconnected', {
        eventName: `KafkaProducer.registerListener.DISCONNECT`,
      });
    });

    this.producer?.on(this.producer.events.REQUEST_TIMEOUT, (data) => {
      Logger.warn('Producer Timeout', {
        eventName: `KafkaProducer.registerListener.REQUEST_TIMEOUT`,
        eventData: data,
      });
    });
  }

  private async send(
    topic: string,
    messages: Array<{
      key: string;
      value: string;
      headers?: IHeaders;
    }>,
  ) {
    await this.producer?.send({
      topic,
      messages,
    });
  }

  convertMessagesValuesToString(
    messages: Array<{ key: string; value: any }>,
  ): Array<{ key: string; value: string }> {
    return messages.map(({ key, value }) => ({
      key,
      value: JSON.stringify(value),
    }));
  }

  public async shutdown(): Promise<void> {
    await this.producer?.disconnect();
  }
}

import { IHeaders, Kafka, Producer, ProducerConfig } from 'kafkajs';
import { ContextAsyncHooks, Logger } from 'traceability';
import {
  IParamsProduce,
  IParamsProduceMultipleMessages,
  IProducer,
} from '../../messaging.interface';
const { randomUUID } = require('crypto');

export class KafkaProducer implements IProducer {
  private producer?: Producer;

  constructor(
    private readonly kafkaInstance: Kafka,
    private readonly producerConfig: ProducerConfig,
  ) {
    this.start();
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

  public async start(): Promise<void> {
    this.producer = this.kafkaInstance.producer(this.producerConfig);
    await this.producer?.connect();
    this.registerListener();
  }

  public async shutdown(): Promise<void> {
    await this.producer?.disconnect();
  }
}

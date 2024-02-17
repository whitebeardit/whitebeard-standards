import { Consumer, ConsumerConfig, Kafka } from 'kafkajs';
import { ContextAsyncHooks, Logger } from 'traceability';
const { randomUUID } = require('crypto');
import { IConsumer, IParamsConsumeKafka } from '../../messaging.interface';
import { IDelayMessageProducer } from '../../../producers';
import { ProcessEventsGracefulShutdownEnum } from '../../../graceful-shutdown';

export class KafkaConsumer implements IConsumer {
  private consumer?: Consumer;

  constructor(
    private readonly kafkaInstance: Kafka,
    private readonly consumerConfig: ConsumerConfig,
    private readonly delayProducer?: IDelayMessageProducer,
  ) {}

  async consume({
    topic,
    func,
    fromBeginning,
  }: IParamsConsumeKafka): Promise<void> {
    await this.start();
    await this.consumer?.subscribe({
      topic,
      fromBeginning,
    });

    await this.consumer?.run({
      eachMessage: async ({ message: messageBuffer, heartbeat, partition }) => {
        const key = messageBuffer.key!.toString();
        const value = this.parseBufferToObject(messageBuffer.value!);
        const headers = messageBuffer.headers;

        try {
          const cid = headers?.cid?.toString() || randomUUID();
          ContextAsyncHooks.setContext({ cid });
          await func({
            message: value,
            key,
            heartbeat,
            topic,
            partition,
            headers,
          });
        } catch (error) {
          Logger.error(error);

          if (!this.delayProducer) {
            throw error;
          }

          Logger.warn('Sending to delay service');

          const delayedMessage = {
            header: {
              messageId: String(key),
              applicationTopic: topic,
              applicationGroupId: this.consumerConfig.groupId,
            },
            payload: value,
          };

          await this.delayProducer.createDelayedMessage(delayedMessage);
        }
      },
    });

    this.consumer?.on('consumer.crash', () => {
      process.kill(process.pid, ProcessEventsGracefulShutdownEnum.SIGTERM);
    });
  }

  async start(): Promise<void> {
    this.consumer = this.kafkaInstance.consumer(this.consumerConfig);
    this.registerListener();
    await this.consumer?.connect();
  }

  parseBufferToObject(message: Buffer) {
    return JSON.parse(message.toString());
  }

  async shutdown(): Promise<void> {
    await this.consumer?.disconnect();
  }

  private registerListener() {
    this.consumer?.on(this.consumer.events.CONNECT, () => {
      Logger.info('Consumer Connected', {
        eventName: `KafkaConsumer.registerListener.CONNECT`,
      });
    });
    this.consumer?.on(this.consumer.events.DISCONNECT, () => {
      Logger.warn('Consumer Disconnected', {
        eventName: `KafkaConsumer.registerListener.DISCONNECT`,
      });
    });

    this.consumer?.on(this.consumer.events.REQUEST_TIMEOUT, (data) => {
      Logger.warn('Consumer Timeout', {
        eventName: `KafkaConsumer.registerListener.REQUEST_TIMEOUT`,
        eventData: data,
      });
    });
  }
}

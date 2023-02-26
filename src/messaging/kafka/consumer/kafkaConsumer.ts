import { Consumer, ConsumerConfig, Kafka } from 'kafkajs';
import { ContextAsyncHooks } from 'traceability';
import {randomUUID} from 'crypto';
import { IConsumer, IParamsConsumeKafka } from '../../messaging.interface';

export class KafkaConsumer implements IConsumer {
  private consumer?: Consumer;

  constructor(
    private readonly kafkaInstance: Kafka,
    private readonly consumerConfig: ConsumerConfig,
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
      },
    });
  }

  async start(): Promise<void> {
    this.consumer = this.kafkaInstance.consumer(this.consumerConfig);
    await this.consumer?.connect();
  }

  parseBufferToObject(message: Buffer) {
    return JSON.parse(message.toString());
  }

  async shutdown(): Promise<void> {
    await this.consumer?.disconnect();
  }
}

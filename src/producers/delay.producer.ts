import { ContextAsyncHooks } from 'traceability';
import { serviceLogErrorHandler } from '../helpers';
import { IProducer } from './../messaging';
import { KafkaProducerFactory } from './../messaging/kafka/producer/kafkaProducerFactory';
import {
  IDelayMessageProducer,
  IParamsCreateDelayedProducer,
} from './producers.interface';

export class DelayMessageProducerKafka implements IDelayMessageProducer {
  private readonly kafkaProducer: IProducer;

  private readonly DELAYED_MESSAGE_SCHEDULE = 'DELAYED_MESSAGE_SCHEDULE';

  constructor(params: IParamsCreateDelayedProducer) {
    this.kafkaProducer = KafkaProducerFactory.create({
      serviceName: params.SERVICE_NAME,
      username: params.KAFKA_USERNAME,
      password: params.KAFKA_PASSWORD,
      brokers: params.KAFKA_BROKERS,
      logLevel: params.KAFKA_LOGLEVEL,
    });
  }

  async createDelayedMessage(params: any): Promise<void> {
    try {
      const { cid } = ContextAsyncHooks.getTrackId();
      this.kafkaProducer.produce({
        topic: this.DELAYED_MESSAGE_SCHEDULE,
        message: params,
        headers: { cid },
      });
    } catch (error: any) {
      serviceLogErrorHandler(error, {
        eventName: 'DelayMessageProducerKafka.createDelayedMessage',
      });
    }
  }
}

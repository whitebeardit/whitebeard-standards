import { Kafka, logLevel } from 'kafkajs';
import { ICreateKafkaParams } from '../../messaging.interface';
import { createLoggerKafkaJs } from '../kafka.helpers';

export class KafkaConnectionConsumerSingleton extends Kafka {
  private static kafkaInstance: KafkaConnectionConsumerSingleton;

  private constructor({
    serviceName,
    username,
    password,
    brokers,
    logLevel: levelLogging,
  }: ICreateKafkaParams) {
    super({
      logLevel: levelLogging || logLevel.ERROR,
      clientId: serviceName,
      logCreator: createLoggerKafkaJs,
      brokers,
      ssl: true,
      sasl: {
        mechanism: 'plain',
        password,
        username,
      },
      connectionTimeout: 45000,
    });
  }

  static getKafkaInstance(kafkaParams: ICreateKafkaParams) {
    if (!KafkaConnectionConsumerSingleton.kafkaInstance) {
      KafkaConnectionConsumerSingleton.kafkaInstance =
        new KafkaConnectionConsumerSingleton(kafkaParams);
    }

    return KafkaConnectionConsumerSingleton.kafkaInstance;
  }
}

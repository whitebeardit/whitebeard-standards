import { Kafka, logLevel } from 'kafkajs';
import { ICreateKafkaParams } from '../../messaging.interface';
import { createLoggerKafkaJs } from '../kafka.helpers';

export class KafkaConnectionProducerSingleton extends Kafka {
  private static kafkaInstance: KafkaConnectionProducerSingleton;

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
      brokers,
      ssl: true,
      logCreator: createLoggerKafkaJs,
      sasl: {
        mechanism: 'plain',
        password,
        username,
      },
      connectionTimeout: 45000,
    });
  }

  static getKafkaInstance(kafkaParams: ICreateKafkaParams) {
    if (!KafkaConnectionProducerSingleton.kafkaInstance) {
      KafkaConnectionProducerSingleton.kafkaInstance =
        new KafkaConnectionProducerSingleton(kafkaParams);
    }

    return KafkaConnectionProducerSingleton.kafkaInstance;
  }
}

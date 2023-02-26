import { ConsumerConfig } from 'kafkajs';
import { ICreateKafkaParams } from '../../messaging.interface';
import { KafkaConnectionConsumerSingleton } from './kafkaConnectionConsumerSingleton';
import { KafkaConsumer } from './kafkaConsumer';

export class KafkaConsumerFactory {
  static create(
    kafkaparams: ICreateKafkaParams,
    consumerConfig?: ConsumerConfig,
  ) {
    const kafkaInstance =
      KafkaConnectionConsumerSingleton.getKafkaInstance(kafkaparams);

    const defaultConfigConsumer = {
      groupId: kafkaparams.serviceName,
      allowAutoTopicCreation: true,
      retry: {
        retries: 3,
      },
    };
    return new KafkaConsumer(kafkaInstance, {
      ...defaultConfigConsumer,
      ...consumerConfig,
    });
  }
}

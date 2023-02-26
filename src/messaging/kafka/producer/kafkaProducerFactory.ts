import { ProducerConfig } from 'kafkajs';
import { ICreateKafkaParams } from '../../messaging.interface';
import { KafkaConnectionProducerSingleton } from './kafkaConnectionProducerSingleton';

import { KafkaProducer } from './kafkaProducer';

export class KafkaProducerFactory {
  static create(
    kafkaparams: ICreateKafkaParams,
    producerConfig?: ProducerConfig,
  ) {
    const kafkaInstance =
      KafkaConnectionProducerSingleton.getKafkaInstance(kafkaparams);

    const defaultConfigProducer = {
      allowAutoTopicCreation: false,
      transactionTimeout: 30000,
      retry: {
        retries: 3,
      },
    };

    return new KafkaProducer(kafkaInstance, {
      ...defaultConfigProducer,
      ...producerConfig,
    });
  }
}

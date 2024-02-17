import { ProducerConfig } from 'kafkajs';
import { ICreateKafkaParams } from '../../messaging.interface';

import { KafkaProducer } from './kafkaProducer';

export class KafkaProducerFactory {
  static create(
    kafkaparams: ICreateKafkaParams,
    producerConfig?: ProducerConfig,
  ) {
    const defaultConfigProducer: ProducerConfig = {
      allowAutoTopicCreation: false,
      transactionTimeout: 30000,
      retry: {
        retries: 10,
        initialRetryTime: 110,
      },
    };

    return KafkaProducer.getInstance(kafkaparams, {
      ...defaultConfigProducer,
      ...producerConfig,
    });
  }
}

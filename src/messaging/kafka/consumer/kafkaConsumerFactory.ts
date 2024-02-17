import { ConsumerConfig } from 'kafkajs';
import { ICreateKafkaParams } from '../../messaging.interface';
import { KafkaConnectionConsumerSingleton } from './kafkaConnectionConsumerSingleton';
import { KafkaConsumer } from './kafkaConsumer';
import { DelayMessageProducerKafka } from '../../../producers/delay.producer';

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
        retries: 10,
      },
    };

    const delayProducer = new DelayMessageProducerKafka({
      SERVICE_NAME: kafkaparams.serviceName,
      KAFKA_USERNAME: kafkaparams.username,
      KAFKA_PASSWORD: kafkaparams.password,
      KAFKA_BROKERS: kafkaparams.brokers,
      KAFKA_LOGLEVEL: kafkaparams.logLevel,
    });
    return new KafkaConsumer(
      kafkaInstance,
      {
        ...defaultConfigConsumer,
        ...consumerConfig,
      },
      delayProducer,
    );
  }
}

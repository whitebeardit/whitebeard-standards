import 'kafkajs';
import {
  KafkaProducerFactory,
  KafkaConnectionProducerSingleton,
} from '../../../messaging/kafka';
import { KafkaProducer } from '../../../messaging/kafka/producer/kafkaProducer';
import { ICreateKafkaParams } from '../../../messaging/messaging.interface';

jest.mock('kafkajs');

describe('KafkaProducerFactory tests', () => {
  let kafkaProducer: KafkaProducer;
  const mockKafkaParams: ICreateKafkaParams = {
    serviceName: '__TEST__',
    username: 'test',
    password: 'testtest',
    brokers: ['localhost:9092'],
    logLevel: 0,
    retry: {
      restartOnFailure: async () => false,
    },
  };
  beforeAll(() => {
    const defaultConfigProducer = {
      allowAutoTopicCreation: false,
      transactionTimeout: 30000,
    };
    const kafkaInstance =
      KafkaConnectionProducerSingleton.getKafkaInstance(mockKafkaParams);
    kafkaProducer = new KafkaProducer(kafkaInstance, defaultConfigProducer);
  });
  afterAll(async () => {
    if (kafkaProducer) {
      await kafkaProducer.shutdown();
    }
  });

  it('should create a instance of KafkaProducer', async () => {
    const getKafkaInstanceSpy = jest.spyOn(
      KafkaConnectionProducerSingleton,
      'getKafkaInstance',
    );
    const kafkaProducer = KafkaProducerFactory.create(mockKafkaParams);

    expect(getKafkaInstanceSpy).toBeCalled();
    expect(kafkaProducer instanceof KafkaProducer).toBeTruthy();
  });

  it('should produce a new message', async () => {
    const TOPIC_MOCK = '__TEST__';

    //@ts-ignore
    const startKafkaProducerSpy = jest.spyOn(kafkaProducer, 'send');

    await kafkaProducer.produce({
      topic: TOPIC_MOCK,
      message: '__TEST__',
      key: '__TEST__',
    });
    expect(startKafkaProducerSpy).toBeCalled();
  });

  it('should produce a new multiple message', async () => {
    const TOPIC_MOCK = '__TEST__';

    //@ts-ignore
    const startKafkaProducerSpy = jest.spyOn(kafkaProducer, 'send');

    await kafkaProducer.produceMultipleMessages({
      topic: TOPIC_MOCK,
      messages: ['__TEST1__', '__TEST2__'],
      key: '__TEST__',
    });
    expect(startKafkaProducerSpy).toBeCalled();
  });

  it('should test function of help to convert values of string', () => {
    const MESSAGES_MOCK = [{ key: '__TEST__', value: { test: 'test' } }];
    const result = kafkaProducer.convertMessagesValuesToString(MESSAGES_MOCK);
    expect(result).toEqual([{ key: '__TEST__', value: '{"test":"test"}' }]);
  });
});

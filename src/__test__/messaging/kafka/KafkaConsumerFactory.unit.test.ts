import 'kafkajs';
import {
  KafkaConnectionConsumerSingleton,
  KafkaConsumerFactory,
} from '../../../messaging/kafka';
import { KafkaConsumer } from '../../../messaging/kafka/consumer/kafkaConsumer';
import { ICreateKafkaParams } from '../../../messaging/messaging.interface';

jest.mock('kafkajs');

describe('KafkaConsumerFactory tests', () => {
  let kafkaConsumer: KafkaConsumer;
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
    const defaultConfigConsumer = {
      groupId: mockKafkaParams.serviceName,
      allowAutoTopicCreation: true,
      retry: {
        retries: 0,
      },
    };
    const kafkaInstance =
      KafkaConnectionConsumerSingleton.getKafkaInstance(mockKafkaParams);
    kafkaConsumer = new KafkaConsumer(kafkaInstance, defaultConfigConsumer);
  });
  afterAll(async () => {
    if (kafkaConsumer) {
      await kafkaConsumer.shutdown();
    }
  });

  it('should create a instance of KafkaConsumer', async () => {
    const getKafkaInstanceSpy = jest.spyOn(
      KafkaConnectionConsumerSingleton,
      'getKafkaInstance',
    );
    const kafkaConsumer = KafkaConsumerFactory.create(mockKafkaParams);

    expect(getKafkaInstanceSpy).toBeCalled();
    expect(kafkaConsumer instanceof KafkaConsumer).toBeTruthy();
  });

  it('should consume a new message', async () => {
    const TOPIC_MOCK = '__TEST__';
    const MESSAGES_MOCK = [{ key: '__TEST__', value: '__TEST__' }];

    const startKafkaConsumerSpy = jest.spyOn(kafkaConsumer, 'start');

    await kafkaConsumer.consume({
      topic: TOPIC_MOCK,
      func: () => {
        expect(startKafkaConsumerSpy).toBeCalled();
      },
    });
    expect(startKafkaConsumerSpy).toBeCalled();
  });

  it('should test function of help to convert values of string', () => {
    const MESSAGES_MOCK = [{ key: '__TEST__', value: "{ test: 'test' }" }];
    const messageBuffer = Buffer.from(JSON.stringify(MESSAGES_MOCK));
    const result = kafkaConsumer.parseBufferToObject(messageBuffer);
    expect(result).toEqual(MESSAGES_MOCK);
  });
});

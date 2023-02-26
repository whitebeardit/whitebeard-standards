import 'kafkajs';
import { toWinstonLogLevel } from './../../../messaging/kafka/kafka.helpers';

jest.mock('kafkajs');

describe('KafkaHelpers tests', () => {
  it('should validate adapter log level from kafka to winston', () => {
    const valuesToTest = [
      {
        expectation: 'error',
        assertion: 1,
      },
      {
        expectation: 'error',
        assertion: 0,
      },
      {
        expectation: 'warn',
        assertion: 2,
      },
      {
        expectation: 'info',
        assertion: 4,
      },
      {
        expectation: 'debug',
        assertion: 5,
      },
    ];

    valuesToTest.forEach((element) => {
      expect(toWinstonLogLevel(element.assertion)).toBe(element.expectation);
    });
  });
});

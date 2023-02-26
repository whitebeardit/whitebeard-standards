import { Logger } from 'traceability';
import { MessagingRabbitMqFactory } from '../../messaging/messaging.factory';
import { MessagingRabbitMq } from '../../messaging/messaging.rabbitmq';

const loggerSpy = jest
  .spyOn(Logger, 'error')
  .mockReturnValue({} as unknown as typeof Logger);

describe('Messaging factory RabbitMq', () => {
  it('should return a new datacache instance', async () => {
    const AMQP_URL = '__TEST__';
    const result = MessagingRabbitMqFactory.create(AMQP_URL);
    expect(result instanceof MessagingRabbitMq).toEqual(true);
  });
});

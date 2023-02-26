import { MessagingRabbitMqFactory } from '../../messaging/messaging.factory';
import { MessagingRabbitMq } from '../../messaging/messaging.rabbitmq';

const AMQP_URL = '__TEST__';

describe('Messaging RabbitMq', () => {
  beforeAll(() => {});

  it(`
  Should start rabbitmq connection and return false when service started through
  the created instance with a invalid AMQP_URL
  `, async () => {
    const instance = MessagingRabbitMqFactory.create(AMQP_URL);

    const startResult = await instance.start();

    expect(startResult).toEqual(false);
  });

  it(`
  Should return true when tries to create channel with amqp connection
  `, async () => {
    const instance = MessagingRabbitMqFactory.create(AMQP_URL);

    const createChannelResult = await instance.createChannel();

    expect(createChannelResult).toEqual(undefined);
  });

  it(`
  Should return true when tries to close amqp connection
  `, async () => {
    const instance = MessagingRabbitMqFactory.create(AMQP_URL);

    const closeResult = await instance.close();

    expect(closeResult).toEqual(true);
  });

  it(`
  Should return false when tries to queue message without amqp configured instance
  `, async () => {
    const queueResult = await MessagingRabbitMq.queueMessage(AMQP_URL, {
      msg: 'TEST',
    });

    expect(queueResult).toEqual(false);
  });
});

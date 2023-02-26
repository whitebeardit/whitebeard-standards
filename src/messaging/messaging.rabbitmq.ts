import { connect, Connection, Channel } from 'amqplib';

import { Logger } from 'traceability';
import { IMessagingRabbitMq } from './messaging.interface';

export class MessagingRabbitMq implements IMessagingRabbitMq {
  private readonly AMQP_URI: string;

  private static connection: Connection | undefined;

  private static channel: Channel;

  constructor(AMQP_URI: string) {
    this.AMQP_URI = AMQP_URI;
  }

  async start(): Promise<boolean> {
    try {
      if (!MessagingRabbitMq.connection) {
        MessagingRabbitMq.connection = await connect(this.AMQP_URI);

        MessagingRabbitMq.connection.on('error', (err: any) => {
          if (err.message !== 'Connection closing') {
            Logger.error(err.message, {
              eventName: 'RabbitMq.start',
              eventData: { AMQP_URL: this.AMQP_URI },
            });
          }
        });

        MessagingRabbitMq.connection.on('close', (message: string) => {
          Logger.warn(`${message}`);
          Logger.warn(`reconnecting ${this.AMQP_URI}`);
          setTimeout(this.start, 1000);
        });

        Logger.info('Connection Stablished - RabbitMq');
      }

      this.createChannel();

      return true;
    } catch (err: any) {
      Logger.error(err.message, {
        eventName: 'RabbitMq.start',
        eventData: { AMQP_URL: this.AMQP_URI },
      });

      return false;
    }
  }

  async close(): Promise<boolean> {
    try {
      if (MessagingRabbitMq.connection) {
        await MessagingRabbitMq.connection.close();

        MessagingRabbitMq.connection.on('close', () => {
          Logger.info('Connection Closed - RabbitMq');
        });

        MessagingRabbitMq.connection.on('error', (err) => {
          Logger.error(
            `Error to close connection - RabbitMq: Error: ${err.message}`,
          );
        });
      }

      return true;
    } catch (err: any) {
      Logger.error(err.message, {
        eventName: 'RabbitMq.close',
        eventData: { AMQP_URL: this.AMQP_URI },
      });

      return false;
    }
  }

  async createChannel(): Promise<Channel> {
    try {
      if (MessagingRabbitMq.connection && !MessagingRabbitMq.channel) {
        MessagingRabbitMq.channel =
          await MessagingRabbitMq.connection.createChannel();
      }

      return MessagingRabbitMq.channel;
    } catch (err: any) {
      Logger.error(err.message, {
        eventName: 'RabbitMq.createChannel',
        eventData: { AMQP_URL: this.AMQP_URI },
      });

      throw err;
    }
  }

  static async queueMessage(queueName: string, params: any): Promise<boolean> {
    try {
      await MessagingRabbitMq.channel.assertQueue(queueName, {
        durable: true,
      });

      const messageBuffer = Buffer.from(JSON.stringify(params));

      MessagingRabbitMq.channel.sendToQueue(queueName, messageBuffer);

      return true;
    } catch (ex: any) {
      Logger.error(ex.message, {
        eventName: 'RabbitMq.queueMessage',
      });

      return false;
    }
  }
}

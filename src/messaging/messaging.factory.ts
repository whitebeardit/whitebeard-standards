import { IMessagingRabbitMq } from './messaging.interface';
import { MessagingRabbitMq } from './messaging.rabbitmq';

export class MessagingRabbitMqFactory {
  static create(uri: string): IMessagingRabbitMq {
    return new MessagingRabbitMq(uri);
  }
}

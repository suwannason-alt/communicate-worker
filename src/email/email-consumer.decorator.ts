import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import * as dotenv from 'dotenv';

export function emailConsumerDecorator(): ReturnType<typeof RabbitSubscribe> {
  dotenv.config();
  const exchange = process.env.RABBITMQ_EXCHANGE;

  return RabbitSubscribe({
    exchange,
    routingKey: 'send.email',
    queue: 'email-queue',
    queueOptions: { durable: true },
  });
}

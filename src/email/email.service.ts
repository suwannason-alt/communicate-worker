import { Injectable } from '@nestjs/common';
import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class EmailService {
  @RabbitSubscribe({
    exchange: 'communicate-exchange',
    routingKey: 'send.email',
    queue: 'email-queue',
    queueOptions: { durable: true },
  })
  handleEmail(data: any) {
    console.log('Received email data:', data);
    return new Nack();
  }
}

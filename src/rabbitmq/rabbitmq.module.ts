import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const protocol = configService.get<string>('RABBITMQ_PROTOCOL');
        const username = configService.get<string>('RABBITMQ_USERNAME');
        const password = encodeURIComponent(
          configService.get<string>('RABBITMQ_PASSWORD') || '',
        );
        const host = configService.get<string>('RABBITMQ_HOST');
        const port = configService.get<number>('RABBITMQ_PORT');
        const url = `${protocol}://${username}:${password}@${host}:${port}`;
        return {
          exchanges: [
            {
              name: 'communicate-exchange',
              type: 'topic',
            },
          ],
          uri: url,
        };
      },
    }),
  ],
})
export class RabbitmqModule {}

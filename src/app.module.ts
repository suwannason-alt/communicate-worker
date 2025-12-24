import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { EmailModule } from './email/email.module';
// import { LineModule } from './line/line.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitmqModule,
    EmailModule,
    // LineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

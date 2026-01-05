/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SaveAppLog } from './utils/logger';
import 'dotenv/config';

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule, {
    logger: new SaveAppLog(AppModule.name),
  });
}
bootstrap();

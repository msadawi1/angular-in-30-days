import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { createValidationPipe } from './common/validation.pipe';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: config.getOrThrow<string>('corsOrigin'),
    allowedHeaders: ['Content-Type'],
  });

  const port = config.getOrThrow<number>('port');
  await app.listen(port);
  Logger.log(`Silah API listening on http://localhost:${port}/api`, 'Bootstrap');
}

void bootstrap();

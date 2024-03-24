import { exit } from 'node:process';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectDB } from './db';

async function bootstrap() {
  try {
    await connectDB('mongodb://192.168.0.73:27017/');
  } catch (e) {
    console.log('Ошибка подключения', e);
    exit(1);
  }
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

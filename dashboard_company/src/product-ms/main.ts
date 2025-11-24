import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ProductMsModule } from './product.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ProductMsModule, {
    transport: Transport.TCP,
    options: {
      port: 4002,
    },
  });

  await app.listen();
  console.log('🚀 Microservicio Product-MS escuchando en puerto 4002');
}

bootstrap();

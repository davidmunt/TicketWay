import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ProductCategoryMSModule } from './product-categoy.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(ProductCategoryMSModule, {
    transport: Transport.TCP,
    options: {
      port: 4003,
    },
  });

  await app.listen();
  console.log('🚀 Microservicio Product-Category-MS escuchando en puerto 4003');
}

bootstrap();

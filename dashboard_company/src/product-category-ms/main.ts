import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ProductCategoryMSModule } from './product-categoy.module';

import * as http from 'http';

async function bootstrap() {
  // 1️⃣ Microservicio TCP
  const app = await NestFactory.createMicroservice(ProductCategoryMSModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4003,
    },
  });

  await app.listen();
  console.log('🚀 Product-Category-MS (TCP) escuchando en puerto 4003');

  // 2️⃣ Healthcheck HTTP
  http
    .createServer((_, res) => {
      res.writeHead(200);
      res.end('ok');
    })
    .listen(4013, () => {
      console.log('❤️ Product-Category-MS healthcheck en puerto 4013');
    });
}

bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { Transport } from '@nestjs/microservices';
// import { ProductCategoryMSModule } from './product-categoy.module';

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice(ProductCategoryMSModule, {
//     transport: Transport.TCP,
//     options: {
//       host: '0.0.0.0',
//       port: 4003,
//     },
//   });

//   await app.listen();
//   console.log('🚀 Microservicio Product-Category-MS escuchando en puerto 4003');
// }

// bootstrap();

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ProductMsModule } from './product.module';
import * as http from 'http';

async function bootstrap() {
  // 1️⃣ Microservicio TCP
  const app = await NestFactory.createMicroservice(ProductMsModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4002,
    },
  });

  await app.listen();
  console.log('🚀 Product-MS (TCP) escuchando en puerto 4002');

  // 2️⃣ Healthcheck HTTP
  http
    .createServer((_, res) => {
      res.writeHead(200);
      res.end('ok');
    })
    .listen(4012, () => {
      console.log('❤️ Product-MS healthcheck en puerto 4012');
    });
}

bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { Transport } from '@nestjs/microservices';
// import { ProductMsModule } from './product.module';

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice(ProductMsModule, {
//     transport: Transport.TCP,
//     options: {
//       host: '0.0.0.0',
//       port: 4002,
//     },
//   });

//   await app.listen();
//   console.log('🚀 Microservicio Product-MS escuchando en puerto 4002');
// }

// bootstrap();

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { UserCompanyMsModule } from './user-company.module';
import * as http from 'http';

async function bootstrap() {
  // 1️⃣ Microservicio TCP (el de Nest)
  const app = await NestFactory.createMicroservice(UserCompanyMsModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4001,
    },
  });

  await app.listen();
  console.log('🚀 UserCompany MS (TCP) escuchando en 4001');

  // 2️⃣ Servidor HTTP SOLO para healthcheck
  http
    .createServer((_, res) => {
      res.writeHead(200);
      res.end('ok');
    })
    .listen(4011, () => {
      console.log('❤️ Healthcheck HTTP en puerto 4011');
    });
}

bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { Transport } from '@nestjs/microservices';
// import { UserCompanyMsModule } from './user-company.module';
// import * as http from 'http';

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice(UserCompanyMsModule, {
//     transport: Transport.TCP,
//     options: {
//       host: '0.0.0.0',
//       port: 4001,
//     },
//   });

//   await app.listen();
//   console.log('🚀 Microservicio UserCompany-MS escuchando en puerto 4001');
// }

// bootstrap();

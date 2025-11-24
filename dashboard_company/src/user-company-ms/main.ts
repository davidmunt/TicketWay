import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { UserCompanyMsModule } from './user-company.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UserCompanyMsModule, {
    transport: Transport.TCP,
    options: {
      port: 4001,
    },
  });

  await app.listen();
  console.log('🚀 Microservicio UserCompany-MS escuchando en puerto 4001');
}

bootstrap();

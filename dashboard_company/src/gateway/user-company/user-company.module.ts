import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserCompanyController } from './user-company.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_COMPANY_MS',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4001,
        },
      },
    ]),
  ],
  controllers: [UserCompanyController],
})
export class UserCompanyModule {}

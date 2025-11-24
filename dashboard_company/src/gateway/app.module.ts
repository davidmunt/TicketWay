import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserCompanyModule } from './user-company/user-company.module';

@Module({
  imports: [
    UserCompanyModule, // <--- IMPORTANTE

    ClientsModule.register([
      {
        name: 'USER_COMPANY_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 4001 },
      },
    ]),
  ],
})
export class AppModule {}

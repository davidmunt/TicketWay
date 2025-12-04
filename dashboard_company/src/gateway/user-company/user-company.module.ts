import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserCompanyController } from './user-company.controller';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtCustomModule } from '../../jwt/jwt.module';

@Module({
  imports: [
    PrismaModule,
    JwtCustomModule,
    ClientsModule.register([
      {
        name: 'USER_COMPANY_MS',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 4001 },
      },
    ]),
  ],
  controllers: [UserCompanyController],
})
export class UserCompanyModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        'user-company/data',
        'user-company/logout',
        'user-company/refresh',
      );
  }
}

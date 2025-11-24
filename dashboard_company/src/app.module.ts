import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserCompanyModule } from './gateway/user-company/user-company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserCompanyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

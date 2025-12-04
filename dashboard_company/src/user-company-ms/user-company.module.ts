import { Module } from '@nestjs/common';
import { UserCompanyMicroserviceController } from './user-company.microservice.controller';
import { UserCompanyService } from './user-company.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtCustomModule } from '../jwt/jwt.module';

@Module({
  imports: [PrismaModule, JwtCustomModule],
  controllers: [UserCompanyMicroserviceController],
  providers: [UserCompanyService],
})
export class UserCompanyMsModule {}

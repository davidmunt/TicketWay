import { Module } from '@nestjs/common';
import { UserCompanyService } from './user-company.service';
import { UserCompanyController } from './user-company.controller';

@Module({
  providers: [UserCompanyService],
  controllers: [UserCompanyController],
})
export class UserCompanyModule {}

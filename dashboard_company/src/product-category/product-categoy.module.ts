import { Module } from '@nestjs/common';
import { ProductCategoryService } from './product-categoy.service';
import { ProductCategoryController } from './product-categoy.controller';

@Module({
  providers: [ProductCategoryService],
  controllers: [ProductCategoryController],
})
export class UserCompanyModule {}

import { Module } from '@nestjs/common';
import { UserCompanyModule } from './user-company/user-company.module';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';

@Module({
  imports: [UserCompanyModule, ProductCategoryModule, ProductModule],
})
export class AppModule {}

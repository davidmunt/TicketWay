import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserCompanyModule } from './gateway/user-company/user-company.module';
import { ProductModule } from './gateway/product/product.module';
import { ProductCategoryModule } from './gateway/product-category/product-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserCompanyModule,
    ProductCategoryModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

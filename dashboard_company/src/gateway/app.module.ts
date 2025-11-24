import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserCompanyModule } from './user-company/user-company.module';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';

@Module({
  imports: [
    UserCompanyModule,
    ProductCategoryModule,
    ProductModule,

    ClientsModule.register([
      {
        name: 'USER_COMPANY_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 4001 },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 4002 },
      },
      {
        name: 'PRODUCT_CATEGORY_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 4003 },
      },
    ]),
  ],
})
export class AppModule {}

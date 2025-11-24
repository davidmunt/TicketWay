import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductCategoryController } from './product-category.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_CATEGORY_MS',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4003,
        },
      },
    ]),
  ],
  controllers: [ProductCategoryController],
})
export class ProductCategoryModule {}

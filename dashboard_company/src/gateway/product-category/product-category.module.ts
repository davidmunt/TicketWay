import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductCategoryController } from './product-category.controller';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtCustomModule } from '../../jwt/jwt.module';

@Module({
  imports: [
    PrismaModule,
    JwtCustomModule,
    ClientsModule.register([
      {
        name: 'PRODUCT_CATEGORY_MS',
        transport: Transport.TCP,
        options: {
          host: 'product_category_ms',
          port: 4003,
        },
      },
    ]),
  ],
  controllers: [ProductCategoryController],
})
export class ProductCategoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ProductCategoryController);
  }
}

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('product');
  }
}

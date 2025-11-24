import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductCategoryService } from './product-categoy.service';
import { ProductCategoryMicroserviceController } from './product-category.microservice.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProductCategoryService],
  controllers: [ProductCategoryMicroserviceController],
})
export class ProductCategoryMSModule {}

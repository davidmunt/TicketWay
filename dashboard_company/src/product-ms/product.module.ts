import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductMicroserviceController } from './product.microservice.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ProductService],
  controllers: [ProductMicroserviceController],
})
export class ProductMsModule {}

import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductController } from './product.controller';
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
        name: 'PRODUCT_MS',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4002,
        },
      },
    ]),
  ],
  controllers: [ProductController],
})
export class ProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ProductController);
  }
}

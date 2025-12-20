import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = ['http://localhost:4200', 'http://frontend:80'];

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_PORT') || 3002;
  const corsOrigin = configService.get<string>('CORSURL') || '*';

  // app.enableCors({
  //   origin: corsOrigin,
  //   credentials: true,
  // });

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(port, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${port}`);
  });
}

bootstrap();

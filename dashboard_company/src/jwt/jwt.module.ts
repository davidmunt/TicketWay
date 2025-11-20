import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtCustomService } from './jwt.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          'token_predeterminado_fuerte',
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ||
            '2h') as any,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtCustomService],
  exports: [JwtCustomService],
})
export class JwtCustomModule {}

import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class JwtCustomService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(payload: Record<string, any>): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(payload: Record<string, any>): Promise<string> {
    const secret =
      process.env.JWT_REFRESH_SECRET ?? 'refreshtoken_predeterminado_fuerte';
    const expiresInValue = process.env.JWT_REFRESH_EXPIRES_IN ?? '15d';
    const options: JwtSignOptions = {
      secret: secret,
      expiresIn: expiresInValue as any,
    };
    return this.jwtService.signAsync(payload, options);
  }
}

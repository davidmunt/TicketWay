import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers?.authorization?.replace(/^Token /, '');
    if (!token) {
      throw new UnauthorizedException('Es necesario el token');
    }
    let decoded = null;
    try {
      decoded = this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
    if (decoded.role !== 'company') {
      throw new ForbiddenException('No tienes permisos para esta operación');
    }
    const user = await this.prisma.userCompany.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { userId: decoded.userId },
    });
    if (!refreshToken) {
      throw new UnauthorizedException('RefreshToken no encontrado');
    }
    if (refreshToken.expiryDate < new Date()) {
      await this.prisma.refreshBlacklist.create({
        data: {
          token: refreshToken.token,
          userId: decoded.userId,
          expiryDate: refreshToken.expiryDate,
        },
      });
      await this.prisma.refreshToken.delete({
        where: { userId: decoded.userId },
      });
      throw new UnauthorizedException(
        'Refresh Token expirado, vuelve a iniciar sesion',
      );
    }
    (req as any).userId = user.id;
    next();
  }
}

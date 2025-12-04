import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserCompanyDto, LoginUserCompanyDto } from './dto/index';
import { ResponseUserCompanyDto } from './dto/index';
import * as argon2 from 'argon2';
import { plainToInstance } from 'class-transformer';
import { JwtCustomService } from '../jwt/jwt.service';

@Injectable()
export class UserCompanyService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtCustomService,
  ) {}

  async registerUserCompany(registerData: RegisterUserCompanyDto) {
    try {
      const emailInUse = await this.prisma.userCompany.findUnique({
        where: { email: registerData.email },
      });
      if (emailInUse) {
        throw new BadRequestException('El email ya esta registrado');
      }
      const usernameInUse = await this.prisma.userCompany.findUnique({
        where: { username: registerData.username },
      });
      if (usernameInUse) {
        throw new BadRequestException('El nombre de usuario esta en uso');
      }
      const hashedPassword = await argon2.hash(registerData.password);
      const newUser = await this.prisma.userCompany.create({
        data: {
          username: registerData.username,
          email: registerData.email,
          password: hashedPassword,
        },
      });
      const token = 'aqui ira el token';
      const responseDto = plainToInstance(ResponseUserCompanyDto, {
        username: newUser.username,
        email: newUser.email,
        image: newUser.image,
      });
      return { success: true, user: responseDto, token: token };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async loginUserCompany(loginData: LoginUserCompanyDto) {
    try {
      const user = await this.prisma.userCompany.findUnique({
        where: { email: loginData.email },
      });
      if (!user) {
        throw new BadRequestException('Credenciales incorrectas');
      }
      const passwIsCorrect = await argon2.verify(
        user.password,
        loginData.password,
      );
      if (!passwIsCorrect) {
        throw new BadRequestException('Credenciales incorrectas');
      }
      await this.prisma.refreshToken.deleteMany({
        where: { userId: user.id },
      });
      const accessToken = await this.jwtService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: 'company',
      });
      const refreshToken = await this.jwtService.generateRefreshToken({
        userId: user.id,
      });
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 15);
      await this.prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiryDate,
        },
      });
      const responseDto = plainToInstance(ResponseUserCompanyDto, {
        username: user.username,
        email: user.email,
        image: user.image,
      });
      return { success: true, user: responseDto, token: accessToken };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async logoutUserCompany(userId: string) {
    try {
      const user = await this.prisma.userCompany.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }
      const refreshToken = await this.prisma.refreshToken.findUnique({
        where: { userId: userId },
      });
      if (!refreshToken) {
        throw new BadRequestException('RefreshToken no encontrado');
      }
      await this.prisma.refreshBlacklist.create({
        data: {
          token: refreshToken.token,
          userId: userId,
          expiryDate: refreshToken.expiryDate,
        },
      });
      await this.prisma.refreshToken.delete({
        where: {
          userId: userId,
        },
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async refreshUserCompany(userId: string) {
    try {
      const user = await this.prisma.userCompany.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }
      const refreshToken = await this.prisma.refreshToken.findUnique({
        where: { userId: userId },
      });
      if (!refreshToken) {
        throw new BadRequestException('RefreshToken no encontrado');
      }
      const accessToken = await this.jwtService.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: 'company',
      });
      return { success: true, token: accessToken };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUserCompany(userId: string) {
    try {
      const user = await this.prisma.userCompany.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new BadRequestException('Usuario no encontrado');
      }
      const responseDto = plainToInstance(ResponseUserCompanyDto, {
        username: user.username,
        email: user.email,
        image: user.image,
      });
      return { success: true, user: responseDto };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

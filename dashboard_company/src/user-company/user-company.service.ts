import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserCompanyDto, LoginUserCompanyDto } from './dto/index';
import { ResponseUserCompanyDto } from './dto/index';
import * as argon2 from 'argon2';
import { plainToInstance } from 'class-transformer';
import { emitWarning } from 'process';

@Injectable()
export class UserCompanyService {
  constructor(private prisma: PrismaService) {}

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
      return plainToInstance(ResponseUserCompanyDto, {
        username: newUser.username,
        email: newUser.email,
        image: newUser.image,
        token,
      });
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
      const token = 'token de momento';
      return plainToInstance(ResponseUserCompanyDto, {
        username: user.username,
        email: user.email,
        image: user.image,
        token,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

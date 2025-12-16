import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  Req,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import {
  LoginUserCompanyDto,
  RegisterUserCompanyDto,
} from '../../user-company-ms/dto';

@Controller('user-company')
export class UserCompanyController implements OnModuleInit {
  constructor(@Inject('USER_COMPANY_MS') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Post('register')
  async register(@Body() dto: RegisterUserCompanyDto) {
    return lastValueFrom(
      this.client.send({ cmd: 'register_user_company' }, dto),
    );
  }

  @Post('login')
  async login(@Body() dto: LoginUserCompanyDto) {
    return lastValueFrom(this.client.send({ cmd: 'login_user_company' }, dto));
  }

  @Post('logout')
  async logout(@Req() req: any) {
    const userId = req.userId;
    return lastValueFrom(
      this.client.send({ cmd: 'logout_user_company' }, { userId }),
    );
  }

  @Post('refresh')
  async refresh(@Req() req: any) {
    const userId = req.userId;
    return lastValueFrom(
      this.client.send({ cmd: 'refresh_user_company' }, { userId }),
    );
  }

  @Get('data')
  async getUserData(@Req() req: any) {
    const userId = req.userId;
    return lastValueFrom(
      this.client.send({ cmd: 'get_user_company' }, { userId }),
    );
  }
}

import {
  Controller,
  Post,
  Body,
  Inject,
  OnModuleInit,
  Get,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  LoginUserCompanyDto,
  RegisterUserCompanyDto,
} from '../../user-company-ms/dto/index';

@Controller('user-company')
export class UserCompanyController implements OnModuleInit {
  constructor(@Inject('USER_COMPANY_MS') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Post('register')
  async register(@Body() dto: RegisterUserCompanyDto) {
    return this.client.send({ cmd: 'register_user_company' }, dto).toPromise();
  }

  @Post('login')
  async login(@Body() dto: LoginUserCompanyDto) {
    return this.client.send({ cmd: 'login_user_company' }, dto).toPromise();
  }

  @Post('logout')
  async logout(@Req() req: any) {
    const userId = req.userId;
    return this.client
      .send({ cmd: 'logout_user_company' }, { userId })
      .toPromise();
  }

  @Post('refresh')
  async refresh(@Req() req: any) {
    const userId = req.userId;
    return this.client
      .send({ cmd: 'refresh_user_company' }, { userId })
      .toPromise();
  }

  @Get('data')
  async getUserData(@Req() req: any) {
    const userId = req.userId;
    return this.client
      .send({ cmd: 'get_user_company' }, { userId })
      .toPromise();
  }
}

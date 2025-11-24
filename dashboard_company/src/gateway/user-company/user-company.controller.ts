import { Controller, Post, Body, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('user-company')
export class UserCompanyController implements OnModuleInit {
  constructor(@Inject('USER_COMPANY_MS') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Post('register')
  async register(@Body() dto: any) {
    return this.client.send({ cmd: 'register_user_company' }, dto).toPromise();
  }

  @Post('login')
  async login(@Body() dto: any) {
    return this.client.send({ cmd: 'login_user_company' }, dto).toPromise();
  }
}

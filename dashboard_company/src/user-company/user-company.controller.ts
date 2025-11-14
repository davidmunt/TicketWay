import { Controller, Get, Post, Param, Body, Put } from '@nestjs/common';
import { UserCompanyService } from './user-company.service';
import { LoginUserCompanyDto, RegisterUserCompanyDto } from './dto/index';
import { ResponseUserCompanyDto } from './dto/index';

@Controller('user-company')
export class UserCompanyController {
  constructor(private readonly userCompanyService: UserCompanyService) {}

  @Post()
  async registerUserCompany(
    @Body() body: RegisterUserCompanyDto,
  ): Promise<ResponseUserCompanyDto> {
    return this.userCompanyService.registerUserCompany(body);
  }

  @Post()
  async loginUserCompany(
    @Body() body: LoginUserCompanyDto,
  ): Promise<ResponseUserCompanyDto> {
    return this.userCompanyService.loginUserCompany(body);
  }

  //   @Put()
  //   async updateUserCompany(@Body() body: any) {
  //     return this.userCompanyService.updateUserCompany(body);
  //   }

  //   @Post()
  //   async refreshUserCompanyToken(@Body() body: any) {
  //     return this.userCompanyService.refreshUserCompanyToken(body);
  //   }

  //   @Post()
  //   async logoutUserCompany(@Body() body: any) {
  //     return this.userCompanyService.logoutUserCompany(body);
  //   }

  //   @Get()
  //   async getUserCompanyData(@Body() body: any) {
  //     return this.userCompanyService.getUserCompanyData(body);
  //   }
}

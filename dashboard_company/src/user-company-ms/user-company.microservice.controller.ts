import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LoginUserCompanyDto, RegisterUserCompanyDto } from './dto/index';
import { UserCompanyService } from './user-company.service';

@Controller()
export class UserCompanyMicroserviceController {
  constructor(private readonly userCompanyService: UserCompanyService) {}

  @MessagePattern({ cmd: 'register_user_company' })
  registerUser(data: RegisterUserCompanyDto) {
    return this.userCompanyService.registerUserCompany(data);
  }

  @MessagePattern({ cmd: 'login_user_company' })
  loginUser(data: LoginUserCompanyDto) {
    return this.userCompanyService.loginUserCompany(data);
  }
}

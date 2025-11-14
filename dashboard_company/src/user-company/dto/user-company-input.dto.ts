import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class RegisterUserCompanyDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}

export class LoginUserCompanyDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}

import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  image: string;
}

export class UpdateProductCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  image: string;
}

export class GetProductCategoriesDto {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

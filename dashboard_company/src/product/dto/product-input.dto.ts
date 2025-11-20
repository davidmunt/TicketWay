import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  artist: string;

  @IsString()
  concert: string;

  @IsString()
  productCategory: string;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  price: number;

  @IsInt()
  stockTotal: number;

  @IsInt()
  stockAvailable: number;

  @IsString()
  imageUrl: string;
}

export class UpdateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  artist: string;

  @IsString()
  concert: string;

  @IsString()
  productCategory: string;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  price: number;

  @IsInt()
  stockTotal: number;

  @IsInt()
  stockAvailable: number;

  @IsString()
  imageUrl: string;
}

export class GetProductsDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

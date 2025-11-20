import { Controller, Get, Post, Param, Body, Put } from '@nestjs/common';
import { ProductCategoryService } from './product-categoy.service';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
  GetProductCategoriesDto,
} from './dto/index';
import { ResponseProductCategoryDto } from './dto/index';

@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  async createProductCategory(
    @Body() body: CreateProductCategoryDto,
  ): Promise<ResponseProductCategoryDto> {
    return this.productCategoryService.createProductCategory(body);
  }

  @Put('/:slug')
  async updateProductCategory(
    @Param('slug') slug: string,
    @Body() body: UpdateProductCategoryDto,
  ): Promise<ResponseProductCategoryDto> {
    return this.productCategoryService.updateProductCategory(slug, body);
  }

  @Get('/:slug')
  async getProductCategory(
    @Param('slug') slug: string,
  ): Promise<ResponseProductCategoryDto> {
    return this.productCategoryService.getProductCategory(slug);
  }

  @Get('')
  async getProductCategories(
    @Body() body: GetProductCategoriesDto[],
  ): Promise<ResponseProductCategoryDto[]> {
    return this.productCategoryService.getProductCategories();
  }
}

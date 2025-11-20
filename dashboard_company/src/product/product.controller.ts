import { Controller, Get, Post, Param, Body, Put, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  GetProductsDto,
} from './dto/index';
import { ResponseProductDto } from './dto/index';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(
    @Body() body: CreateProductDto,
  ): Promise<ResponseProductDto> {
    return this.productService.createProduct(body);
  }

  @Put('/:slug')
  async updateProduct(
    @Param('slug') slug: string,
    @Body() body: UpdateProductDto,
  ): Promise<ResponseProductDto> {
    return this.productService.updateProduct(body, slug);
  }

  @Get('/:slug')
  async getProduct(@Param('slug') slug: string): Promise<ResponseProductDto> {
    return this.productService.getProduct(slug);
  }

  @Get('')
  async getProducts(
    @Body() body: GetProductsDto[],
  ): Promise<ResponseProductDto[]> {
    return this.productService.getProducts();
  }
}

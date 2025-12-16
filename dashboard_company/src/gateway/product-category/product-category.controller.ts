import {
  Controller,
  Post,
  Body,
  Inject,
  Param,
  Get,
  Put,
  Delete,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
  GetProductCategoriesDto,
} from '../../product-category-ms/dto';

@Controller('product-category')
export class ProductCategoryController implements OnModuleInit {
  constructor(@Inject('PRODUCT_CATEGORY_MS') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Post()
  async createProductCategory(@Body() dto: CreateProductCategoryDto) {
    return lastValueFrom(
      this.client.send({ cmd: 'create_product_category' }, dto),
    );
  }

  @Put(':slug')
  async updateProductCategory(
    @Param('slug') slug: string,
    @Body() dto: UpdateProductCategoryDto,
  ) {
    return lastValueFrom(
      this.client.send({ cmd: 'update_product_category' }, { slug, data: dto }),
    );
  }

  @Delete(':slug')
  async deleteProductCategory(@Param('slug') slug: string) {
    return lastValueFrom(
      this.client.send({ cmd: 'delete_product_category' }, { slug }),
    );
  }

  @Get('list')
  async getProductsCategories(@Body() dto: GetProductCategoriesDto) {
    return lastValueFrom(
      this.client.send({ cmd: 'get_products_categories' }, dto),
    );
  }

  @Get(':slug')
  async getProductCategory(@Param('slug') slug: string) {
    return lastValueFrom(
      this.client.send({ cmd: 'get_product_category' }, { slug }),
    );
  }
}

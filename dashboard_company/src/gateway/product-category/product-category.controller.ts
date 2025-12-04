import {
  Controller,
  Post,
  Body,
  Inject,
  OnModuleInit,
  Param,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
  GetProductCategoriesDto,
} from '../../product-category-ms/dto/index';

@Controller('product-category')
export class ProductCategoryController implements OnModuleInit {
  constructor(@Inject('PRODUCT_CATEGORY_MS') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Post()
  async createProductCategory(@Body() dto: CreateProductCategoryDto) {
    return this.client
      .send({ cmd: 'create_product_category' }, dto)
      .toPromise();
  }

  @Put(':slug')
  async updateProductCategory(
    @Param('slug') slug: string,
    @Body() dto: UpdateProductCategoryDto,
  ) {
    return this.client
      .send({ cmd: 'update_product_category' }, { slug, ...dto })
      .toPromise();
  }

  @Delete(':slug')
  async deleteProductCategory(@Param('slug') slug: string) {
    return this.client
      .send({ cmd: 'delete_product_category' }, { slug })
      .toPromise();
  }

  @Get('list')
  async getProductsCategories(@Body() dto: GetProductCategoriesDto) {
    return this.client
      .send({ cmd: 'get_products_categories' }, dto)
      .toPromise();
  }

  @Get(':slug')
  async getProductCategory(@Param('slug') slug: string) {
    return this.client
      .send({ cmd: 'get_product_category' }, { slug })
      .toPromise();
  }
}

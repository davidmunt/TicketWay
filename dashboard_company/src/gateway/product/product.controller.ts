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
  CreateProductDto,
  UpdateProductDto,
  GetProductsDto,
} from '../../product-ms/dto';

@Controller('product')
export class ProductController implements OnModuleInit {
  constructor(@Inject('PRODUCT_MS') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    return lastValueFrom(this.client.send({ cmd: 'create_product' }, dto));
  }

  @Put(':slug')
  async updateProduct(
    @Param('slug') slug: string,
    @Body() dto: UpdateProductDto,
  ) {
    return lastValueFrom(
      this.client.send({ cmd: 'update_product' }, { slug, ...dto }),
    );
  }

  @Delete(':slug')
  async deleteProduct(@Param('slug') slug: string) {
    return lastValueFrom(this.client.send({ cmd: 'delete_product' }, { slug }));
  }

  @Get('list')
  async getProducts(@Body() dto: GetProductsDto) {
    return lastValueFrom(this.client.send({ cmd: 'get_products' }, dto));
  }

  @Get(':slug')
  async getProduct(@Param('slug') slug: string) {
    return lastValueFrom(this.client.send({ cmd: 'get_product' }, { slug }));
  }
}

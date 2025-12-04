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
  CreateProductDto,
  UpdateProductDto,
  GetProductsDto,
} from '../../product-ms/dto/index';

@Controller('product')
export class ProductController implements OnModuleInit {
  constructor(@Inject('PRODUCT_MS') private client: ClientProxy) {}

  async onModuleInit() {
    await this.client.connect();
  }

  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    return this.client.send({ cmd: 'create_product' }, dto).toPromise();
  }

  @Put(':slug')
  async updateProduct(
    @Param('slug') slug: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.client
      .send({ cmd: 'update_product' }, { slug, ...dto })
      .toPromise();
  }

  @Delete(':slug')
  async deleteProduct(@Param('slug') slug: string) {
    return this.client.send({ cmd: 'delete_product' }, { slug }).toPromise();
  }

  @Get('list')
  async getProducts(@Body() dto: GetProductsDto) {
    return this.client.send({ cmd: 'get_products' }, dto).toPromise();
  }

  @Get(':slug')
  async getProduct(@Param('slug') slug: string) {
    return this.client.send({ cmd: 'get_product' }, { slug }).toPromise();
  }
}

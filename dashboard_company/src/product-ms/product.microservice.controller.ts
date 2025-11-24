import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  GetProductsDto,
  ResponseProductDto,
} from './dto/index';

@Controller()
export class ProductMicroserviceController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: 'create_product' })
  createProduct(data: CreateProductDto) {
    return this.productService.createProduct(data);
  }

  @MessagePattern({ cmd: 'update_product' })
  updateProduct(data: UpdateProductDto, slug: any) {
    return this.productService.updateProduct(data, slug);
  }

  @MessagePattern({ cmd: 'get_products' })
  getProducts(data: GetProductsDto) {
    return this.productService.getProducts(data.isActive);
  }

  @MessagePattern({ cmd: 'get_product' })
  getProduct(slug: any) {
    return this.productService.getProduct(slug);
  }
}

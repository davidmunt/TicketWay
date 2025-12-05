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
  updateProduct(data: any) {
    return this.productService.updateProduct(data, data.slug);
  }

  @MessagePattern({ cmd: 'delete_product' })
  deleteProduct({ slug }: { slug: string }) {
    return this.productService.deleteProduct(slug);
  }

  @MessagePattern({ cmd: 'get_products' })
  getProducts(data: GetProductsDto) {
    return this.productService.getProducts(data.isActive);
  }

  @MessagePattern({ cmd: 'get_product' })
  getProduct(slug: string) {
    return this.productService.getProduct(slug);
  }
}

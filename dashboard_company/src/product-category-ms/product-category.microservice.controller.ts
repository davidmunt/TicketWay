import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductCategoryService } from './product-categoy.service';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
  GetProductCategoriesDto,
  ResponseProductCategoryDto,
} from './dto/index';

@Controller()
export class ProductCategoryMicroserviceController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @MessagePattern({ cmd: 'create_product_category' })
  createProductCategory(data: CreateProductCategoryDto) {
    return this.productCategoryService.createProductCategory(data);
  }

  @MessagePattern({ cmd: 'update_product_category' })
  updateProductCategory(payload: {
    slug: string;
    data: UpdateProductCategoryDto;
  }) {
    const { slug, data } = payload;
    return this.productCategoryService.updateProductCategory(slug, data);
  }

  @MessagePattern({ cmd: 'delete_product_category' })
  deleteProductCategory(payload: { slug: string }) {
    const { slug } = payload;
    return this.productCategoryService.deleteProductCategory(slug);
  }

  @MessagePattern({ cmd: 'get_products_categories' })
  getProductsCategories(data: GetProductCategoriesDto) {
    return this.productCategoryService.getProductCategories(data.isActive);
  }

  @MessagePattern({ cmd: 'get_product_category' })
  getProductCategory(slug: any) {
    return this.productCategoryService.getProductCategory(slug);
  }
}

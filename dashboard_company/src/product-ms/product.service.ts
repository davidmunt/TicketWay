import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/index';
import { ResponseProductDto } from './dto/index';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  slugify = (text: string) =>
    text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/&/g, '-and-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');

  generateSlug = (name: string) => {
    const baseSlug = this.slugify(name);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `${baseSlug}-${randomPart}`;
  };

  async createProduct(createData: CreateProductDto) {
    try {
      const productCategory = await this.prisma.productCategory.findUnique({
        where: {
          id: createData.productCategory,
        },
      });
      if (!productCategory) {
        throw new BadRequestException(`Categoria del producto no encontrada`);
      }
      const slug = this.generateSlug(createData.name);
      const newProduct = await this.prisma.product.create({
        data: {
          slug,
          name: createData.name,
          description: createData.description,
          productCategory: createData.productCategory,
          price: createData.price,
          stockTotal: createData.stockTotal,
          stockAvailable: createData.stockAvailable,
          imageUrl: createData.imageUrl,
        },
      });
      const responseDto = plainToInstance(ResponseProductDto, newProduct);
      return { success: true, product: responseDto };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateProduct(updateData: UpdateProductDto, slug: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          slug: slug,
        },
      });
      if (!product) {
        throw new BadRequestException(`Producto no encontrado`);
      }
      const productCategory = await this.prisma.productCategory.findUnique({
        where: {
          id: updateData.productCategory,
        },
      });
      if (!productCategory) {
        throw new BadRequestException(`Categoria del producto no encontrada`);
      }
      const updatedProduct = await this.prisma.product.update({
        where: { slug },
        data: {
          name: updateData.name,
          description: updateData.description,
          productCategory: updateData.productCategory,
          price: updateData.price,
          stockTotal: updateData.stockTotal,
          stockAvailable: updateData.stockAvailable,
          imageUrl: updateData.imageUrl,
        },
      });
      const responseDto = plainToInstance(ResponseProductDto, updatedProduct);
      return { success: true, product: responseDto };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteProduct(slug: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { slug },
      });
      if (!product) {
        throw new BadRequestException(
          `Product con slug "${slug}" no encontrado`,
        );
      }
      await this.prisma.product.delete({
        where: { slug },
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getProduct(slug: string): Promise<ResponseProductDto> {
    try {
      const existingCategory = await this.prisma.productCategory.findUnique({
        where: { slug },
      });
      if (!existingCategory) {
        throw new BadRequestException(
          `Product category with slug "${slug}" not found`,
        );
      }
      return plainToInstance(ResponseProductDto, existingCategory);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getProducts(isActive?: boolean): Promise<ResponseProductDto[]> {
    try {
      const existingCategory = await this.prisma.product.findMany({
        where: {
          isActive,
        },
      });
      return plainToInstance(ResponseProductDto, existingCategory);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

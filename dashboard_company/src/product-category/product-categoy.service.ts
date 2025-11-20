import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from './dto/index';
import { ResponseProductCategoryDto } from './dto/index';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductCategoryService {
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

  async createProductCategory(createData: CreateProductCategoryDto) {
    try {
      const slug = this.generateSlug(createData.name);
      const newProductCategory = await this.prisma.productCategory.create({
        data: {
          slug,
          name: createData.name,
          description: createData.description,
          image: createData.image,
        },
      });
      return plainToInstance(ResponseProductCategoryDto, newProductCategory);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateProductCategory(
    slug: string,
    updateData: UpdateProductCategoryDto,
  ): Promise<ResponseProductCategoryDto> {
    try {
      const existingCategory = await this.prisma.productCategory.findUnique({
        where: { slug },
      });
      if (!existingCategory) {
        throw new BadRequestException(
          `Product category with slug "${slug}" not found`,
        );
      }
      const updatedCategory = await this.prisma.productCategory.update({
        where: { slug },
        data: updateData,
      });
      return plainToInstance(ResponseProductCategoryDto, updatedCategory);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getProductCategory(slug: string): Promise<ResponseProductCategoryDto> {
    try {
      const existingCategory = await this.prisma.productCategory.findUnique({
        where: { slug },
      });
      if (!existingCategory) {
        throw new BadRequestException(
          `Product category with slug "${slug}" not found`,
        );
      }
      return plainToInstance(ResponseProductCategoryDto, existingCategory);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getProductCategories(
    isActive?: boolean,
  ): Promise<ResponseProductCategoryDto[]> {
    try {
      const existingCategory = await this.prisma.productCategory.findMany({
        where: {
          isActive,
        },
      });
      return plainToInstance(ResponseProductCategoryDto, existingCategory);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

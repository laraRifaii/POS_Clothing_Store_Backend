import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { Product } from '@prisma/client';
@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, sku, category, size, color, price, stock } = createProductDto;

    // Check if SKU already exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { sku },
    });

    if (existingProduct) {
      throw new ConflictException(`Product with SKU ${sku} already exists`);
    }

    if (price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    if (stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    return this.prisma.product.create({
      data: {
        name,
        sku,
        category,
        size,
        color,
        price,
        stock,
      },
    });
  }

  async findAll(
    query: ProductQueryDto,
  ): Promise<{ products: Product[]; total: number }> {
    const { category, search, page = 1, limit = 50, isActive } = query;

    const where: any = {
      isActive: true,
    };

    if (category) {
      where.category = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { color: { contains: search } },
        { size: { contains: search } },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id, isActive: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySku(sku: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { sku, isActive: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }

    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });

      if (existingProduct) {
        throw new ConflictException(
          `Product with SKU ${updateProductDto.sku} already exists`,
        );
      }
    }

    if (updateProductDto.price !== undefined && updateProductDto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    if (updateProductDto.stock !== undefined && updateProductDto.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);

    const newStock = product.stock + quantity;

    if (newStock < 0) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock}`,
      );
    }

    return this.prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });
  }

  async remove(id: number): Promise<Product> {
    const product = await this.findOne(id);

    // Check if product is used in any sales
    const salesCount = await this.prisma.saleItem.count({
      where: { productId: id },
    });

    if (salesCount > 0) {
      // Soft delete by marking as inactive instead of hard delete
      return this.prisma.product.update({
        where: { id },
        data: { isActive: false },
      });
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async getCategories(): Promise<string[]> {
    const products = await this.prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
    });

    return products.map((p) => p.category);
  }

  async getLowStock(threshold: number = 10): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        stock: { lte: threshold },
        isActive: true,
      },
      orderBy: { stock: 'asc' },
    });
  }
}

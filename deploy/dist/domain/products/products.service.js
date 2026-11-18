"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProductDto) {
        const { name, sku, category, size, color, costPrice, salePrice, stock } = createProductDto;
        const existingProduct = await this.prisma.product.findUnique({
            where: { sku },
        });
        if (existingProduct) {
            throw new common_1.ConflictException(`Product with SKU ${sku} already exists`);
        }
        if (costPrice < 0) {
            throw new common_1.BadRequestException('Cost price cannot be negative');
        }
        if (salePrice < 0) {
            throw new common_1.BadRequestException('Sale price cannot be negative');
        }
        if (salePrice < costPrice) {
            throw new common_1.BadRequestException('Sale price cannot be less than cost price');
        }
        if (stock < 0) {
            throw new common_1.BadRequestException('Stock cannot be negative');
        }
        return this.prisma.product.create({
            data: {
                name,
                sku,
                category,
                size,
                color,
                costPrice,
                salePrice,
                stock,
            },
        });
    }
    async findAll(query) {
        const { category, search, page = 1, limit = 50, isActive } = query;
        const where = {
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
        if (total === 0) {
            return {
                products: [],
                total: 0,
                message: 'No products found yet',
            };
        }
        return { products, total };
    }
    async findOne(id) {
        const product = await this.prisma.product.findFirst({
            where: { id, isActive: true },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findBySku(sku) {
        const product = await this.prisma.product.findFirst({
            where: { sku, isActive: true },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with SKU ${sku} not found`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
            const existingProduct = await this.prisma.product.findUnique({
                where: { sku: updateProductDto.sku },
            });
            if (existingProduct) {
                throw new common_1.ConflictException(`Product with SKU ${updateProductDto.sku} already exists`);
            }
        }
        if (updateProductDto.costPrice !== undefined &&
            updateProductDto.costPrice < 0) {
            throw new common_1.BadRequestException('Cost price cannot be negative');
        }
        if (updateProductDto.salePrice !== undefined &&
            updateProductDto.salePrice < 0) {
            throw new common_1.BadRequestException('Sale price cannot be negative');
        }
        const newCostPrice = updateProductDto.costPrice ?? product.costPrice;
        const newSalePrice = updateProductDto.salePrice ?? product.salePrice;
        if (newSalePrice < newCostPrice) {
            throw new common_1.BadRequestException('Sale price cannot be less than cost price');
        }
        if (updateProductDto.stock !== undefined && updateProductDto.stock < 0) {
            throw new common_1.BadRequestException('Stock cannot be negative');
        }
        return this.prisma.product.update({
            where: { id },
            data: updateProductDto,
        });
    }
    async updateStock(id, quantity) {
        const product = await this.findOne(id);
        const newStock = product.stock + quantity;
        if (newStock < 0) {
            throw new common_1.BadRequestException(`Insufficient stock. Available: ${product.stock}`);
        }
        return this.prisma.product.update({
            where: { id },
            data: { stock: newStock },
        });
    }
    async remove(id) {
        const product = await this.findOne(id);
        const salesCount = await this.prisma.saleItem.count({
            where: { productId: id },
        });
        if (salesCount > 0) {
            return this.prisma.product.update({
                where: { id },
                data: { isActive: false },
            });
        }
        return this.prisma.product.delete({
            where: { id },
        });
    }
    async getCategories() {
        const products = await this.prisma.product.findMany({
            where: { isActive: true },
            select: { category: true },
            distinct: ['category'],
        });
        return products.map((p) => p.category);
    }
    async getLowStock(threshold = 10) {
        return this.prisma.product.findMany({
            where: {
                stock: { lte: threshold },
                isActive: true,
            },
            orderBy: { stock: 'asc' },
        });
    }
    async getProfitMargins() {
        const products = await this.prisma.product.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                sku: true,
                costPrice: true,
                salePrice: true,
            },
        });
        return products.map((product) => ({
            ...product,
            profit: product.salePrice - product.costPrice,
            profitMargin: product.salePrice > 0
                ? ((product.salePrice - product.costPrice) / product.salePrice) * 100
                : 0,
        }));
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map
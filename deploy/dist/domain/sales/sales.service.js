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
exports.SaleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SaleService = class SaleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createSaleDto) {
        const { items, paymentType, discount = 0 } = createSaleDto;
        if (!items || items.length === 0) {
            throw new common_1.BadRequestException('Sale must contain at least one item');
        }
        if (discount < 0) {
            throw new common_1.BadRequestException('Discount cannot be negative');
        }
        const productIds = items.map((item) => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds }, isActive: true },
        });
        if (products.length !== productIds.length) {
            throw new common_1.BadRequestException('One or more products not found or inactive');
        }
        const productMap = new Map(products.map((p) => [p.id, p]));
        let subtotal = 0;
        const saleItems = items.map((item) => {
            const product = productMap.get(item.productId);
            if (!product) {
                throw new common_1.BadRequestException(`Product ${item.productId} not found`);
            }
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
            }
            if (item.quantity <= 0) {
                throw new common_1.BadRequestException('Quantity must be greater than 0');
            }
            const itemPrice = item.price ?? product.salePrice;
            const itemDiscount = item.discount ?? 0;
            if (itemDiscount < 0 || itemDiscount > itemPrice) {
                throw new common_1.BadRequestException('Invalid item discount');
            }
            const itemTotal = (itemPrice - itemDiscount) * item.quantity;
            subtotal += itemTotal;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: itemPrice,
                costPrice: product.costPrice,
                discount: itemDiscount,
            };
        });
        const total = Math.max(0, subtotal - discount);
        const sale = await this.prisma.$transaction(async (tx) => {
            const newSale = await tx.sale.create({
                data: {
                    userId,
                    total,
                    discount,
                    paymentType,
                    items: {
                        create: saleItems,
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            });
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }
            return newSale;
        });
        return sale;
    }
    async findAll(query) {
        const { startDate, endDate, paymentType, userId, page = 1, limit = 50, } = query;
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate);
            }
        }
        if (paymentType) {
            where.paymentType = paymentType;
        }
        if (userId) {
            where.userId = userId;
        }
        const [sales, total] = await Promise.all([
            this.prisma.sale.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            }),
            this.prisma.sale.count({ where }),
        ]);
        if (total === 0 || sales.length === 0) {
            return {
                sales: [],
                total: 0,
                message: 'No sales recorded yet',
            };
        }
        return { sales, total };
    }
    async findOne(id) {
        const sale = await this.prisma.sale.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });
        if (!sale) {
            throw new common_1.NotFoundException(`Sale with ID ${id} not found`);
        }
        return sale;
    }
    async getSalesReport(startDate, endDate) {
        const where = {
            createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
        };
        const [sales, totalRevenue, paymentBreakdown] = await Promise.all([
            this.prisma.sale.findMany({
                where,
                include: {
                    items: true,
                },
            }),
            this.prisma.sale.aggregate({
                where,
                _sum: { total: true },
            }),
            this.prisma.sale.groupBy({
                by: ['paymentType'],
                where,
                _sum: { total: true },
                _count: true,
            }),
        ]);
        let totalCost = 0;
        let totalDiscount = 0;
        sales.forEach((sale) => {
            totalDiscount += sale.discount;
            sale.items.forEach((item) => {
                totalCost += item.costPrice * item.quantity;
            });
        });
        const revenue = totalRevenue._sum.total || 0;
        const grossProfit = revenue - totalCost;
        const profitMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
        const topProducts = await this.prisma.saleItem.groupBy({
            by: ['productId'],
            where: {
                sale: {
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
            },
            _sum: {
                quantity: true,
            },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 10,
        });
        const productIds = topProducts.map((item) => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });
        const productMap = new Map(products.map((p) => [p.id, p]));
        const topProductSales = await this.prisma.saleItem.findMany({
            where: {
                productId: { in: productIds },
                sale: {
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
            },
        });
        const productProfitMap = new Map();
        topProductSales.forEach((item) => {
            const existing = productProfitMap.get(item.productId) || {
                revenue: 0,
                cost: 0,
            };
            existing.revenue += (item.price - item.discount) * item.quantity;
            existing.cost += item.costPrice * item.quantity;
            productProfitMap.set(item.productId, existing);
        });
        const topSellingProducts = topProducts.map((item) => {
            const product = productMap.get(item.productId);
            const profitData = productProfitMap.get(item.productId) || {
                revenue: 0,
                cost: 0,
            };
            const profit = profitData.revenue - profitData.cost;
            const margin = profitData.revenue > 0 ? (profit / profitData.revenue) * 100 : 0;
            return {
                product,
                quantitySold: item._sum.quantity,
                revenue: profitData.revenue,
                cost: profitData.cost,
                profit,
                profitMargin: margin,
            };
        });
        return {
            totalSales: sales.length,
            totalRevenue: revenue,
            totalCost,
            grossProfit,
            profitMargin,
            totalDiscount,
            paymentBreakdown: paymentBreakdown.map((p) => ({
                paymentType: p.paymentType,
                count: p._count,
                total: p._sum.total || 0,
            })),
            topSellingProducts,
            startDate,
            endDate,
        };
    }
    async getDailySales(date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return this.getSalesReport(startOfDay.toISOString(), endOfDay.toISOString());
    }
    async getProfitByCategory(startDate, endDate) {
        const saleItems = await this.prisma.saleItem.findMany({
            where: {
                sale: {
                    createdAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                },
            },
            include: {
                product: true,
            },
        });
        const categoryMap = new Map();
        saleItems.forEach((item) => {
            const category = item.product.category;
            const existing = categoryMap.get(category) || {
                revenue: 0,
                cost: 0,
                quantity: 0,
            };
            existing.revenue += (item.price - item.discount) * item.quantity;
            existing.cost += item.costPrice * item.quantity;
            existing.quantity += item.quantity;
            categoryMap.set(category, existing);
        });
        const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => {
            const profit = data.revenue - data.cost;
            const margin = data.revenue > 0 ? (profit / data.revenue) * 100 : 0;
            return {
                category,
                revenue: data.revenue,
                cost: data.cost,
                profit,
                profitMargin: margin,
                itemsSold: data.quantity,
            };
        });
        return categoryBreakdown.sort((a, b) => b.profit - a.profit);
    }
};
exports.SaleService = SaleService;
exports.SaleService = SaleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SaleService);
//# sourceMappingURL=sales.service.js.map
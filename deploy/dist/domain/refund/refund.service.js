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
exports.RefundService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RefundService = class RefundService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createRefundDto) {
        const { saleId, refundType, reason, notes, items } = createRefundDto;
        const sale = await this.prisma.sale.findUnique({
            where: { id: saleId },
            include: {
                items: {
                    include: {
                        product: true,
                        refundItems: true,
                    },
                },
                refunds: {
                    include: {
                        items: true,
                    },
                },
            },
        });
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
        }
        const refundedQuantities = new Map();
        sale.refunds.forEach(refund => {
            refund.items.forEach(refundItem => {
                const current = refundedQuantities.get(refundItem.saleItemId) || 0;
                refundedQuantities.set(refundItem.saleItemId, current + refundItem.quantity);
            });
        });
        const refundItems = [];
        let totalRefunded = 0;
        for (const item of items) {
            const saleItem = sale.items.find(si => si.id === item.saleItemId);
            if (!saleItem) {
                throw new common_1.BadRequestException(`Sale item ${item.saleItemId} not found in this sale`);
            }
            const alreadyRefunded = refundedQuantities.get(item.saleItemId) || 0;
            const availableToRefund = saleItem.quantity - alreadyRefunded;
            if (item.quantity > availableToRefund) {
                throw new common_1.BadRequestException(`Cannot refund ${item.quantity} of ${saleItem.product.name}. Only ${availableToRefund} available for refund.`);
            }
            const itemRefundAmount = ((saleItem.price - saleItem.discount) * item.quantity);
            totalRefunded += itemRefundAmount;
            refundItems.push({
                saleItemId: item.saleItemId,
                quantity: item.quantity,
                refundAmount: itemRefundAmount,
            });
        }
        if (sale.discount > 0 && refundType === 'FULL') {
            totalRefunded -= sale.discount;
        }
        else if (sale.discount > 0) {
            const discountRatio = totalRefunded / sale.total;
            totalRefunded -= (sale.discount * discountRatio);
        }
        const refund = await this.prisma.$transaction(async (tx) => {
            const newRefund = await tx.refund.create({
                data: {
                    saleId,
                    userId,
                    refundType,
                    reason,
                    notes,
                    totalRefunded,
                    items: {
                        create: refundItems,
                    },
                },
                include: {
                    items: {
                        include: {
                            saleItem: {
                                include: {
                                    product: true,
                                },
                            },
                        },
                    },
                    sale: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    username: true,
                                },
                            },
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
            for (const item of refundItems) {
                const saleItem = sale.items.find(si => si.id === item.saleItemId);
                if (saleItem) {
                    await tx.product.update({
                        where: { id: saleItem.productId },
                        data: {
                            stock: {
                                increment: item.quantity,
                            },
                        },
                    });
                }
            }
            return newRefund;
        });
        return refund;
    }
    async findAll(query) {
        const { saleId, userId, startDate, endDate, page = 1, limit = 50 } = query;
        const where = {};
        if (saleId) {
            where.saleId = saleId;
        }
        if (userId) {
            where.userId = userId;
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate);
            }
        }
        const [refunds, total] = await Promise.all([
            this.prisma.refund.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: {
                            saleItem: {
                                include: {
                                    product: true,
                                },
                            },
                        },
                    },
                    sale: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
            }),
            this.prisma.refund.count({ where }),
        ]);
        return { refunds, total };
    }
    async findOne(id) {
        const refund = await this.prisma.refund.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        saleItem: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
                sale: {
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
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        });
        if (!refund) {
            throw new common_1.NotFoundException(`Refund with ID ${id} not found`);
        }
        return refund;
    }
    async getRefundStats(startDate, endDate) {
        const where = {
            createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
        };
        const [totalRefunds, totalAmount, refundsByType] = await Promise.all([
            this.prisma.refund.count({ where }),
            this.prisma.refund.aggregate({
                where,
                _sum: { totalRefunded: true },
            }),
            this.prisma.refund.groupBy({
                by: ['refundType'],
                where,
                _count: true,
                _sum: { totalRefunded: true },
            }),
        ]);
        return {
            totalRefunds,
            totalAmount: totalAmount._sum.totalRefunded || 0,
            refundsByType: refundsByType.map(r => ({
                type: r.refundType,
                count: r._count,
                total: r._sum.totalRefunded || 0,
            })),
            startDate,
            endDate,
        };
    }
};
exports.RefundService = RefundService;
exports.RefundService = RefundService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RefundService);
//# sourceMappingURL=refund.service.js.map
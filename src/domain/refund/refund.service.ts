import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRefundDto, RefundItemDto } from './dto/createRefund.dto';
import { RefundQueryDto } from './dto/refundQuery.dto';

@Injectable()
export class RefundService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createRefundDto: CreateRefundDto) {
    const { saleId, refundType, reason, notes, items } = createRefundDto;

    // Validate sale exists
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
      throw new NotFoundException('Sale not found');
    }

    // Calculate already refunded quantities
    const refundedQuantities = new Map<number, number>();
    sale.refunds.forEach(refund => {
      refund.items.forEach(refundItem => {
        const current = refundedQuantities.get(refundItem.saleItemId) || 0;
        refundedQuantities.set(refundItem.saleItemId, current + refundItem.quantity);
      });
    });

    // Validate refund items
    const refundItems: RefundItemDto[] = [];
    let totalRefunded = 0;

    for (const item of items) {
      const saleItem = sale.items.find(si => si.id === item.saleItemId);
      
      if (!saleItem) {
        throw new BadRequestException(`Sale item ${item.saleItemId} not found in this sale`);
      }

      const alreadyRefunded = refundedQuantities.get(item.saleItemId) || 0;
      const availableToRefund = saleItem.quantity - alreadyRefunded;

      if (item.quantity > availableToRefund) {
        throw new BadRequestException(
          `Cannot refund ${item.quantity} of ${saleItem.product.name}. Only ${availableToRefund} available for refund.`
        );
      }

      // Calculate refund amount for this item
      const itemRefundAmount = ((saleItem.price - saleItem.discount) * item.quantity);
      totalRefunded += itemRefundAmount;

      refundItems.push({
        saleItemId: item.saleItemId,
        quantity: item.quantity,
        refundAmount: itemRefundAmount,
      });
    }

    // Apply sale-level discount proportionally if exists
    if (sale.discount > 0 && refundType === 'FULL') {
      totalRefunded -= sale.discount;
    } else if (sale.discount > 0) {
      // Proportional discount for partial refunds
      const discountRatio = totalRefunded / sale.total;
      totalRefunded -= (sale.discount * discountRatio);
    }

    // Create refund with items in a transaction
    const refund = await this.prisma.$transaction(async (tx) => {
      // Create the refund
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

      // Update product stock (return items to inventory)
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

  async findAll(query: RefundQueryDto) {
    const { saleId, userId, startDate, endDate, page = 1, limit = 50 } = query;

    const where: any = {};

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

  async findOne(id: number) {
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
      throw new NotFoundException(`Refund with ID ${id} not found`);
    }

    return refund;
  }

  async getRefundStats(startDate: string, endDate: string) {
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
}

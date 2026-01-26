import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleQueryDto } from './dto/sale-query.dto';

@Injectable()
export class SaleService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createSaleDto: CreateSaleDto) {
    const { items, paymentType, discount = 0 } = createSaleDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Sale must contain at least one item');
    }

    if (discount < 0) {
      throw new BadRequestException('Discount cannot be negative');
    }

    // Validate all products exist and have sufficient stock
    const productIds = items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException(
        'One or more products not found or inactive',
      );
    }

    // Create a map for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate stock and calculate total
    let subtotal = 0;
    const saleItems = items.map((item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }

      if (item.quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than 0');
      }

      const itemPrice = item.price ?? product.salePrice;
      const itemDiscount = item.discount ?? 0;

      if (itemDiscount < 0 || itemDiscount > itemPrice) {
        throw new BadRequestException('Invalid item discount');
      }

      const itemTotal = (itemPrice - itemDiscount) * item.quantity;
      subtotal += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: itemPrice,
        costPrice: product.costPrice, // Store cost price for profit calculation
        discount: itemDiscount,
      };
    });

    const total = Math.max(0, subtotal - discount);

    // Create sale with items in a transaction
    const sale = await this.prisma.$transaction(async (tx) => {
      // Create the sale
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

      // Update stock for each product
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

  async findAll(query: SaleQueryDto) {
    const {
      startDate,
      endDate,
      paymentType,
      userId,
      page = 1,
      limit = 50,
    } = query;

    const where: any = {};

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

  async findOne(id: number) {
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
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return sale;
  }

  async getSalesReport(startDate: string, endDate: string) {
    const where: any = {
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

    // Calculate total cost and profit
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

    // Get top selling products
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

    // Get detailed sales data for top products to calculate their profit
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

    // Calculate profit per product
    const productProfitMap = new Map<
      number,
      { revenue: number; cost: number }
    >();

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
      const margin =
        profitData.revenue > 0 ? (profit / profitData.revenue) * 100 : 0;

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

  async getDailySales(date: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.getSalesReport(
      startOfDay.toISOString(),
      endOfDay.toISOString(),
    );
  }

  async getProfitByCategory(startDate: string, endDate: string) {
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

    const categoryMap = new Map<
      string,
      { revenue: number; cost: number; quantity: number }
    >();

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

    const categoryBreakdown = Array.from(categoryMap.entries()).map(
      ([category, data]) => {
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
      },
    );

    return categoryBreakdown.sort((a, b) => b.profit - a.profit);
  }
}

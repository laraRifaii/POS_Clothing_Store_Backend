import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleQueryDto } from './dto/sale-query.dto';
export declare class SaleService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createSaleDto: CreateSaleDto): Promise<{
        user: {
            username: string;
            id: number;
        };
        items: ({
            product: {
                id: number;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sku: string;
                category: string;
                size: string;
                color: string;
                costPrice: number;
                salePrice: number;
                stock: number;
            };
        } & {
            id: number;
            costPrice: number;
            productId: number;
            quantity: number;
            price: number;
            discount: number;
            saleId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        total: number;
        discount: number;
        paymentType: import("@prisma/client").$Enums.PaymentType;
    }>;
    findAll(query: SaleQueryDto): Promise<{
        sales: never[];
        total: number;
        message: string;
    } | {
        sales: ({
            user: {
                username: string;
                id: number;
            };
            items: ({
                product: {
                    id: number;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    sku: string;
                    category: string;
                    size: string;
                    color: string;
                    costPrice: number;
                    salePrice: number;
                    stock: number;
                };
            } & {
                id: number;
                costPrice: number;
                productId: number;
                quantity: number;
                price: number;
                discount: number;
                saleId: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            userId: number;
            total: number;
            discount: number;
            paymentType: import("@prisma/client").$Enums.PaymentType;
        })[];
        total: number;
        message?: undefined;
    }>;
    findOne(id: number): Promise<{
        user: {
            username: string;
            id: number;
        };
        items: ({
            product: {
                id: number;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sku: string;
                category: string;
                size: string;
                color: string;
                costPrice: number;
                salePrice: number;
                stock: number;
            };
        } & {
            id: number;
            costPrice: number;
            productId: number;
            quantity: number;
            price: number;
            discount: number;
            saleId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        total: number;
        discount: number;
        paymentType: import("@prisma/client").$Enums.PaymentType;
    }>;
    getSalesReport(startDate: string, endDate: string): Promise<{
        totalSales: number;
        totalRevenue: number;
        totalCost: number;
        grossProfit: number;
        profitMargin: number;
        totalDiscount: number;
        paymentBreakdown: {
            paymentType: import("@prisma/client").$Enums.PaymentType;
            count: number;
            total: number;
        }[];
        topSellingProducts: {
            product: {
                id: number;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sku: string;
                category: string;
                size: string;
                color: string;
                costPrice: number;
                salePrice: number;
                stock: number;
            } | undefined;
            quantitySold: number | null;
            revenue: number;
            cost: number;
            profit: number;
            profitMargin: number;
        }[];
        startDate: string;
        endDate: string;
    }>;
    getDailySales(date: string): Promise<{
        totalSales: number;
        totalRevenue: number;
        totalCost: number;
        grossProfit: number;
        profitMargin: number;
        totalDiscount: number;
        paymentBreakdown: {
            paymentType: import("@prisma/client").$Enums.PaymentType;
            count: number;
            total: number;
        }[];
        topSellingProducts: {
            product: {
                id: number;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                sku: string;
                category: string;
                size: string;
                color: string;
                costPrice: number;
                salePrice: number;
                stock: number;
            } | undefined;
            quantitySold: number | null;
            revenue: number;
            cost: number;
            profit: number;
            profitMargin: number;
        }[];
        startDate: string;
        endDate: string;
    }>;
    getProfitByCategory(startDate: string, endDate: string): Promise<{
        category: string;
        revenue: number;
        cost: number;
        profit: number;
        profitMargin: number;
        itemsSold: number;
    }[]>;
}

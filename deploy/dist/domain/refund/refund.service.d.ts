import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRefundDto } from './dto/createRefund.dto';
import { RefundQueryDto } from './dto/refundQuery.dto';
export declare class RefundService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createRefundDto: CreateRefundDto): Promise<{
        user: {
            username: string;
            id: number;
        };
        sale: {
            user: {
                username: string;
                id: number;
            };
        } & {
            id: number;
            createdAt: Date;
            userId: number;
            total: number;
            discount: number;
            paymentType: import("@prisma/client").$Enums.PaymentType;
        };
        items: ({
            saleItem: {
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
            };
        } & {
            id: number;
            quantity: number;
            saleItemId: number;
            refundAmount: number;
            refundId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        saleId: number;
        refundType: import("@prisma/client").$Enums.RefundType;
        reason: string;
        notes: string | null;
        totalRefunded: number;
    }>;
    findAll(query: RefundQueryDto): Promise<{
        refunds: ({
            user: {
                username: string;
                id: number;
            };
            sale: {
                id: number;
                createdAt: Date;
                userId: number;
                total: number;
                discount: number;
                paymentType: import("@prisma/client").$Enums.PaymentType;
            };
            items: ({
                saleItem: {
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
                };
            } & {
                id: number;
                quantity: number;
                saleItemId: number;
                refundAmount: number;
                refundId: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            userId: number;
            saleId: number;
            refundType: import("@prisma/client").$Enums.RefundType;
            reason: string;
            notes: string | null;
            totalRefunded: number;
        })[];
        total: number;
    }>;
    findOne(id: number): Promise<{
        user: {
            username: string;
            id: number;
        };
        sale: {
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
        };
        items: ({
            saleItem: {
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
            };
        } & {
            id: number;
            quantity: number;
            saleItemId: number;
            refundAmount: number;
            refundId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        saleId: number;
        refundType: import("@prisma/client").$Enums.RefundType;
        reason: string;
        notes: string | null;
        totalRefunded: number;
    }>;
    getRefundStats(startDate: string, endDate: string): Promise<{
        totalRefunds: number;
        totalAmount: number;
        refundsByType: {
            type: import("@prisma/client").$Enums.RefundType;
            count: number;
            total: number;
        }[];
        startDate: string;
        endDate: string;
    }>;
}

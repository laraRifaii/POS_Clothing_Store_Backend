import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { Product } from '@prisma/client';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(query: ProductQueryDto): Promise<{
        products: Product[];
        total: number;
        message?: string;
    }>;
    findOne(id: number): Promise<Product>;
    findBySku(sku: string): Promise<Product>;
    update(id: number, updateProductDto: UpdateProductDto): Promise<Product>;
    updateStock(id: number, quantity: number): Promise<Product>;
    remove(id: number): Promise<Product>;
    getCategories(): Promise<string[]>;
    getLowStock(threshold?: number): Promise<Product[]>;
    getProfitMargins(): Promise<Array<{
        id: number;
        name: string;
        sku: string;
        costPrice: number;
        salePrice: number;
        profit: number;
        profitMargin: number;
    }>>;
}

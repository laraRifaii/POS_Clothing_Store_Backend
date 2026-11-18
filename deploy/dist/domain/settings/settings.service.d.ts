import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreInfoDto } from './dto/create.dto';
import { UpdateStoreInfoDto } from './dto/update.dto';
import { StoreInfo } from '@prisma/client';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createStoreInfo(createStoreInfo: CreateStoreInfoDto): Promise<{
        id: number;
        name: string;
        address: string;
        phone: string;
        email: string;
        logoUrl: string | null;
    }>;
    getStore(): Promise<{
        id: number;
        name: string;
        address: string;
        phone: string;
        email: string;
        logoUrl: string | null;
    }>;
    update(updateStoreInfoDto: UpdateStoreInfoDto): Promise<{
        id: number;
        name: string;
        address: string;
        phone: string;
        email: string;
        logoUrl: string | null;
    }>;
    remove(): Promise<{
        id: number;
        name: string;
        address: string;
        phone: string;
        email: string;
        logoUrl: string | null;
    }>;
    uploadLogo(logoUrl: string): Promise<StoreInfo>;
}

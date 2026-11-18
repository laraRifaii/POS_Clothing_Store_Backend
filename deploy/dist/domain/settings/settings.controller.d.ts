import { SettingsService } from './settings.service';
import { CreateStoreInfoDto } from './dto/create.dto';
import { UpdateStoreInfoDto } from './dto/update.dto';
export declare class SettingsController {
    private readonly storeInfoService;
    constructor(storeInfoService: SettingsService);
    create(dto: CreateStoreInfoDto): Promise<{
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
    update(dto: UpdateStoreInfoDto): Promise<{
        id: number;
        name: string;
        address: string;
        phone: string;
        email: string;
        logoUrl: string | null;
    }>;
    uploadLogo(file: Express.Multer.File): Promise<{
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
}

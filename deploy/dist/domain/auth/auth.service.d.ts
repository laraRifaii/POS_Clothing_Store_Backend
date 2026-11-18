import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signIn.dto';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    signin(dto: SignInDto): Promise<{
        user: {
            username: string;
            role: import("@prisma/client").$Enums.UserRole;
            id: number;
            isActive: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    signup(dto: RegisterDto): Promise<{
        username: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        username: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findById(id: number): Promise<{
        username: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, dto: Partial<RegisterDto>): Promise<{
        username: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    toggleActive(id: number): Promise<{
        username: string;
        role: import("@prisma/client").$Enums.UserRole;
        id: number;
        isActive: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: number): Promise<{
        message: string;
    }>;
    hardDelete(id: number): Promise<{
        message: string;
    }>;
    deleteWithAuth(id: number, currentUserId: number): Promise<{
        message: string;
    }>;
    hardDeleteWithAuth(id: number, currentUserId: number): Promise<{
        message: string;
    }>;
    logout(): Promise<{
        message: string;
    }>;
}

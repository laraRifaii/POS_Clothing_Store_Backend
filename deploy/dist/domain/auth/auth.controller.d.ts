import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signIn.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    logout(): Promise<{
        message: string;
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
    delete(id: number, req: any): Promise<{
        message: string;
    }>;
    hardDelete(id: number, req: any): Promise<{
        message: string;
    }>;
}

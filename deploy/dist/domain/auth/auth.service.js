"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const user_role_enum_1 = require("./enums/user-role.enum");
let AuthService = class AuthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async signin(dto) {
        const user = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.isActive) {
            throw new common_1.BadRequestException('User account is inactive');
        }
        const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordMatch) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const { passwordHash, ...userWithoutPassword } = user;
        return { user: userWithoutPassword };
    }
    async signup(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { username: dto.username },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Username already exists');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                username: dto.username,
                passwordHash,
                role: dto.role,
            },
        });
        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async findAll() {
        const users = await this.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return users.map((user) => {
            const { passwordHash, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async update(id, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (dto.username && dto.username !== user.username) {
            const existingUser = await this.prisma.user.findUnique({
                where: { username: dto.username },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Username already exists');
            }
        }
        const updateData = {};
        if (dto.username)
            updateData.username = dto.username;
        if (dto.role)
            updateData.role = dto.role;
        if (dto.password) {
            updateData.passwordHash = await bcrypt.hash(dto.password, 10);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });
        const { passwordHash, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
    async toggleActive(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
        });
        const { passwordHash, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
    async delete(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role === user_role_enum_1.UserRole.ADMIN) {
            const activeAdminCount = await this.prisma.user.count({
                where: {
                    role: user_role_enum_1.UserRole.ADMIN,
                    isActive: true,
                },
            });
            if (activeAdminCount <= 1) {
                throw new common_1.BadRequestException('Cannot deactivate the last admin user. Create another admin first.');
            }
        }
        await this.prisma.user.update({
            where: { id },
            data: { isActive: false },
        });
        return { message: 'User deactivated successfully' };
    }
    async hardDelete(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role === user_role_enum_1.UserRole.ADMIN) {
            const activeAdminCount = await this.prisma.user.count({
                where: {
                    role: user_role_enum_1.UserRole.ADMIN,
                    isActive: true,
                },
            });
            if (activeAdminCount <= 1) {
                throw new common_1.BadRequestException('Cannot delete the last admin user. Create another admin first.');
            }
        }
        const salesCount = await this.prisma.sale.count({
            where: { userId: id },
        });
        if (salesCount > 0) {
            throw new common_1.BadRequestException('Cannot delete user with existing sales. Use soft delete instead.');
        }
        await this.prisma.user.delete({
            where: { id },
        });
        return { message: 'User deleted permanently' };
    }
    async deleteWithAuth(id, currentUserId) {
        if (id === currentUserId) {
            throw new common_1.BadRequestException('You cannot delete your own account');
        }
        return this.delete(id);
    }
    async hardDeleteWithAuth(id, currentUserId) {
        if (id === currentUserId) {
            throw new common_1.BadRequestException('You cannot delete your own account');
        }
        return this.hardDelete(id);
    }
    async logout() {
        return { message: 'Logged out successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
// backend/src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signIn.dto';
import { UserRole } from './enums/user-role.enum';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  /**
   * Sign in
   */
  async signin(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isActive) {
      throw new BadRequestException('User account is inactive');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Return user without password
    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }

  /**
   * Sign up (Admin only)
   */
  async signup(dto: RegisterDto) {
    // Check if username already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash,
        role: dto.role,
      },
    });

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Find all users
   */
  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Remove password hash from all users
    return users.map((user) => {
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  /**
   * Find user by ID
   */
  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Update user
   */
  async update(id: number, dto: Partial<RegisterDto>) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if username is being changed and if it already exists
    if (dto.username && dto.username !== user.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: dto.username },
      });

      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (dto.username) updateData.username = dto.username;
    if (dto.role) updateData.role = dto.role;

    // Only update password if provided
    if (dto.password) {
      updateData.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    // Update user
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Toggle active status
   */
  async toggleActive(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Soft delete (set inactive)
   */
  async delete(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent deleting the last admin
    if (user.role === UserRole.ADMIN) {
      const activeAdminCount = await this.prisma.user.count({
        where: {
          role: UserRole.ADMIN,
          isActive: true,
        },
      });

      if (activeAdminCount <= 1) {
        throw new BadRequestException(
          'Cannot deactivate the last admin user. Create another admin first.',
        );
      }
    }

    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'User deactivated successfully' };
  }

  /**
   * Hard delete (permanently remove)
   */
  async hardDelete(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent deleting the last admin
    if (user.role === UserRole.ADMIN) {
      const activeAdminCount = await this.prisma.user.count({
        where: {
          role: UserRole.ADMIN,
          isActive: true,
        },
      });

      if (activeAdminCount <= 1) {
        throw new BadRequestException(
          'Cannot delete the last admin user. Create another admin first.',
        );
      }
    }

    // Check if user has any sales
    const salesCount = await this.prisma.sale.count({
      where: { userId: id },
    });

    if (salesCount > 0) {
      throw new BadRequestException(
        'Cannot delete user with existing sales. Use soft delete instead.',
      );
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted permanently' };
  }

  /**
   * Prevent deleting yourself
   */
  async deleteWithAuth(id: number, currentUserId: number) {
    if (id === currentUserId) {
      throw new BadRequestException('You cannot delete your own account');
    }

    return this.delete(id);
  }

  async hardDeleteWithAuth(id: number, currentUserId: number) {
    if (id === currentUserId) {
      throw new BadRequestException('You cannot delete your own account');
    }

    return this.hardDelete(id);
  }
  /**
   * Logout (placeholder - session handled by frontend)
   */
  async logout() {
    return { message: 'Logged out successfully' };
  }
}

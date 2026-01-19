import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SignInDto } from './dto/signIn.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // -------------------------
  // REGISTER USER (Admin only)
  // -------------------------
  async signup(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          passwordHash,
          role: dto.role ?? 'CASHIER',
        },
      });

      const { passwordHash: _, ...safeUser } = user;
      return {
        message: 'User created successfully',
        user: safeUser,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Username already exists');
        }
      }
      throw error;
    }
  }

  // -------------------------
  // LOGIN
  // -------------------------
  async signin(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user || !user.isActive) {
      throw new ForbiddenException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordValid) {
      throw new ForbiddenException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const { passwordHash: _, ...safeUser } = user;

    return {
      message: 'Login successful',
      user: safeUser,
    };
  }

  // -------------------------
  // LOGOUT
  // -------------------------
  async logout() {
    return { message: 'Logged out successfully' };
  }

  // -------------------------
  // GET ALL USERS
  // -------------------------
  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        // Exclude passwordHash
      },
    });

    return {
      message: 'Users retrieved successfully',
      count: users.length,
      users,
    };
  }

  // -------------------------
  // GET USER BY ID
  // -------------------------
  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        // Exclude passwordHash
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      message: 'User retrieved successfully',
      user,
    };
  }

  // -------------------------
  // UPDATE USER
  // -------------------------
  async update(id: number, dto: Partial<RegisterDto>) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Prepare update data
    const updateData: any = {};

    if (dto.username) {
      updateData.username = dto.username;
    }

    if (dto.password) {
      updateData.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    if (dto.role) {
      updateData.role = dto.role;
    }

    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });

      const { passwordHash: _, ...safeUser } = user;

      return {
        message: 'User updated successfully',
        user: safeUser,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Username already exists');
        }
      }
      throw error;
    }
  }

  // -------------------------
  // TOGGLE USER ACTIVE STATUS
  // -------------------------
  async toggleActive(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    const { passwordHash: _, ...safeUser } = updatedUser;

    return {
      message: `User ${safeUser.isActive ? 'activated' : 'deactivated'} successfully`,
      user: safeUser,
    };
  }

  // -------------------------
  // DELETE USER (Soft delete by deactivating)
  // -------------------------
  async delete(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Soft delete: just deactivate
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return {
      message: 'User deleted successfully',
      userId: id,
    };
  }

  // -------------------------
  // HARD DELETE USER (Use with caution!)
  // -------------------------
  async hardDelete(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: 'User permanently deleted',
      userId: id,
    };
  }
}
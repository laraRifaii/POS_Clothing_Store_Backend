import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreInfoDto } from './dto/create.dto';
import { UpdateStoreInfoDto } from './dto/update.dto';
import { StoreInfo } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createStoreInfo(createStoreInfo: CreateStoreInfoDto) {
    const existingStore = await this.prisma.storeInfo.findFirst();

    if (existingStore) {
      throw new BadRequestException('Store information already exists.');
    }

    return this.prisma.storeInfo.create({
      data: createStoreInfo,
    });
  }

  async getStore() {
    const store = await this.prisma.storeInfo.findFirst();

    if (!store) {
      throw new NotFoundException('Store information not set');
    }

    return store;
  }

  async update(updateStoreInfoDto: UpdateStoreInfoDto) {
    const store = await this.getStore();

    return this.prisma.storeInfo.update({
      where: { id: store.id },
      data: updateStoreInfoDto,
    });
  }

  async remove() {
    const store = await this.getStore();

    return this.prisma.storeInfo.delete({
      where: { id: store.id },
    });
  }
  async uploadLogo(logoUrl: string): Promise<StoreInfo> {
    const store = await this.prisma.storeInfo.findFirst();
    if (!store) {
      throw new NotFoundException('Store info not found');
    }

    // Update only the logoUrl
    return this.prisma.storeInfo.update({
      where: { id: store.id },
      data: { logoUrl },
    });
  }
}

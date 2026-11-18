"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createStoreInfo(createStoreInfo) {
        const existingStore = await this.prisma.storeInfo.findFirst();
        if (existingStore) {
            throw new common_1.BadRequestException('Store information already exists.');
        }
        return this.prisma.storeInfo.create({
            data: createStoreInfo,
        });
    }
    async getStore() {
        const store = await this.prisma.storeInfo.findFirst();
        if (!store) {
            throw new common_1.NotFoundException('Store information not set');
        }
        return store;
    }
    async update(updateStoreInfoDto) {
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
    async uploadLogo(logoUrl) {
        const store = await this.prisma.storeInfo.findFirst();
        if (!store) {
            throw new common_1.NotFoundException('Store info not found');
        }
        return this.prisma.storeInfo.update({
            where: { id: store.id },
            data: { logoUrl },
        });
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map
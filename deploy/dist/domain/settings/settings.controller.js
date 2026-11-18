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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("./settings.service");
const create_dto_1 = require("./dto/create.dto");
const update_dto_1 = require("./dto/update.dto");
const platform_express_1 = require("@nestjs/platform-express");
const fs_1 = require("fs");
const multer_1 = require("multer");
const path_1 = require("path");
const user_role_enum_1 = require("../auth/enums/user-role.enum");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_guard_1 = require("../auth/guards/roles.guard");
const session_auth_guard_1 = require("../auth/guards/session-auth.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
const permissions_enum_1 = require("../auth/permissions/permissions.enum");
let SettingsController = class SettingsController {
    storeInfoService;
    constructor(storeInfoService) {
        this.storeInfoService = storeInfoService;
    }
    create(dto) {
        return this.storeInfoService.createStoreInfo(dto);
    }
    getStore() {
        return this.storeInfoService.getStore();
    }
    update(dto) {
        return this.storeInfoService.update(dto);
    }
    async uploadLogo(file) {
        const logoUrl = `uploads/${file.filename}`;
        return this.storeInfoService.uploadLogo(logoUrl);
    }
    remove() {
        return this.storeInfoService.remove();
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.ADMIN),
    (0, permissions_decorator_1.Permission)(permissions_enum_1.Permissions.MANAGE_SETTINGS),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dto_1.CreateStoreInfoDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.ADMIN),
    (0, permissions_decorator_1.Permission)(permissions_enum_1.Permissions.MANAGE_SETTINGS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getStore", null);
__decorate([
    (0, common_1.Patch)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.ADMIN),
    (0, permissions_decorator_1.Permission)(permissions_enum_1.Permissions.MANAGE_SETTINGS),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_dto_1.UpdateStoreInfoDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('logo'),
    (0, permissions_decorator_1.Permission)(permissions_enum_1.Permissions.MANAGE_SETTINGS),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const uploadPath = './uploads';
                if (!(0, fs_1.existsSync)(uploadPath)) {
                    (0, fs_1.mkdirSync)(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `logo-${uniqueSuffix}${ext}`;
                cb(null, filename);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            }
            else {
                cb(new Error('Only image files are allowed!'), false);
            }
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        ],
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "uploadLogo", null);
__decorate([
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "remove", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('store-info'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map
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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const signIn_dto_1 = require("./dto/signIn.dto");
const roles_decorator_1 = require("./decorators/roles.decorator");
const user_role_enum_1 = require("./enums/user-role.enum");
const roles_guard_1 = require("./guards/roles.guard");
const auth_guard_1 = require("./guards/auth.guard");
const permissions_guard_1 = require("./guards/permissions.guard");
const permissions_decorator_1 = require("./decorators/permissions.decorator");
const permissions_enum_1 = require("./permissions/permissions.enum");
const session_auth_guard_1 = require("./guards/session-auth.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async signin(dto) {
        return this.authService.signin(dto);
    }
    async logout() {
        return this.authService.logout();
    }
    signup(dto) {
        return this.authService.signup(dto);
    }
    async findAll() {
        return this.authService.findAll();
    }
    async findById(id) {
        return this.authService.findById(id);
    }
    async update(id, dto) {
        return this.authService.update(id, dto);
    }
    async toggleActive(id) {
        return this.authService.toggleActive(id);
    }
    async delete(id, req) {
        return this.authService.deleteWithAuth(id, req.user.id);
    }
    async hardDelete(id, req) {
        return this.authService.hardDeleteWithAuth(id, req.user.id);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signIn_dto_1.SignInDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
__decorate([
    (0, common_1.Post)('logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('signup'),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, auth_guard_1.AuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permission)(permissions_enum_1.Permissions.MANAGE_USERS),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MANAGER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)('users/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permission)(permissions_enum_1.Permissions.MANAGE_USERS),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('users/:id/toggle-active'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permission)(permissions_enum_1.Permissions.MANAGE_USERS),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permission)(permissions_enum_1.Permissions.MANAGE_USERS),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)('users/:id/hard'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permission)(permissions_enum_1.Permissions.MANAGE_USERS),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "hardDelete", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
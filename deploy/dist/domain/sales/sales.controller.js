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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("./sales.service");
const create_sale_dto_1 = require("./dto/create-sale.dto");
const sale_query_dto_1 = require("./dto/sale-query.dto");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../auth/enums/user-role.enum");
const session_auth_guard_1 = require("../auth/guards/session-auth.guard");
let SalesController = class SalesController {
    saleService;
    constructor(saleService) {
        this.saleService = saleService;
    }
    create(req, createSaleDto) {
        const userId = req.user.userId;
        return this.saleService.create(userId, createSaleDto);
    }
    findAll(query) {
        return this.saleService.findAll(query);
    }
    getReport(startDate, endDate) {
        return this.saleService.getSalesReport(startDate, endDate);
    }
    getDailySales(date) {
        return this.saleService.getDailySales(date);
    }
    findOne(id) {
        return this.saleService.findOne(id);
    }
    getCategoryProfit(startDate, endDate) {
        return this.saleService.getProfitByCategory(startDate, endDate);
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_sale_dto_1.CreateSaleDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sale_query_dto_1.SaleQueryDto]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('reports'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getReport", null);
__decorate([
    (0, common_1.Get)('daily'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getDailySales", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('reports/category-profit'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SalesController.prototype, "getCategoryProfit", null);
exports.SalesController = SalesController = __decorate([
    (0, common_1.Controller)('sales'),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [sales_service_1.SaleService])
], SalesController);
//# sourceMappingURL=sales.controller.js.map
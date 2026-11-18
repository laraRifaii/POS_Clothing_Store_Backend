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
exports.RefundController = void 0;
const common_1 = require("@nestjs/common");
const refund_service_1 = require("./refund.service");
const createRefund_dto_1 = require("./dto/createRefund.dto");
const refundQuery_dto_1 = require("./dto/refundQuery.dto");
const session_auth_guard_1 = require("../auth/guards/session-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../auth/enums/user-role.enum");
let RefundController = class RefundController {
    refundService;
    constructor(refundService) {
        this.refundService = refundService;
    }
    create(req, createRefundDto) {
        const userId = req.user.userId;
        return this.refundService.create(userId, createRefundDto);
    }
    findAll(query) {
        return this.refundService.findAll(query);
    }
    getStats(startDate, endDate) {
        return this.refundService.getRefundStats(startDate, endDate);
    }
    findOne(id) {
        return this.refundService.findOne(id);
    }
};
exports.RefundController = RefundController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, createRefund_dto_1.CreateRefundDto]),
    __metadata("design:returntype", void 0)
], RefundController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refundQuery_dto_1.RefundQueryDto]),
    __metadata("design:returntype", void 0)
], RefundController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RefundController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MANAGER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RefundController.prototype, "findOne", null);
exports.RefundController = RefundController = __decorate([
    (0, common_1.Controller)('refunds'),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [refund_service_1.RefundService])
], RefundController);
//# sourceMappingURL=refund.controller.js.map
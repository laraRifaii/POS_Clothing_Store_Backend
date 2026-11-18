"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_service_1 = require("./domain/auth/auth.service");
const auth_controller_1 = require("./domain/auth/auth.controller");
const auth_module_1 = require("./domain/auth/auth.module");
const config_1 = require("@nestjs/config");
const products_service_1 = require("./domain/products/products.service");
const products_controller_1 = require("./domain/products/products.controller");
const products_module_1 = require("./domain/products/products.module");
const sales_module_1 = require("./domain/sales/sales.module");
const refund_service_1 = require("./domain/refund/refund.service");
const refund_controller_1 = require("./domain/refund/refund.controller");
const refund_module_1 = require("./domain/refund/refund.module");
const settings_module_1 = require("./domain/settings/settings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            sales_module_1.SalesModule,
            refund_module_1.RefundModule,
            settings_module_1.SettingsModule,
        ],
        controllers: [app_controller_1.AppController, auth_controller_1.AuthController, products_controller_1.ProductsController, refund_controller_1.RefundController],
        providers: [app_service_1.AppService, auth_service_1.AuthService, products_service_1.ProductsService, refund_service_1.RefundService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
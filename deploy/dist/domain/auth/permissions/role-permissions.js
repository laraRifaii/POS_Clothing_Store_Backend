"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = void 0;
const permissions_enum_1 = require("./permissions.enum");
exports.ROLE_PERMISSIONS = {
    CASHIER: [
        permissions_enum_1.Permissions.CREATE_SALE,
        permissions_enum_1.Permissions.VIEW_SALES,
        permissions_enum_1.Permissions.VIEW_INVENTORY,
    ],
    MANAGER: [
        permissions_enum_1.Permissions.CREATE_SALE,
        permissions_enum_1.Permissions.VIEW_SALES,
        permissions_enum_1.Permissions.REFUND_SALE,
        permissions_enum_1.Permissions.VIEW_INVENTORY,
        permissions_enum_1.Permissions.MANAGE_INVENTORY,
        permissions_enum_1.Permissions.VIEW_REPORTS,
        permissions_enum_1.Permissions.VIEW_USERS,
        permissions_enum_1.Permissions.MANAGE_SETTINGS,
    ],
    ADMIN: [
        permissions_enum_1.Permissions.MANAGE_USERS,
        permissions_enum_1.Permissions.VIEW_USERS,
        permissions_enum_1.Permissions.CREATE_SALE,
        permissions_enum_1.Permissions.VIEW_SALES,
        permissions_enum_1.Permissions.REFUND_SALE,
        permissions_enum_1.Permissions.MANAGE_INVENTORY,
        permissions_enum_1.Permissions.VIEW_INVENTORY,
        permissions_enum_1.Permissions.VIEW_REPORTS,
        permissions_enum_1.Permissions.EXPORT_REPORTS,
        permissions_enum_1.Permissions.MANAGE_SETTINGS,
    ],
};
//# sourceMappingURL=role-permissions.js.map
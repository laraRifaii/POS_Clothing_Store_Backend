"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = exports.PERMISSIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSIONS_KEY = 'permissions';
const Permission = (...permissions) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions);
exports.Permission = Permission;
//# sourceMappingURL=permissions.decorator.js.map
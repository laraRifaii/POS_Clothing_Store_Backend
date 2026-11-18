"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionAuthGuard = void 0;
const common_1 = require("@nestjs/common");
let SessionAuthGuard = class SessionAuthGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userHeader = request.headers['x-user'];
        if (!userHeader) {
            throw new common_1.UnauthorizedException('No session found. Please login.');
        }
        try {
            const user = JSON.parse(userHeader);
            if (!user || !user.id || !user.username || !user.role) {
                throw new common_1.UnauthorizedException('Invalid session data');
            }
            if (!user.isActive) {
                throw new common_1.UnauthorizedException('User account is inactive');
            }
            request.user = {
                userId: user.id,
                username: user.username,
                role: user.role,
            };
            return true;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Invalid session format');
        }
    }
};
exports.SessionAuthGuard = SessionAuthGuard;
exports.SessionAuthGuard = SessionAuthGuard = __decorate([
    (0, common_1.Injectable)()
], SessionAuthGuard);
//# sourceMappingURL=session-auth.guard.js.map
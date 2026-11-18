import { Permissions } from '../permissions/permissions.enum';
export declare const PERMISSIONS_KEY = "permissions";
export declare const Permission: (...permissions: Permissions[]) => import("@nestjs/common").CustomDecorator<string>;

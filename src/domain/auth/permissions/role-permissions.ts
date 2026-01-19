// src/auth/permissions/role-permissions.ts
import { Permissions } from './permissions.enum';
import { UserRole } from '../enums/user-role.enum';

export const ROLE_PERMISSIONS: Record<UserRole, Permissions[]> = {
  CASHIER: [
    Permissions.CREATE_SALE,
    Permissions.VIEW_SALES,
    Permissions.VIEW_INVENTORY,
  ],
  MANAGER: [
    Permissions.CREATE_SALE,
    Permissions.VIEW_SALES,
    Permissions.REFUND_SALE,
    Permissions.VIEW_INVENTORY,
    Permissions.MANAGE_INVENTORY,
    Permissions.VIEW_REPORTS,
    Permissions.VIEW_USERS,
  ],
  ADMIN: [
    Permissions.MANAGE_USERS,
    Permissions.VIEW_USERS,
    Permissions.CREATE_SALE,
    Permissions.VIEW_SALES,
    Permissions.REFUND_SALE,
    Permissions.MANAGE_INVENTORY,
    Permissions.VIEW_INVENTORY,
    Permissions.VIEW_REPORTS,
    Permissions.EXPORT_REPORTS,
  ],
};

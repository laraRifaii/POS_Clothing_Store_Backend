// src/auth/decorators/permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Permissions } from '../permissions/permissions.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permission = (...permissions: Permissions[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

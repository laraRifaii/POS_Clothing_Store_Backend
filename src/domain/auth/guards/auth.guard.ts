// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Get user from header (for offline POS)
    const userHeader = request.headers['x-user'];
    
    if (!userHeader) {
      throw new UnauthorizedException('No authentication provided');
    }

    try {
      const user = JSON.parse(userHeader);
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid authentication');
    }
  }
}
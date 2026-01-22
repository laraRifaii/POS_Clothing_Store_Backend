import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Get x-user header
    const userHeader = request.headers['x-user'];
    
    if (!userHeader) {
      throw new UnauthorizedException('No session found. Please login.');
    }

    try {
      // Parse user from header
      const user = JSON.parse(userHeader);
      
      // Validate user object
      if (!user || !user.id || !user.username || !user.role) {
        throw new UnauthorizedException('Invalid session data');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new UnauthorizedException('User account is inactive');
      }

      // Attach user to request for use in controllers
      request.user = {
        userId: user.id,
        username: user.username,
        role: user.role,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid session format');
    }
  }
}
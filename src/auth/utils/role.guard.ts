// role.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Không yêu cầu vai trò => cho phép truy cập
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role); // Kiểm tra role
  }
}

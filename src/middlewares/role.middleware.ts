import { Response, NextFunction } from 'express';
import { Role } from '@shared/constants/roles';
import { ApiError } from '@shared/errors/ApiError';
import { AuthRequest } from './auth.middleware';

export const roleMiddleware = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      return next(ApiError.forbidden('ليس لديك صلاحية للوصول'));
    }

    next();
  };
};
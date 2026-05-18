import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@shared/utils/token';
import { ApiError } from '@shared/errors/ApiError';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('لم يتم إرسال الـ token');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw ApiError.unauthorized('الـ token غير موجود');
    }

    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    next(ApiError.unauthorized('الـ token غير صالح أو منتهي'));
  }
};

export const getAuthUser = (req: AuthRequest): { userId: string; role: string } => {
  if (!req.user) throw ApiError.unauthorized();
  return req.user;
};

export const getParam = (param: string | string[]): string => {
  return Array.isArray(param) ? param[0]! : param;
};
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@shared/errors/ApiError';
import { sendError } from '@shared/utils/response';
import { envConfig } from '@config/env';
import { logger } from '@shared/utils/logger';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    logger.warn('Validation Error', { path: req.path, message: err.message });
    sendError({
      res,
      statusCode: 400,
      message: 'بيانات غير صحيحة: ' + err.message,
    });
    return;
  }

  // Mongoose Duplicate Key Error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue ?? {})[0];
    logger.warn('Duplicate Key Error', { path: req.path, field });
    sendError({
      res,
      statusCode: 409,
      message: `القيمة دي موجودة بالفعل في الحقل: ${field}`,
    });
    return;
  }

  // Mongoose Cast Error
  if (err.name === 'CastError') {
    logger.warn('Cast Error', { path: req.path, message: err.message });
    sendError({
      res,
      statusCode: 400,
      message: 'الـ ID غير صالح',
    });
    return;
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    logger.warn('JWT Error', { path: req.path });
    sendError({
      res,
      statusCode: 401,
      message: 'الـ token غير صالح',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    logger.warn('Token Expired', { path: req.path });
    sendError({
      res,
      statusCode: 401,
      message: 'الـ token منتهي الصلاحية',
    });
    return;
  }

  // ApiError
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error('ApiError', {
        path: req.path,
        statusCode: err.statusCode,
        message: err.message,
      });
    } else {
      logger.warn('ApiError', {
        path: req.path,
        statusCode: err.statusCode,
        message: err.message,
      });
    }
    sendError({
      res,
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  // Unexpected Error
  logger.error('Unexpected Error', {
    path: req.path,
    method: req.method,
    message: err.message,
    stack: err.stack,
  });

  sendError({
    res,
    statusCode: 500,
    message: envConfig.isDevelopment
      ? err.message
      : 'حدث خطأ داخلي في السيرفر',
  });
};
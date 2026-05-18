import { Request, Response, NextFunction } from 'express';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import { ApiError } from '@shared/errors/ApiError';
import { envConfig } from '@config/env';

export const mongoSanitizeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const sanitize = (obj: Record<string, unknown>): Record<string, unknown> => {
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
        continue;
      }
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        obj[key] = sanitize(value as Record<string, unknown>);
      }
    }
    return obj;
  };

  if (req.body && typeof req.body === 'object') {
    req.body = sanitize(req.body);
  }

  next();
};

export const hppMiddleware = hpp({
  whitelist: ['status', 'type', 'priority', 'page', 'limit'],
});

// في الـ test بنعطل الـ rate limiter
const isTest = envConfig.NODE_ENV === 'test';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 99999 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'كتير أوي requests — استنى شوية وحاول تاني',
    data: null,
  },
  skip: (req: Request) => req.path === '/health' || isTest,
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 99999 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'محاولات كتير — استنى 15 دقيقة وحاول تاني',
    data: null,
  },
  skip: () => isTest,
});

export const xssProtection = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeXss(req.body);
  }
  next();
};

const sanitizeXss = (obj: Record<string, unknown>): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === 'string') {
      sanitized[key] = value
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeXss(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};
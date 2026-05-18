import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { envConfig } from '@config/env';
import { swaggerSpec } from '@config/swagger';
import { errorMiddleware } from '@middlewares/error.middleware';
import {
  mongoSanitizeMiddleware,
  hppMiddleware,
  globalRateLimiter,
  authRateLimiter,
  xssProtection,
} from '@middlewares/security.middleware';
import { logger } from '@shared/utils/logger';
import router from './routes';

const app: Application = express();

// ── Security Headers ──────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// ── CORS ──────────────────────────────────────────
app.use(
  cors({
    origin: envConfig.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Rate Limiting ─────────────────────────────────
app.use(globalRateLimiter);

// ── Parsing ───────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ── Data Sanitization ────────────────────────────
app.use(mongoSanitizeMiddleware);
app.use(xssProtection);
app.use(hppMiddleware);

// ── HTTP Logging ──────────────────────────────────
app.use((req: Request, res: Response, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    };

    if (res.statusCode >= 500) {
      logger.error('HTTP Request', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP Request', logData);
    } else {
      logger.info('HTTP Request', logData);
    }
  });

  next();
});

// ── Swagger ───────────────────────────────────────
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Manazel API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: { persistAuthorization: true },
  })
);

// ── Routes ────────────────────────────────────────
app.use('/api/v1/auth', authRateLimiter);
app.use('/api/v1', router);

// ── Health Check ──────────────────────────────────
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: envConfig.NODE_ENV,
  });
});

// ── 404 ───────────────────────────────────────────
app.use((req: Request, res: Response) => {
  logger.warn('Route Not Found', { path: req.originalUrl, method: req.method });
  res.status(404).json({
    success: false,
    message: `المسار ${req.originalUrl} غير موجود`,
    data: null,
  });
});

// ── Error Handler ─────────────────────────────────
app.use(errorMiddleware);

export default app;
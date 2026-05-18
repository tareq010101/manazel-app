import http from 'http';
import app from './app';
import { connectDB } from '@config/db';
import { initSocket } from '@config/socket';
import { envConfig } from '@config/env';
import { runCronJobs } from '@shared/utils/cron';
import { logger } from '@shared/utils/logger';

const bootstrap = async (): Promise<void> => {
  try {
    await connectDB();

    const httpServer = http.createServer(app);

    initSocket(httpServer);

    runCronJobs();

    httpServer.listen(envConfig.PORT, () => {
      logger.info(`🚀 السيرفر شغال على البورت: ${envConfig.PORT}`);
      logger.info(`🌍 البيئة: ${envConfig.NODE_ENV}`);
      logger.info(`📚 Swagger: http://localhost:${envConfig.PORT}/api/docs`);
    });

    process.on('SIGTERM', () => {
      logger.warn('🔴 جاري إيقاف السيرفر...');
      httpServer.close(() => {
        logger.info('✅ السيرفر وقف بشكل آمن');
        process.exit(0);
      });
    });

    process.on('uncaughtException', (err) => {
      logger.error('uncaughtException', { message: err.message, stack: err.stack });
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('unhandledRejection', { reason });
      process.exit(1);
    });
  } catch (error) {
    logger.error('فشل تشغيل السيرفر', { error });
    process.exit(1);
  }
};

bootstrap();
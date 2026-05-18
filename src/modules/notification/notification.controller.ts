import { Response, NextFunction } from 'express';
import { NotificationService } from './notification.service';
import { sendSuccess } from '@shared/utils/response';
import { AuthRequest, getAuthUser, getParam } from '@middlewares/auth.middleware';
import { ApiError } from '@shared/errors/ApiError';

const notificationService = new NotificationService();

export class NotificationController {
  async getAll(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await notificationService.getAll(userId, page, limit);

      sendSuccess({
        res,
        message: 'تم جلب الإشعارات بنجاح',
        data: result.notifications,
        meta: {
          total: result.total,
          unread: result.unread,
          page,
          limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const id = getParam(req.params.id);
      if (!id) return next(ApiError.badRequest('الـ id مطلوب'));

      const notification = await notificationService.markAsRead(id, userId);

      sendSuccess({
        res,
        message: 'تم تحديد الإشعار كمقروء',
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      await notificationService.markAllAsRead(userId);

      sendSuccess({
        res,
        message: 'تم تحديد كل الإشعارات كمقروءة',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const id = getParam(req.params.id);
      if (!id) return next(ApiError.badRequest('الـ id مطلوب'));

      await notificationService.deleteById(id, userId);

      sendSuccess({
        res,
        message: 'تم حذف الإشعار بنجاح',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAll(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      await notificationService.deleteAll(userId);

      sendSuccess({
        res,
        message: 'تم حذف كل الإشعارات',
      });
    } catch (error) {
      next(error);
    }
  }
}
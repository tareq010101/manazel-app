import { Response, NextFunction } from 'express';
import { MaintenanceService } from './maintenance.service';
import { sendSuccess } from '@shared/utils/response';
import {
  AuthRequest,
  getAuthUser,
  getParam,
} from '@middlewares/auth.middleware';
import {
  CreateMaintenanceDTO,
  UpdateMaintenanceStatusDTO,
} from './maintenance.dto';
import { ApiError } from '@shared/errors/ApiError';

const maintenanceService = new MaintenanceService();

export class MaintenanceController {
  async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const dto = req.body as CreateMaintenanceDTO;
      const maintenance = await maintenanceService.create(userId, dto);

      sendSuccess({
        res,
        statusCode: 201,
        message: 'تم إرسال طلب الصيانة بنجاح',
        data: maintenance,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllByLandlord(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const { status } = req.query as { status?: string };
      const requests = await maintenanceService.getAllByLandlord(userId, status);

      sendSuccess({
        res,
        message: 'تم جلب طلبات الصيانة بنجاح',
        data: requests,
        meta: { total: requests.length },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllByTenant(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const { status } = req.query as { status?: string };
      const requests = await maintenanceService.getAllByTenant(userId, status);

      sendSuccess({
        res,
        message: 'تم جلب طلباتك بنجاح',
        data: requests,
        meta: { total: requests.length },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const id = getParam(req.params.id);
      if (!id) return next(ApiError.badRequest('الـ id مطلوب'));

      const maintenance = await maintenanceService.getById(id, userId);

      sendSuccess({
        res,
        message: 'تم جلب طلب الصيانة بنجاح',
        data: maintenance,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const id = getParam(req.params.id);
      if (!id) return next(ApiError.badRequest('الـ id مطلوب'));

      const dto = req.body as UpdateMaintenanceStatusDTO;
      const maintenance = await maintenanceService.updateStatus(id, userId, dto);

      sendSuccess({
        res,
        message: 'تم تحديث حالة الطلب بنجاح',
        data: maintenance,
      });
    } catch (error) {
      next(error);
    }
  }
}
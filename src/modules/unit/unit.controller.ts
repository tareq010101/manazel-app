import { Response, NextFunction } from 'express';
import { UnitService } from './unit.service';
import { sendSuccess } from '@shared/utils/response';
import { AuthRequest, getAuthUser, getParam } from '@middlewares/auth.middleware';
import { CompanyRequest } from '@middlewares/company.middleware';
import { CreateUnitDTO, UpdateUnitDTO } from './unit.dto';
import { ApiError } from '@shared/errors/ApiError';

const unitService = new UnitService();

export class UnitController {
  async create(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const propertyId = getParam(req.params.propertyId);
      if (!propertyId) return next(ApiError.badRequest('الـ propertyId مطلوب'));

      const dto = req.body as CreateUnitDTO;
      const unit = await unitService.create(propertyId, userId, req.companyId!, dto);

      sendSuccess({ res, statusCode: 201, message: 'تم إضافة الوحدة بنجاح', data: unit });
    } catch (error) {
      next(error);
    }
  }

  async getAllByProperty(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const propertyId = getParam(req.params.propertyId);
      if (!propertyId) return next(ApiError.badRequest('الـ propertyId مطلوب'));

      const units = await unitService.getAllByProperty(propertyId, userId, req.companyId!);

      sendSuccess({
        res,
        message: 'تم جلب الوحدات بنجاح',
        data: units,
        meta: { total: units.length },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAvailable(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const units = await unitService.getAvailable(req.companyId!);

      sendSuccess({
        res,
        message: 'تم جلب الوحدات المتاحة بنجاح',
        data: units,
        meta: { total: units.length },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const id = getParam(req.params.id);
      if (!id) return next(ApiError.badRequest('الـ id مطلوب'));

      const unit = await unitService.getById(id, userId, req.companyId!);
      sendSuccess({ res, message: 'تم جلب الوحدة بنجاح', data: unit });
    } catch (error) {
      next(error);
    }
  }

  async updateById(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const id = getParam(req.params.id);
      if (!id) return next(ApiError.badRequest('الـ id مطلوب'));

      const dto = req.body as UpdateUnitDTO;
      const unit = await unitService.updateById(id, userId, req.companyId!, dto);
      sendSuccess({ res, message: 'تم تحديث الوحدة بنجاح', data: unit });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const id = getParam(req.params.id);
      if (!id) return next(ApiError.badRequest('الـ id مطلوب'));

      await unitService.deleteById(id, userId, req.companyId!);
      sendSuccess({ res, message: 'تم حذف الوحدة بنجاح' });
    } catch (error) {
      next(error);
    }
  }
}
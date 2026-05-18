import { Response, NextFunction } from 'express';
import { PropertyService } from './property.service';
import { sendSuccess } from '@shared/utils/response';
import { AuthRequest, getAuthUser, getParam } from '@middlewares/auth.middleware';
import { CreatePropertyDTO, UpdatePropertyDTO } from './property.dto';
import { ApiError } from '@shared/errors/ApiError';

const propertyService = new PropertyService();

export class PropertyController {
  async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const dto = req.body as CreatePropertyDTO;
      const property = await propertyService.create(userId, dto);

      sendSuccess({
        res,
        statusCode: 201,
        message: 'تم إضافة العقار بنجاح',
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const properties = await propertyService.getAll(userId);

      sendSuccess({
        res,
        message: 'تم جلب العقارات بنجاح',
        data: properties,
        meta: { total: properties.length },
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

      const property = await propertyService.getById(id, userId);

      sendSuccess({
        res,
        message: 'تم جلب العقار بنجاح',
        data: property,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const id = getParam(req.params.id);
      if (!id) return next(ApiError.badRequest('الـ id مطلوب'));

      const dto = req.body as UpdatePropertyDTO;
      const property = await propertyService.updateById(id, userId, dto);

      sendSuccess({
        res,
        message: 'تم تحديث العقار بنجاح',
        data: property,
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

      await propertyService.deleteById(id, userId);

      sendSuccess({
        res,
        message: 'تم حذف العقار بنجاح',
      });
    } catch (error) {
      next(error);
    }
  }
}
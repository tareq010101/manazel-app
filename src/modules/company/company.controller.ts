import { Response, NextFunction } from 'express';
import { CompanyService } from './company.service';
import { sendSuccess } from '@shared/utils/response';
import { AuthRequest, getAuthUser, getParam } from '@middlewares/auth.middleware';
import { CreateCompanyDTO, UpdateCompanyDTO } from './company.dto';

const companyService = new CompanyService();

export class CompanyController {
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const dto = req.body as CreateCompanyDTO;
      const company = await companyService.create(userId, dto);

      sendSuccess({
        res,
        statusCode: 201,
        message: 'تم إنشاء الشركة بنجاح — تريال مجاني 14 يوم',
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMy(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const company = await companyService.getByOwner(userId);

      sendSuccess({ res, message: 'تم جلب بيانات الشركة', data: company });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const id = getParam(req.params.id);
      if (!id) return next(new Error('الـ id مطلوب'));

      const dto = req.body as UpdateCompanyDTO;
      const company = await companyService.update(id, userId, dto);

      sendSuccess({ res, message: 'تم تحديث الشركة بنجاح', data: company });
    } catch (error) {
      next(error);
    }
  }
}
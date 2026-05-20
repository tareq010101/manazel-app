import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { CompanyModel } from '@modules/company/company.model';
import { ApiError } from '@shared/errors/ApiError';

export interface CompanyRequest extends AuthRequest {
  companyId?: string;
}

export const companyMiddleware = async (
  req: CompanyRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) return next(ApiError.unauthorized());

    const user = await import('@modules/user/user.model').then(
      (m) => m.UserModel.findById(req.user!.userId).select('company')
    );

    if (!user?.company) {
      return next(ApiError.forbidden('مش عندك شركة مسجلة — سجل شركتك الأول'));
    }

    const company = await CompanyModel.findById(user.company);

    if (!company || company.status !== 'active') {
      return next(ApiError.forbidden('الشركة موقوفة أو غير موجودة'));
    }

    req.companyId = user.company.toString();
    next();
  } catch (error) {
    next(error);
  }
};
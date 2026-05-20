import { Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import { sendSuccess } from '@shared/utils/response';
import { AuthRequest, getAuthUser, getParam } from '@middlewares/auth.middleware';
import { CompanyRequest } from '@middlewares/company.middleware';
import { CreatePaymentDTO } from './payment.dto';
import { ApiError } from '@shared/errors/ApiError';

const paymentService = new PaymentService();

export class PaymentController {
  async create(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const dto = req.body as CreatePaymentDTO;
      const payment = await paymentService.create(userId, req.companyId!, dto);

      sendSuccess({ res, statusCode: 201, message: 'تم إنشاء الدفعة بنجاح', data: payment });
    } catch (error) {
      next(error);
    }
  }

  async markAsPaid(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const id = getParam(req.params.id);
      if (!id) return next(ApiError.badRequest('الـ id مطلوب'));

      const payment = await paymentService.markAsPaid(id, userId, req.companyId!);
      sendSuccess({ res, message: 'تم تأكيد الدفع بنجاح', data: payment });
    } catch (error) {
      next(error);
    }
  }

  async getAllByLandlord(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const { status } = req.query as { status?: string };
      const payments = await paymentService.getAllByLandlord(userId, req.companyId!, status);

      sendSuccess({ res, message: 'تم جلب الدفعات بنجاح', data: payments, meta: { total: payments.length } });
    } catch (error) {
      next(error);
    }
  }

  async getAllByTenant(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const { status } = req.query as { status?: string };
      const payments = await paymentService.getAllByTenant(userId, req.companyId!, status);

      sendSuccess({ res, message: 'تم جلب دفعاتك بنجاح', data: payments, meta: { total: payments.length } });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const id = getParam(req.params.id);
      if (!id) return next(ApiError.badRequest('الـ id مطلوب'));

      const payment = await paymentService.getById(id, userId, req.companyId!);
      sendSuccess({ res, message: 'تم جلب الدفعة بنجاح', data: payment });
    } catch (error) {
      next(error);
    }
  }

  async getSummary(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const summary = await paymentService.getSummary(userId, req.companyId!);

      sendSuccess({ res, message: 'تم جلب ملخص الدفعات بنجاح', data: summary });
    } catch (error) {
      next(error);
    }
  }
}
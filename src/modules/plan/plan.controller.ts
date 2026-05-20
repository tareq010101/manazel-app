import { Request, Response, NextFunction } from 'express';
import { PlanService } from './plan.service';
import { sendSuccess } from '@shared/utils/response';
import { getParam } from '@middlewares/auth.middleware';

const planService = new PlanService();

export class PlanController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const plans = await planService.getAll();
      sendSuccess({ res, message: 'تم جلب الخطط بنجاح', data: plans });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = getParam(req.params.id);
      const plan = await planService.getById(id);
      sendSuccess({ res, message: 'تم جلب الخطة بنجاح', data: plan });
    } catch (error) {
      next(error);
    }
  }
}
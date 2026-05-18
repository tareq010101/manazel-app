import { Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { sendSuccess } from '@shared/utils/response';
import { AuthRequest, getAuthUser } from '@middlewares/auth.middleware';
import { UpdateUserDTO } from './user.dto';

const userService = new UserService();

export class UserController {
  async getMe(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const user = await userService.getById(userId);

      sendSuccess({
        res,
        message: 'تم جلب بيانات المستخدم',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMe(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const dto = req.body as UpdateUserDTO;
      const user = await userService.updateById(userId, dto);

      sendSuccess({
        res,
        message: 'تم تحديث البيانات بنجاح',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMe(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      await userService.deactivate(userId);

      sendSuccess({
        res,
        message: 'تم إلغاء تفعيل الحساب',
      });
    } catch (error) {
      next(error);
    }
  }
}
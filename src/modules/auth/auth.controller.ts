import { Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '@shared/utils/response';
import { RegisterDTO, LoginDTO } from './auth.dto';
import { AuthRequest, getAuthUser } from '@middlewares/auth.middleware';

const authService = new AuthService();

export class AuthController {
  async register(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = req.body as RegisterDTO;
      const result = await authService.register(dto);

      sendSuccess({
        res,
        statusCode: 201,
        message: 'تم التسجيل بنجاح',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto = req.body as LoginDTO;
      const result = await authService.login(dto);

      sendSuccess({
        res,
        message: 'تم تسجيل الدخول بنجاح',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);

      sendSuccess({
        res,
        message: 'تم تجديد الـ token بنجاح',
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      await authService.logout(userId);

      sendSuccess({
        res,
        message: 'تم تسجيل الخروج بنجاح',
      });
    } catch (error) {
      next(error);
    }
  }
}
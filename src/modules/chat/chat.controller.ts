import { Response, NextFunction } from 'express';
import { ChatService } from './chat.service';
import { sendSuccess } from '@shared/utils/response';
import { AuthRequest, getAuthUser, getParam } from '@middlewares/auth.middleware';
import { CompanyRequest } from '@middlewares/company.middleware';
import { ApiError } from '@shared/errors/ApiError';

const chatService = new ChatService();

export class ChatController {
  async getOrCreateChat(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const chat = await chatService.getOrCreateChat(userId, req.companyId!);

      sendSuccess({ res, message: 'تم جلب المحادثة بنجاح', data: chat });
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const chatId = getParam(req.params.id);
      if (!chatId) return next(ApiError.badRequest('الـ id مطلوب'));

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await chatService.getMessages(chatId, userId, req.companyId!, page, limit);

      sendSuccess({
        res,
        message: 'تم جلب الرسائل بنجاح',
        data: result.messages,
        meta: { total: result.total, pages: result.pages, page, limit },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req: CompanyRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = getAuthUser(req);
      const count = await chatService.getUnreadCount(userId, req.companyId!);

      sendSuccess({ res, message: 'تم جلب عدد الرسائل غير المقروءة', data: { unreadCount: count } });
    } catch (error) {
      next(error);
    }
  }
}
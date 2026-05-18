import { Router } from 'express';
import { ChatController } from './chat.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { roleMiddleware } from '@middlewares/role.middleware';
import { ROLES } from '@shared/constants/roles';

const router = Router();
const chatController = new ChatController();

router.use(authMiddleware);
router.use(roleMiddleware(ROLES.LANDLORD, ROLES.TENANT));

// static routes أولاً
router.get('/unread', chatController.getUnreadCount.bind(chatController));
router.get('/my', chatController.getOrCreateChat.bind(chatController));

// dynamic routes
router.get('/:id/messages', chatController.getMessages.bind(chatController));

export default router;
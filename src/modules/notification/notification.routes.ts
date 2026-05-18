import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { roleMiddleware } from '@middlewares/role.middleware';
import { ROLES } from '@shared/constants/roles';

const router = Router();
const notificationController = new NotificationController();

router.use(authMiddleware);
router.use(roleMiddleware(ROLES.LANDLORD, ROLES.TENANT));

// static routes أولاً
router.get('/', notificationController.getAll.bind(notificationController));

router.patch(
  '/read-all',
  notificationController.markAllAsRead.bind(notificationController)
);

router.delete(
  '/all',
  notificationController.deleteAll.bind(notificationController)
);

// dynamic routes
router.patch(
  '/:id/read',
  notificationController.markAsRead.bind(notificationController)
);

router.delete(
  '/:id',
  notificationController.deleteById.bind(notificationController)
);

export default router;
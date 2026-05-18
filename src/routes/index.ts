import { Router } from 'express';
import authRoutes from '@modules/auth/auth.routes';
import userRoutes from '@modules/user/user.routes';
import propertyRoutes from '@modules/property/property.routes';
import unitRoutes from '@modules/unit/unit.routes';
import contractRoutes from '@modules/contract/contract.routes';
import paymentRoutes from '@modules/payment/payment.routes';
import maintenanceRoutes from '@modules/maintenance/maintenance.routes';
import chatRoutes from '@modules/chat/chat.routes';
import notificationRoutes from '@modules/notification/notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/properties/:propertyId/units', unitRoutes);
router.use('/contracts', contractRoutes);
router.use('/payments', paymentRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/chats', chatRoutes);
router.use('/notifications', notificationRoutes);

export default router;
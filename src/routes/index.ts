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
import companyRoutes from '@modules/company/company.routes';
import planRoutes from '@modules/plan/plan.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/plans', planRoutes);
router.use('/properties', propertyRoutes);
router.use('/properties/:propertyId/units', unitRoutes);
router.use('/contracts', contractRoutes);
router.use('/payments', paymentRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/chats', chatRoutes);
router.use('/notifications', notificationRoutes);

export default router;
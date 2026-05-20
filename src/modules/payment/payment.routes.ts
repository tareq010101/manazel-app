import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { roleMiddleware } from '@middlewares/role.middleware';
import { companyMiddleware } from '@middlewares/company.middleware';
import { validate } from '@middlewares/validate.middleware';
import { ROLES } from '@shared/constants/roles';
import { createPaymentValidation } from './payment.validation';

const router = Router();
const paymentController = new PaymentController();

router.use(authMiddleware);
router.use(companyMiddleware);

router.get('/my', roleMiddleware(ROLES.TENANT), paymentController.getAllByTenant.bind(paymentController));
router.get('/summary', roleMiddleware(ROLES.LANDLORD), paymentController.getSummary.bind(paymentController));
router.post('/', roleMiddleware(ROLES.LANDLORD), validate(createPaymentValidation), paymentController.create.bind(paymentController));
router.get('/', roleMiddleware(ROLES.LANDLORD), paymentController.getAllByLandlord.bind(paymentController));
router.get('/:id', roleMiddleware(ROLES.LANDLORD, ROLES.TENANT), paymentController.getById.bind(paymentController));
router.patch('/:id/pay', roleMiddleware(ROLES.LANDLORD), paymentController.markAsPaid.bind(paymentController));

export default router;
import { Router } from 'express';
import { MaintenanceController } from './maintenance.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { roleMiddleware } from '@middlewares/role.middleware';
import { companyMiddleware } from '@middlewares/company.middleware';
import { validate } from '@middlewares/validate.middleware';
import { ROLES } from '@shared/constants/roles';
import { createMaintenanceValidation, updateMaintenanceStatusValidation } from './maintenance.validation';

const router = Router();
const maintenanceController = new MaintenanceController();

router.use(authMiddleware);
router.use(companyMiddleware);

router.get('/my', roleMiddleware(ROLES.TENANT), maintenanceController.getAllByTenant.bind(maintenanceController));
router.post('/', roleMiddleware(ROLES.TENANT), validate(createMaintenanceValidation), maintenanceController.create.bind(maintenanceController));
router.get('/', roleMiddleware(ROLES.LANDLORD), maintenanceController.getAllByLandlord.bind(maintenanceController));
router.get('/:id', roleMiddleware(ROLES.LANDLORD, ROLES.TENANT), maintenanceController.getById.bind(maintenanceController));
router.patch('/:id/status', roleMiddleware(ROLES.LANDLORD), validate(updateMaintenanceStatusValidation), maintenanceController.updateStatus.bind(maintenanceController));

export default router;
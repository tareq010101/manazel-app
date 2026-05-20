import { Router } from 'express';
import { UnitController } from './unit.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { roleMiddleware } from '@middlewares/role.middleware';
import { companyMiddleware } from '@middlewares/company.middleware';
import { validate } from '@middlewares/validate.middleware';
import { ROLES } from '@shared/constants/roles';
import { createUnitValidation, updateUnitValidation } from './unit.validation';

const router = Router({ mergeParams: true });
const unitController = new UnitController();

router.use(authMiddleware);
router.use(companyMiddleware);

router.get(
  '/available',
  roleMiddleware(ROLES.LANDLORD, ROLES.TENANT),
  unitController.getAvailable.bind(unitController)
);

router.use(roleMiddleware(ROLES.LANDLORD));

router.post('/', validate(createUnitValidation), unitController.create.bind(unitController));
router.get('/', unitController.getAllByProperty.bind(unitController));
router.get('/:id', unitController.getById.bind(unitController));
router.patch('/:id', validate(updateUnitValidation), unitController.updateById.bind(unitController));
router.delete('/:id', unitController.deleteById.bind(unitController));

export default router;
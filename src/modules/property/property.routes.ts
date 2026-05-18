import { Router } from 'express';
import { PropertyController } from './property.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { roleMiddleware } from '@middlewares/role.middleware';
import { validate } from '@middlewares/validate.middleware';
import { ROLES } from '@shared/constants/roles';
import {
  createPropertyValidation,
  updatePropertyValidation,
} from './property.validation';

const router = Router();
const propertyController = new PropertyController();

router.use(authMiddleware);
router.use(roleMiddleware(ROLES.LANDLORD));

router.post(
  '/',
  validate(createPropertyValidation),
  propertyController.create.bind(propertyController)
);

router.get('/', propertyController.getAll.bind(propertyController));

router.get('/:id', propertyController.getById.bind(propertyController));

router.patch(
  '/:id',
  validate(updatePropertyValidation),
  propertyController.updateById.bind(propertyController)
);

router.delete('/:id', propertyController.deleteById.bind(propertyController));

export default router;
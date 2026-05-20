import { Router } from 'express';
import { CompanyController } from './company.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { roleMiddleware } from '@middlewares/role.middleware';
import { validate } from '@middlewares/validate.middleware';
import { ROLES } from '@shared/constants/roles';
import { createCompanyValidation, updateCompanyValidation } from './company.validation';

const router = Router();
const companyController = new CompanyController();

router.use(authMiddleware);

router.post(
  '/',
  roleMiddleware(ROLES.LANDLORD),
  validate(createCompanyValidation),
  companyController.create.bind(companyController)
);

router.get(
  '/my',
  companyController.getMy.bind(companyController)
);

router.patch(
  '/:id',
  roleMiddleware(ROLES.LANDLORD),
  validate(updateCompanyValidation),
  companyController.update.bind(companyController)
);

export default router;
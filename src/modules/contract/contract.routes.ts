import { Router } from 'express';
import { ContractController } from './contract.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { roleMiddleware } from '@middlewares/role.middleware';
import { validate } from '@middlewares/validate.middleware';
import { ROLES } from '@shared/constants/roles';
import {
  createContractValidation,
  terminateContractValidation,
} from './contract.validation';

const router = Router();
const contractController = new ContractController();

router.use(authMiddleware);

// للمستأجر بس
router.get(
  '/my',
  roleMiddleware(ROLES.TENANT),
  contractController.getMyContract.bind(contractController)
);

// للموجر والمستأجر
router.get(
  '/:id',
  roleMiddleware(ROLES.LANDLORD, ROLES.TENANT),
  contractController.getById.bind(contractController)
);

// للموجر بس
router.post(
  '/',
  roleMiddleware(ROLES.LANDLORD),
  validate(createContractValidation),
  contractController.create.bind(contractController)
);

router.get(
  '/',
  roleMiddleware(ROLES.LANDLORD),
  contractController.getAllByLandlord.bind(contractController)
);

router.patch(
  '/:id/terminate',
  roleMiddleware(ROLES.LANDLORD),
  validate(terminateContractValidation),
  contractController.terminate.bind(contractController)
);

export default router;
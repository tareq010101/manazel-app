import { Router } from 'express';
import { ContractController } from './contract.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { roleMiddleware } from '@middlewares/role.middleware';
import { companyMiddleware } from '@middlewares/company.middleware';
import { validate } from '@middlewares/validate.middleware';
import { ROLES } from '@shared/constants/roles';
import { createContractValidation, terminateContractValidation } from './contract.validation';

const router = Router();
const contractController = new ContractController();

router.use(authMiddleware);
router.use(companyMiddleware);

router.get('/my', roleMiddleware(ROLES.TENANT), contractController.getMyContract.bind(contractController));
router.get('/:id', roleMiddleware(ROLES.LANDLORD, ROLES.TENANT), contractController.getById.bind(contractController));
router.post('/', roleMiddleware(ROLES.LANDLORD), validate(createContractValidation), contractController.create.bind(contractController));
router.get('/', roleMiddleware(ROLES.LANDLORD), contractController.getAllByLandlord.bind(contractController));
router.patch('/:id/terminate', roleMiddleware(ROLES.LANDLORD), validate(terminateContractValidation), contractController.terminate.bind(contractController));

export default router;
import { Router } from 'express';
import { PlanController } from './plan.controller';

const router = Router();
const planController = new PlanController();

router.get('/', planController.getAll.bind(planController));
router.get('/:id', planController.getById.bind(planController));

export default router;
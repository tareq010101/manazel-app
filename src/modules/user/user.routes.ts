import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { updateUserValidation } from './user.validation';

const router = Router();
const userController = new UserController();

router.use(authMiddleware);

router.get('/me', userController.getMe.bind(userController));

router.patch(
  '/me',
  validate(updateUserValidation),
  userController.updateMe.bind(userController)
);

router.delete('/me', userController.deleteMe.bind(userController));

export default router;
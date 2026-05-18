import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '@middlewares/validate.middleware';
import { authMiddleware } from '@middlewares/auth.middleware';
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} from './auth.validation';

const router = Router();
const authController = new AuthController();

router.post(
  '/register',
  validate(registerValidation),
  authController.register.bind(authController)
);

router.post(
  '/login',
  validate(loginValidation),
  authController.login.bind(authController)
);

router.post(
  '/refresh-token',
  validate(refreshTokenValidation),
  authController.refreshToken.bind(authController)
);

router.post(
  '/logout',
  authMiddleware,
  authController.logout.bind(authController)
);

export default router;
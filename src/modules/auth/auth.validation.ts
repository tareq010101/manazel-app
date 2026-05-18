import Joi from 'joi';
import { ROLES } from '@shared/constants/roles';

export const registerValidation = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'الاسم لازم يكون أكتر من حرفين',
    'string.max': 'الاسم لازم يكون أقل من 50 حرف',
    'any.required': 'الاسم مطلوب',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'الإيميل مش صحيح',
    'any.required': 'الإيميل مطلوب',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'الباسورد لازم يكون 8 أحرف على الأقل',
    'any.required': 'الباسورد مطلوب',
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'رقم الهاتف مش صحيح',
      'any.required': 'رقم الهاتف مطلوب',
    }),
  role: Joi.string()
    .valid(...Object.values(ROLES))
    .required()
    .messages({
      'any.only': 'الدور لازم يكون موجر أو مستأجر',
      'any.required': 'الدور مطلوب',
    }),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'الإيميل مش صحيح',
    'any.required': 'الإيميل مطلوب',
  }),
  password: Joi.string().required().messages({
    'any.required': 'الباسورد مطلوب',
  }),
});

export const refreshTokenValidation = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'الـ refresh token مطلوب',
  }),
});
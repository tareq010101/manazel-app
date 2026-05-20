import Joi from 'joi';

export const createCompanyValidation = Joi.object({
  name: Joi.string().max(100).required().messages({
    'any.required': 'اسم الشركة مطلوب',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'الإيميل مش صحيح',
    'any.required': 'الإيميل مطلوب',
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'رقم الهاتف مش صحيح',
      'any.required': 'رقم الهاتف مطلوب',
    }),
  address: Joi.string().optional(),
  planSlug: Joi.string()
    .valid('free', 'basic', 'pro', 'enterprise')
    .required()
    .messages({
      'any.only': 'الخطة لازم تكون free أو basic أو pro أو enterprise',
      'any.required': 'الخطة مطلوبة',
    }),
});

export const updateCompanyValidation = Joi.object({
  name: Joi.string().max(100),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  address: Joi.string().optional(),
  logo: Joi.string().optional(),
});
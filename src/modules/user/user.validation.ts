import Joi from 'joi';

export const updateUserValidation = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    'string.min': 'الاسم لازم يكون أكتر من حرفين',
    'string.max': 'الاسم لازم يكون أقل من 50 حرف',
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .messages({
      'string.pattern.base': 'رقم الهاتف مش صحيح',
    }),
});
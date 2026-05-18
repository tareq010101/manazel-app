import Joi from 'joi';

const addressSchema = Joi.object({
  street: Joi.string().required().messages({
    'any.required': 'الشارع مطلوب',
  }),
  city: Joi.string().required().messages({
    'any.required': 'المدينة مطلوبة',
  }),
  district: Joi.string().required().messages({
    'any.required': 'الحي مطلوب',
  }),
});

const addressUpdateSchema = Joi.object({
  street: Joi.string(),
  city: Joi.string(),
  district: Joi.string(),
});

export const createPropertyValidation = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'الاسم لازم يكون أكتر من حرفين',
    'string.max': 'الاسم لازم يكون أقل من 100 حرف',
    'any.required': 'اسم العقار مطلوب',
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'الوصف لازم يكون أقل من 500 حرف',
  }),
  address: addressSchema.required().messages({
    'any.required': 'العنوان مطلوب',
  }),
});

export const updatePropertyValidation = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    'string.min': 'الاسم لازم يكون أكتر من حرفين',
    'string.max': 'الاسم لازم يكون أقل من 100 حرف',
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'الوصف لازم يكون أقل من 500 حرف',
  }),
  address: addressUpdateSchema.optional(),
});
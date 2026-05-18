import Joi from 'joi';

export const createUnitValidation = Joi.object({
  unitNumber: Joi.string().required().messages({
    'any.required': 'رقم الوحدة مطلوب',
  }),
  floor: Joi.number().min(0).required().messages({
    'number.min': 'الدور لازم يكون 0 أو أكتر',
    'any.required': 'الدور مطلوب',
  }),
  rooms: Joi.number().min(1).required().messages({
    'number.min': 'لازم يكون فيه غرفة واحدة على الأقل',
    'any.required': 'عدد الغرف مطلوب',
  }),
  bathrooms: Joi.number().min(1).required().messages({
    'number.min': 'لازم يكون فيه حمام واحد على الأقل',
    'any.required': 'عدد الحمامات مطلوب',
  }),
  area: Joi.number().min(1).required().messages({
    'number.min': 'المساحة لازم تكون أكبر من 0',
    'any.required': 'المساحة مطلوبة',
  }),
  price: Joi.number().min(0).required().messages({
    'number.min': 'السعر لازم يكون 0 أو أكتر',
    'any.required': 'السعر مطلوب',
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'الوصف لازم يكون أقل من 500 حرف',
  }),
});

export const updateUnitValidation = Joi.object({
  unitNumber: Joi.string(),
  floor: Joi.number().min(0).messages({
    'number.min': 'الدور لازم يكون 0 أو أكتر',
  }),
  rooms: Joi.number().min(1).messages({
    'number.min': 'لازم يكون فيه غرفة واحدة على الأقل',
  }),
  bathrooms: Joi.number().min(1).messages({
    'number.min': 'لازم يكون فيه حمام واحد على الأقل',
  }),
  area: Joi.number().min(1).messages({
    'number.min': 'المساحة لازم تكون أكبر من 0',
  }),
  price: Joi.number().min(0).messages({
    'number.min': 'السعر لازم يكون 0 أو أكتر',
  }),
  status: Joi.string().valid('available', 'rented', 'maintenance').messages({
    'any.only': 'الحالة لازم تكون available أو rented أو maintenance',
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'الوصف لازم يكون أقل من 500 حرف',
  }),
});
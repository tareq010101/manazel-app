import Joi from 'joi';

export const createMaintenanceValidation = Joi.object({
  title: Joi.string().max(100).required().messages({
    'string.max': 'العنوان لازم يكون أقل من 100 حرف',
    'any.required': 'عنوان الطلب مطلوب',
  }),
  description: Joi.string().max(1000).required().messages({
    'string.max': 'الوصف لازم يكون أقل من 1000 حرف',
    'any.required': 'وصف المشكلة مطلوب',
  }),
  priority: Joi.string().valid('low', 'medium', 'high').optional().messages({
    'any.only': 'الأولوية لازم تكون low أو medium أو high',
  }),
});

export const updateMaintenanceStatusValidation = Joi.object({
  status: Joi.string()
    .valid('in_progress', 'completed', 'rejected')
    .required()
    .messages({
      'any.only': 'الحالة لازم تكون in_progress أو completed أو rejected',
      'any.required': 'الحالة مطلوبة',
    }),
  rejectionReason: Joi.when('status', {
    is: 'rejected',
    then: Joi.string().min(10).required().messages({
      'string.min': 'سبب الرفض لازم يكون 10 أحرف على الأقل',
      'any.required': 'سبب الرفض مطلوب عند الرفض',
    }),
    otherwise: Joi.optional(),
  }),
});
import Joi from 'joi';

export const createContractValidation = Joi.object({
  unitId: Joi.string().required().messages({
    'any.required': 'الوحدة مطلوبة',
  }),
  tenantId: Joi.string().required().messages({
    'any.required': 'المستأجر مطلوب',
  }),
  startDate: Joi.date().greater('now').required().messages({
    'date.greater': 'تاريخ البداية لازم يكون في المستقبل',
    'any.required': 'تاريخ البداية مطلوب',
  }),
  endDate: Joi.date().greater(Joi.ref('startDate')).required().messages({
    'date.greater': 'تاريخ النهاية لازم يكون بعد تاريخ البداية',
    'any.required': 'تاريخ النهاية مطلوب',
  }),
  monthlyRent: Joi.number().min(1).required().messages({
    'number.min': 'الإيجار الشهري لازم يكون أكبر من 0',
    'any.required': 'الإيجار الشهري مطلوب',
  }),
  securityDeposit: Joi.number().min(0).required().messages({
    'number.min': 'التأمين لازم يكون 0 أو أكتر',
    'any.required': 'التأمين مطلوب',
  }),
});

export const terminateContractValidation = Joi.object({
  reason: Joi.string().min(10).required().messages({
    'string.min': 'سبب الإنهاء لازم يكون 10 أحرف على الأقل',
    'any.required': 'سبب الإنهاء مطلوب',
  }),
});
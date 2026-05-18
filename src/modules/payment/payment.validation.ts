import Joi from 'joi';

export const createPaymentValidation = Joi.object({
  contractId: Joi.string().required().messages({
    'any.required': 'العقد مطلوب',
  }),
  type: Joi.string()
    .valid('rent', 'water', 'electricity', 'maintenance', 'other')
    .required()
    .messages({
      'any.only': 'نوع الدفعة لازم يكون rent أو water أو electricity أو maintenance أو other',
      'any.required': 'نوع الدفعة مطلوب',
    }),
  amount: Joi.number().min(1).required().messages({
    'number.min': 'المبلغ لازم يكون أكبر من 0',
    'any.required': 'المبلغ مطلوب',
  }),
  dueDate: Joi.date().required().messages({
    'any.required': 'تاريخ الاستحقاق مطلوب',
  }),
  note: Joi.string().max(500).optional().messages({
    'string.max': 'الملاحظة لازم تكون أقل من 500 حرف',
  }),
});
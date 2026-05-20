import mongoose, { Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'الشركة مطلوبة'],
    },
    contract: {
      type: Schema.Types.ObjectId,
      ref: 'Contract',
      required: [true, 'العقد مطلوب'],
    },
    unit: {
      type: Schema.Types.ObjectId,
      ref: 'Unit',
      required: [true, 'الوحدة مطلوبة'],
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'العقار مطلوب'],
    },
    landlord: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'الموجر مطلوب'],
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'المستأجر مطلوب'],
    },
    type: {
      type: String,
      enum: ['rent', 'water', 'electricity', 'maintenance', 'other'],
      required: [true, 'نوع الدفعة مطلوب'],
    },
    amount: {
      type: Number,
      required: [true, 'المبلغ مطلوب'],
      min: [0, 'المبلغ لازم يكون أكبر من 0'],
    },
    dueDate: {
      type: Date,
      required: [true, 'تاريخ الاستحقاق مطلوب'],
    },
    paidAt: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending',
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'الملاحظة لازم تكون أقل من 500 حرف'],
    },
  },
  { timestamps: true }
);

paymentSchema.index({ company: 1, landlord: 1, status: 1 });
paymentSchema.index({ company: 1, tenant: 1, status: 1 });
paymentSchema.index({ company: 1, dueDate: 1, status: 1 });

export const PaymentModel = mongoose.model<IPayment>('Payment', paymentSchema);
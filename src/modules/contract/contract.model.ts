import mongoose, { Schema } from 'mongoose';
import { IContract } from './contract.interface';

const contractSchema = new Schema<IContract>(
  {
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
    startDate: {
      type: Date,
      required: [true, 'تاريخ البداية مطلوب'],
    },
    endDate: {
      type: Date,
      required: [true, 'تاريخ النهاية مطلوب'],
    },
    monthlyRent: {
      type: Number,
      required: [true, 'الإيجار الشهري مطلوب'],
      min: [0, 'الإيجار لازم يكون أكبر من 0'],
    },
    securityDeposit: {
      type: Number,
      required: [true, 'التأمين مطلوب'],
      min: [0, 'التأمين لازم يكون 0 أو أكتر'],
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'terminated'],
      default: 'active',
    },
    terminatedAt: {
      type: Date,
    },
    terminationReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
contractSchema.index({ landlord: 1, status: 1 });
contractSchema.index({ tenant: 1, status: 1 });
contractSchema.index({ endDate: 1, status: 1 });

export const ContractModel = mongoose.model<IContract>('Contract', contractSchema);
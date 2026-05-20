import mongoose, { Schema } from 'mongoose';
import { ICompany } from './company.interface';

const companySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, 'اسم الشركة مطلوب'],
      trim: true,
      maxlength: [100, 'الاسم لازم يكون أقل من 100 حرف'],
    },
    email: {
      type: String,
      required: [true, 'الإيميل مطلوب'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'رقم الهاتف مطلوب'],
      trim: true,
    },
    logo: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'cancelled'],
      default: 'active',
    },
    trialEndsAt: {
      type: Date,
    },
    subscriptionEndsAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

companySchema.index({ owner: 1 });
companySchema.index({ status: 1 });

export const CompanyModel = mongoose.model<ICompany>('Company', companySchema);
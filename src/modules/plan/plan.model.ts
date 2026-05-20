import mongoose, { Schema } from 'mongoose';
import { IPlan } from './plan.interface';

const planSchema = new Schema<IPlan>(
  {
    name: {
      type: String,
      required: [true, 'اسم الخطة مطلوب'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, 'السعر مطلوب'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    interval: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    features: {
      maxProperties: { type: Number, required: true },
      maxUnits: { type: Number, required: true },
      maxUsers: { type: Number, required: true },
      hasChat: { type: Boolean, default: true },
      hasNotifications: { type: Boolean, default: true },
      hasMaintenance: { type: Boolean, default: true },
      hasReports: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const PlanModel = mongoose.model<IPlan>('Plan', planSchema);
import mongoose, { Schema } from 'mongoose';
import { IUnit } from './unit.interface';

const unitSchema = new Schema<IUnit>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'الشركة مطلوبة'],
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'العقار مطلوب'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'المالك مطلوب'],
    },
    unitNumber: {
      type: String,
      required: [true, 'رقم الوحدة مطلوب'],
      trim: true,
    },
    floor: {
      type: Number,
      required: [true, 'الدور مطلوب'],
      min: [0, 'الدور لازم يكون 0 أو أكتر'],
    },
    rooms: {
      type: Number,
      required: [true, 'عدد الغرف مطلوب'],
      min: [1, 'لازم يكون فيه غرفة واحدة على الأقل'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'عدد الحمامات مطلوب'],
      min: [1, 'لازم يكون فيه حمام واحد على الأقل'],
    },
    area: {
      type: Number,
      required: [true, 'المساحة مطلوبة'],
      min: [1, 'المساحة لازم تكون أكبر من 0'],
    },
    price: {
      type: Number,
      required: [true, 'السعر مطلوب'],
      min: [0, 'السعر لازم يكون 0 أو أكتر'],
    },
    status: {
      type: String,
      enum: ['available', 'rented', 'maintenance'],
      default: 'available',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'الوصف لازم يكون أقل من 500 حرف'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

unitSchema.index({ company: 1, property: 1 });
unitSchema.index({ company: 1, status: 1 });

export const UnitModel = mongoose.model<IUnit>('Unit', unitSchema);
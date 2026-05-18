import mongoose, { Schema } from 'mongoose';
import { IProperty } from './property.interface';

const propertySchema = new Schema<IProperty>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'المالك مطلوب'],
    },
    name: {
      type: String,
      required: [true, 'اسم العقار مطلوب'],
      trim: true,
      minlength: [2, 'الاسم لازم يكون أكتر من حرفين'],
      maxlength: [100, 'الاسم لازم يكون أقل من 100 حرف'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'الوصف لازم يكون أقل من 500 حرف'],
    },
    address: {
      street: {
        type: String,
        required: [true, 'الشارع مطلوب'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'المدينة مطلوبة'],
        trim: true,
      },
      district: {
        type: String,
        required: [true, 'الحي مطلوب'],
        trim: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PropertyModel = mongoose.model<IProperty>('Property', propertySchema);
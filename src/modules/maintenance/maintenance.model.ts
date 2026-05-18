import mongoose, { Schema } from 'mongoose';
import { IMaintenance } from './maintenance.interface';

const maintenanceSchema = new Schema<IMaintenance>(
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
    title: {
      type: String,
      required: [true, 'عنوان الطلب مطلوب'],
      trim: true,
      maxlength: [100, 'العنوان لازم يكون أقل من 100 حرف'],
    },
    description: {
      type: String,
      required: [true, 'وصف المشكلة مطلوب'],
      trim: true,
      maxlength: [1000, 'الوصف لازم يكون أقل من 1000 حرف'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const MaintenanceModel = mongoose.model<IMaintenance>(
  'Maintenance',
  maintenanceSchema
);
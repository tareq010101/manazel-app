import mongoose, { Schema } from 'mongoose';
import { IUser } from './user.interface';
import { ROLES } from '@shared/constants/roles';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'الاسم مطلوب'],
      trim: true,
      minlength: [2, 'الاسم لازم يكون أكتر من حرفين'],
      maxlength: [50, 'الاسم لازم يكون أقل من 50 حرف'],
    },
    email: {
      type: String,
      required: [true, 'الإيميل مطلوب'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'الباسورد مطلوب'],
      minlength: [8, 'الباسورد لازم يكون 8 أحرف على الأقل'],
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'رقم الهاتف مطلوب'],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: [true, 'الدور مطلوب'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    company: {
  type: Schema.Types.ObjectId,
  ref: 'Company',
},
  },
  {
    timestamps: true,
  }
);
userSchema.index({ role: 1 });

export const UserModel = mongoose.model<IUser>('User', userSchema);
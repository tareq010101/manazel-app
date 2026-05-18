import mongoose, { Schema, Document, Types } from 'mongoose';

export type NotificationType =
  | 'payment_due'
  | 'payment_received'
  | 'contract_expiring'
  | 'maintenance_update'
  | 'new_message'
  | 'contract_created'
  | 'general';

export interface INotification extends Document {
  _id: Types.ObjectId;
  recipient: Types.ObjectId;
  sender?: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'المستقبل مطلوب'],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'payment_due',
        'payment_received',
        'contract_expiring',
        'maintenance_update',
        'new_message',
        'contract_created',
        'general',
      ],
      required: [true, 'نوع الإشعار مطلوب'],
    },
    title: {
      type: String,
      required: [true, 'عنوان الإشعار مطلوب'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'محتوى الإشعار مطلوب'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); 
export const NotificationModel = mongoose.model<INotification>(
  'Notification',
  notificationSchema
);
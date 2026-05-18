import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  _id: Types.ObjectId;
  chat: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: [true, 'المحادثة مطلوبة'],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'المرسل مطلوب'],
    },
    content: {
      type: String,
      required: [true, 'محتوى الرسالة مطلوب'],
      trim: true,
      maxlength: [1000, 'الرسالة لازم تكون أقل من 1000 حرف'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ chat: 1, isRead: 1 });

export const MessageModel = mongoose.model<IMessage>('Message', messageSchema);
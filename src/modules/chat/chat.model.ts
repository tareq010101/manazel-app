import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IChat extends Document {
  _id: Types.ObjectId;
  company: Types.ObjectId;
  participants: Types.ObjectId[];
  contract: Types.ObjectId;
  lastMessage?: Types.ObjectId;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'الشركة مطلوبة'],
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    contract: {
      type: Schema.Types.ObjectId,
      ref: 'Contract',
      required: [true, 'العقد مطلوب'],
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
);

chatSchema.index({ company: 1, participants: 1 });

export const ChatModel = mongoose.model<IChat>('Chat', chatSchema);
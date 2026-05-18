import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IChat extends Document {
  _id: Types.ObjectId;
  participants: Types.ObjectId[];
  contract: Types.ObjectId;
  lastMessage?: Types.ObjectId;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
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
    lastMessageAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatModel = mongoose.model<IChat>('Chat', chatSchema);
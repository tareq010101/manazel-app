import { Document, Types } from 'mongoose';

export type PaymentType = 'rent' | 'water' | 'electricity' | 'maintenance' | 'other';
export type PaymentStatus = 'pending' | 'paid' | 'overdue';

export interface IPayment extends Document {
  _id: Types.ObjectId;
  contract: Types.ObjectId;
  unit: Types.ObjectId;
  property: Types.ObjectId;
  landlord: Types.ObjectId;
  tenant: Types.ObjectId;
  type: PaymentType;
  amount: number;
  dueDate: Date;
  paidAt?: Date;
  status: PaymentStatus;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
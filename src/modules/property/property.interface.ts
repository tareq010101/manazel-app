import { Document, Types } from 'mongoose';

export interface IProperty extends Document {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    district: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
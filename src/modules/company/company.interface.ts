import { Document, Types } from 'mongoose';

export type CompanyStatus = 'active' | 'suspended' | 'cancelled';

export interface ICompany extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  logo?: string;
  address?: string;
  owner: Types.ObjectId;
  plan: Types.ObjectId;
  status: CompanyStatus;
  trialEndsAt?: Date;
  subscriptionEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
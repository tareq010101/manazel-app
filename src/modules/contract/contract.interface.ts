import { Document, Types } from 'mongoose';

export type ContractStatus = 'active' | 'expired' | 'terminated';

export interface IContract extends Document {
  _id: Types.ObjectId;
  company: Types.ObjectId;
  unit: Types.ObjectId;
  property: Types.ObjectId;
  landlord: Types.ObjectId;
  tenant: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  securityDeposit: number;
  status: ContractStatus;
  terminatedAt?: Date;
  terminationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
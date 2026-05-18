import { Document, Types } from 'mongoose';

export type MaintenancePriority = 'low' | 'medium' | 'high';
export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export interface IMaintenance extends Document {
  _id: Types.ObjectId;
  unit: Types.ObjectId;
  property: Types.ObjectId;
  landlord: Types.ObjectId;
  tenant: Types.ObjectId;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  rejectionReason?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
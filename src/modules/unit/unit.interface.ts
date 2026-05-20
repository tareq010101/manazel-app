import { Document, Types } from 'mongoose';

export type UnitStatus = 'available' | 'rented' | 'maintenance';

export interface IUnit extends Document {
  _id: Types.ObjectId;
  company: Types.ObjectId;
  property: Types.ObjectId;
  owner: Types.ObjectId;
  unitNumber: string;
  floor: number;
  rooms: number;
  bathrooms: number;
  area: number;
  price: number;
  status: UnitStatus;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
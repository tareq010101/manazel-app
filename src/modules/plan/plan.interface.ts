import { Document, Types } from 'mongoose';

export interface IPlan extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: {
    maxProperties: number;
    maxUnits: number;
    maxUsers: number;
    hasChat: boolean;
    hasNotifications: boolean;
    hasMaintenance: boolean;
    hasReports: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
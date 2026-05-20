import { PlanModel } from './plan.model';
import { IPlan } from './plan.interface';
import { ApiError } from '@shared/errors/ApiError';

export class PlanService {
  async getAll(): Promise<IPlan[]> {
    return PlanModel.find({ isActive: true }).sort({ price: 1 });
  }

  async getById(planId: string): Promise<IPlan> {
    const plan = await PlanModel.findById(planId);
    if (!plan) throw ApiError.notFound('الخطة مش موجودة');
    return plan;
  }

  async getBySlug(slug: string): Promise<IPlan> {
    const plan = await PlanModel.findOne({ slug, isActive: true });
    if (!plan) throw ApiError.notFound('الخطة مش موجودة');
    return plan;
  }

  async seedPlans(): Promise<void> {
    const count = await PlanModel.countDocuments();
    if (count > 0) return;

    await PlanModel.insertMany([
      {
        name: 'Free',
        slug: 'free',
        price: 0,
        interval: 'monthly',
        features: {
          maxProperties: 1,
          maxUnits: 5,
          maxUsers: 2,
          hasChat: true,
          hasNotifications: true,
          hasMaintenance: false,
          hasReports: false,
        },
      },
      {
        name: 'Basic',
        slug: 'basic',
        price: 29,
        interval: 'monthly',
        features: {
          maxProperties: 5,
          maxUnits: 50,
          maxUsers: 5,
          hasChat: true,
          hasNotifications: true,
          hasMaintenance: true,
          hasReports: false,
        },
      },
      {
        name: 'Pro',
        slug: 'pro',
        price: 99,
        interval: 'monthly',
        features: {
          maxProperties: 20,
          maxUnits: 200,
          maxUsers: 20,
          hasChat: true,
          hasNotifications: true,
          hasMaintenance: true,
          hasReports: true,
        },
      },
      {
        name: 'Enterprise',
        slug: 'enterprise',
        price: 299,
        interval: 'monthly',
        features: {
          maxProperties: 999999,
          maxUnits: 999999,
          maxUsers: 999999,
          hasChat: true,
          hasNotifications: true,
          hasMaintenance: true,
          hasReports: true,
        },
      },
    ]);

    console.log('✅ تم إنشاء الخطط الافتراضية');
  }
}
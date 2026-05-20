import { CompanyModel } from './company.model';
import { ICompany } from './company.interface';
import { ApiError } from '@shared/errors/ApiError';
import { CreateCompanyDTO, UpdateCompanyDTO } from './company.dto';
import { PlanService } from '@modules/plan/plan.service';
import { UserModel } from '@modules/user/user.model';

const planService = new PlanService();

export class CompanyService {
  async create(ownerId: string, dto: CreateCompanyDTO): Promise<ICompany> {
    const existingCompany = await CompanyModel.findOne({
      $or: [{ email: dto.email }, { owner: ownerId }],
    });

    if (existingCompany) {
      throw ApiError.conflict('عندك شركة مسجلة بالفعل أو الإيميل ده مستخدم');
    }

    const plan = await planService.getBySlug(dto.planSlug);

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const company = await CompanyModel.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      owner: ownerId,
      plan: plan._id,
      trialEndsAt,
    });

    await UserModel.findByIdAndUpdate(ownerId, {
      company: company._id,
    });

    return company.populate('plan', 'name slug price features');
  }

  async getById(companyId: string): Promise<ICompany> {
    const company = await CompanyModel.findById(companyId).populate(
      'plan',
      'name slug price features'
    );

    if (!company) throw ApiError.notFound('الشركة مش موجودة');
    return company;
  }

  async getByOwner(ownerId: string): Promise<ICompany> {
    const company = await CompanyModel.findOne({ owner: ownerId }).populate(
      'plan',
      'name slug price features'
    );

    if (!company) throw ApiError.notFound('مش عندك شركة مسجلة');
    return company;
  }

  async update(companyId: string, ownerId: string, dto: UpdateCompanyDTO): Promise<ICompany> {
    const company = await CompanyModel.findOneAndUpdate(
      { _id: companyId, owner: ownerId },
      { $set: dto },
      { new: true, runValidators: true }
    ).populate('plan', 'name slug price features');

    if (!company) throw ApiError.notFound('الشركة مش موجودة');
    return company;
  }

  async checkLimit(
    companyId: string,
    resource: 'properties' | 'units' | 'users'
  ): Promise<void> {
    const company = await CompanyModel.findById(companyId).populate('plan');
    if (!company) throw ApiError.notFound('الشركة مش موجودة');

    const plan = company.plan as any;
    const limits: Record<string, number> = {
      properties: plan.features.maxProperties,
      units: plan.features.maxUnits,
      users: plan.features.maxUsers,
    };

    const counts: Record<string, () => Promise<number>> = {
      properties: async () => {
        const { PropertyModel } = await import('@modules/property/property.model');
        return PropertyModel.countDocuments({ company: companyId, isActive: true });
      },
      units: async () => {
        const { UnitModel } = await import('@modules/unit/unit.model');
        return UnitModel.countDocuments({ company: companyId, isActive: true });
      },
      users: async () => {
        return UserModel.countDocuments({ company: companyId, isActive: true });
      },
    };

    const current = await counts[resource]!();
    const limit = limits[resource]!;

    if (current >= limit) {
      throw ApiError.forbidden(
        `وصلت للحد الأقصى في خطتك (${limit} ${resource}) — قم بالترقية للاستمرار`
      );
    }
  }
}
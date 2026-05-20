import { UnitModel } from './unit.model';
import { IUnit } from './unit.interface';
import { ApiError } from '@shared/errors/ApiError';
import { CreateUnitDTO, UpdateUnitDTO } from './unit.dto';
import { PropertyModel } from '@modules/property/property.model';
import { CompanyService } from '@modules/company/company.service';

const companyService = new CompanyService();

export class UnitService {
  private async verifyPropertyOwner(
    propertyId: string,
    ownerId: string,
    companyId: string
  ): Promise<void> {
    const property = await PropertyModel.findOne({
      _id: propertyId,
      owner: ownerId,
      company: companyId,
      isActive: true,
    });

    if (!property) throw ApiError.notFound('العقار مش موجود أو مش ليك');
  }

  async create(
    propertyId: string,
    ownerId: string,
    companyId: string,
    dto: CreateUnitDTO
  ): Promise<IUnit> {
    await this.verifyPropertyOwner(propertyId, ownerId, companyId);
    await companyService.checkLimit(companyId, 'units');

    const existingUnit = await UnitModel.findOne({
      property: propertyId,
      company: companyId,
      unitNumber: dto.unitNumber,
      isActive: true,
    });

    if (existingUnit) throw ApiError.conflict('رقم الوحدة ده موجود بالفعل في العقار');

    return UnitModel.create({
      ...dto,
      property: propertyId,
      owner: ownerId,
      company: companyId,
    });
  }

  async getAllByProperty(
    propertyId: string,
    ownerId: string,
    companyId: string
  ): Promise<IUnit[]> {
    await this.verifyPropertyOwner(propertyId, ownerId, companyId);

    return UnitModel.find({
      property: propertyId,
      company: companyId,
      isActive: true,
    }).sort({ unitNumber: 1 });
  }

  async getAvailable(companyId: string): Promise<IUnit[]> {
    return UnitModel.find({
      company: companyId,
      status: 'available',
      isActive: true,
    })
      .populate('property', 'name address')
      .sort({ createdAt: -1 });
  }

  async getById(
    unitId: string,
    ownerId: string,
    companyId: string
  ): Promise<IUnit> {
    const unit = await UnitModel.findOne({
      _id: unitId,
      owner: ownerId,
      company: companyId,
      isActive: true,
    }).populate('property', 'name address');

    if (!unit) throw ApiError.notFound('الوحدة مش موجودة');
    return unit;
  }

  async updateById(
    unitId: string,
    ownerId: string,
    companyId: string,
    dto: UpdateUnitDTO
  ): Promise<IUnit> {
    const unit = await UnitModel.findOneAndUpdate(
      { _id: unitId, owner: ownerId, company: companyId, isActive: true },
      { $set: dto },
      { new: true, runValidators: true }
    );

    if (!unit) throw ApiError.notFound('الوحدة مش موجودة');
    return unit;
  }

  async deleteById(
    unitId: string,
    ownerId: string,
    companyId: string
  ): Promise<void> {
    const unit = await UnitModel.findOneAndUpdate(
      { _id: unitId, owner: ownerId, company: companyId, isActive: true },
      { isActive: false }
    );

    if (!unit) throw ApiError.notFound('الوحدة مش موجودة');
  }
}
import { UnitModel } from './unit.model';
import { IUnit } from './unit.interface';
import { ApiError } from '@shared/errors/ApiError';
import { CreateUnitDTO, UpdateUnitDTO } from './unit.dto';
import { PropertyModel } from '@modules/property/property.model';

export class UnitService {
  private async verifyPropertyOwner(
    propertyId: string,
    ownerId: string
  ): Promise<void> {
    const property = await PropertyModel.findOne({
      _id: propertyId,
      owner: ownerId,
      isActive: true,
    });

    if (!property) {
      throw ApiError.notFound('العقار مش موجود أو مش ليك');
    }
  }

  async create(
    propertyId: string,
    ownerId: string,
    dto: CreateUnitDTO
  ): Promise<IUnit> {
    await this.verifyPropertyOwner(propertyId, ownerId);

    const existingUnit = await UnitModel.findOne({
      property: propertyId,
      unitNumber: dto.unitNumber,
      isActive: true,
    });

    if (existingUnit) {
      throw ApiError.conflict('رقم الوحدة ده موجود بالفعل في العقار');
    }

    const unit = await UnitModel.create({
      ...dto,
      property: propertyId,
      owner: ownerId,
    });

    return unit;
  }

  async getAllByProperty(
    propertyId: string,
    ownerId: string
  ): Promise<IUnit[]> {
    await this.verifyPropertyOwner(propertyId, ownerId);

    const units = await UnitModel.find({
      property: propertyId,
      isActive: true,
    }).sort({ unitNumber: 1 });

    return units;
  }

  async getAvailable(): Promise<IUnit[]> {
    const units = await UnitModel.find({
      status: 'available',
      isActive: true,
    })
      .populate('property', 'name address')
      .sort({ createdAt: -1 });

    return units;
  }

  async getById(unitId: string, ownerId: string): Promise<IUnit> {
    const unit = await UnitModel.findOne({
      _id: unitId,
      owner: ownerId,
      isActive: true,
    }).populate('property', 'name address');

    if (!unit) {
      throw ApiError.notFound('الوحدة مش موجودة');
    }

    return unit;
  }

  async updateById(
    unitId: string,
    ownerId: string,
    dto: UpdateUnitDTO
  ): Promise<IUnit> {
    const unit = await UnitModel.findOneAndUpdate(
      { _id: unitId, owner: ownerId, isActive: true },
      { $set: dto },
      { new: true, runValidators: true }
    );

    if (!unit) {
      throw ApiError.notFound('الوحدة مش موجودة');
    }

    return unit;
  }

  async deleteById(unitId: string, ownerId: string): Promise<void> {
    const unit = await UnitModel.findOneAndUpdate(
      { _id: unitId, owner: ownerId, isActive: true },
      { isActive: false }
    );

    if (!unit) {
      throw ApiError.notFound('الوحدة مش موجودة');
    }
  }
}
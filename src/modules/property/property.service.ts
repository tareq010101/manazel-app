import { PropertyModel } from './property.model';
import { IProperty } from './property.interface';
import { ApiError } from '@shared/errors/ApiError';
import { CreatePropertyDTO, UpdatePropertyDTO } from './property.dto';

export class PropertyService {
  async create(ownerId: string, dto: CreatePropertyDTO): Promise<IProperty> {
    const property = await PropertyModel.create({
      ...dto,
      owner: ownerId,
    });

    return property;
  }

  async getAll(ownerId: string): Promise<IProperty[]> {
    const properties = await PropertyModel.find({
      owner: ownerId,
      isActive: true,
    }).sort({ createdAt: -1 });

    return properties;
  }

  async getById(propertyId: string, ownerId: string): Promise<IProperty> {
    const property = await PropertyModel.findOne({
      _id: propertyId,
      owner: ownerId,
      isActive: true,
    });

    if (!property) {
      throw ApiError.notFound('العقار مش موجود');
    }

    return property;
  }

  async updateById(
    propertyId: string,
    ownerId: string,
    dto: UpdatePropertyDTO
  ): Promise<IProperty> {
    const property = await PropertyModel.findOneAndUpdate(
      { _id: propertyId, owner: ownerId, isActive: true },
      { $set: dto },
      { new: true, runValidators: true }
    );

    if (!property) {
      throw ApiError.notFound('العقار مش موجود');
    }

    return property;
  }

  async deleteById(propertyId: string, ownerId: string): Promise<void> {
    const property = await PropertyModel.findOneAndUpdate(
      { _id: propertyId, owner: ownerId, isActive: true },
      { isActive: false }
    );

    if (!property) {
      throw ApiError.notFound('العقار مش موجود');
    }
  }
}
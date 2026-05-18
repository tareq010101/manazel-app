import { MaintenanceModel } from './maintenance.model';
import { IMaintenance } from './maintenance.interface';
import { ApiError } from '@shared/errors/ApiError';
import {
  CreateMaintenanceDTO,
  UpdateMaintenanceStatusDTO,
} from './maintenance.dto';
import { ContractModel } from '@modules/contract/contract.model';
import { NotificationService } from '@modules/notification/notification.service';

const notificationService = new NotificationService();

export class MaintenanceService {
  async create(
    tenantId: string,
    dto: CreateMaintenanceDTO
  ): Promise<IMaintenance> {
    const contract = await ContractModel.findOne({
      tenant: tenantId,
      status: 'active',
    });

    if (!contract) {
      throw ApiError.notFound('مفيش عقد إيجار فعال ليك');
    }

    const maintenance = await MaintenanceModel.create({
      unit: contract.unit,
      property: contract.property,
      landlord: contract.landlord,
      tenant: tenantId,
      title: dto.title,
      description: dto.description,
      priority: dto.priority ?? 'medium',
    });

    return maintenance.populate([
      { path: 'unit', select: 'unitNumber floor' },
      { path: 'property', select: 'name address' },
      { path: 'landlord', select: 'name email phone' },
    ]);
  }

  async getAllByLandlord(
    landlordId: string,
    status?: string
  ): Promise<IMaintenance[]> {
    const filter: any = { landlord: landlordId };
    if (status) filter.status = status;

    const requests = await MaintenanceModel.find(filter)
      .populate('tenant', 'name email phone')
      .populate('unit', 'unitNumber floor')
      .populate('property', 'name address')
      .sort({ createdAt: -1 });

    return requests;
  }

  async getAllByTenant(
    tenantId: string,
    status?: string
  ): Promise<IMaintenance[]> {
    const filter: any = { tenant: tenantId };
    if (status) filter.status = status;

    const requests = await MaintenanceModel.find(filter)
      .populate('unit', 'unitNumber floor')
      .populate('property', 'name address')
      .populate('landlord', 'name email phone')
      .sort({ createdAt: -1 });

    return requests;
  }

  async getById(
    maintenanceId: string,
    userId: string
  ): Promise<IMaintenance> {
    const maintenance = await MaintenanceModel.findOne({
      _id: maintenanceId,
      $or: [{ landlord: userId }, { tenant: userId }],
    })
      .populate('tenant', 'name email phone')
      .populate('landlord', 'name email phone')
      .populate('unit', 'unitNumber floor')
      .populate('property', 'name address');

    if (!maintenance) {
      throw ApiError.notFound('طلب الصيانة مش موجود');
    }

    return maintenance;
  }

  async updateStatus(
    maintenanceId: string,
    landlordId: string,
    dto: UpdateMaintenanceStatusDTO
  ): Promise<IMaintenance> {
    const maintenance = await MaintenanceModel.findOne({
      _id: maintenanceId,
      landlord: landlordId,
      status: 'pending',
    });

    if (!maintenance) {
      throw ApiError.notFound('طلب الصيانة مش موجود أو تم معالجته بالفعل');
    }

    maintenance.status = dto.status;

    if (dto.status === 'rejected' && dto.rejectionReason) {
      maintenance.rejectionReason = dto.rejectionReason;
    }

    if (dto.status === 'completed') {
      maintenance.completedAt = new Date();
    }

    await maintenance.save();

    await notificationService.notifyMaintenanceUpdate(
      maintenance.tenant.toString(),
      maintenance.title,
      dto.status
    );

    return maintenance;
  }
}
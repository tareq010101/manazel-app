import { ContractModel } from './contract.model';
import { IContract } from './contract.interface';
import { ApiError } from '@shared/errors/ApiError';
import { CreateContractDTO, TerminateContractDTO } from './contract.dto';
import { UnitModel } from '@modules/unit/unit.model';
import { UserModel } from '@modules/user/user.model';
import { ROLES } from '@shared/constants/roles';
import { NotificationService } from '@modules/notification/notification.service';

const notificationService = new NotificationService();

export class ContractService {
  async create(
    landlordId: string,
    dto: CreateContractDTO
  ): Promise<IContract> {
    const unit = await UnitModel.findOne({
      _id: dto.unitId,
      owner: landlordId,
      isActive: true,
    });

    if (!unit) {
      throw ApiError.notFound('الوحدة مش موجودة أو مش ليك');
    }

    if (unit.status !== 'available') {
      throw ApiError.conflict('الوحدة مش متاحة للإيجار دلوقتي');
    }

    const tenant = await UserModel.findOne({
      _id: dto.tenantId,
      role: ROLES.TENANT,
      isActive: true,
    });

    if (!tenant) {
      throw ApiError.notFound('المستأجر مش موجود');
    }

    const activeContract = await ContractModel.findOne({
      tenant: dto.tenantId,
      status: 'active',
    });

    if (activeContract) {
      throw ApiError.conflict('المستأجر عنده عقد إيجار فعال بالفعل');
    }

    const contract = await ContractModel.create({
      unit: dto.unitId,
      property: unit.property,
      landlord: landlordId,
      tenant: dto.tenantId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      monthlyRent: dto.monthlyRent,
      securityDeposit: dto.securityDeposit,
    });

    await UnitModel.findByIdAndUpdate(dto.unitId, { status: 'rented' });

    const landlord = await UserModel.findById(landlordId);
    if (landlord) {
      await notificationService.notifyContractCreated(
        dto.tenantId,
        landlord.name
      );
    }

    return contract.populate([
      { path: 'unit', select: 'unitNumber floor' },
      { path: 'tenant', select: 'name email phone' },
      { path: 'property', select: 'name address' },
    ]);
  }

  async getAllByLandlord(landlordId: string): Promise<IContract[]> {
    const contracts = await ContractModel.find({ landlord: landlordId })
      .populate('unit', 'unitNumber floor')
      .populate('tenant', 'name email phone')
      .populate('property', 'name address')
      .sort({ createdAt: -1 });

    return contracts;
  }

  async getMyContract(tenantId: string): Promise<IContract> {
    const contract = await ContractModel.findOne({
      tenant: tenantId,
      status: 'active',
    })
      .populate('unit', 'unitNumber floor rooms bathrooms area price')
      .populate('landlord', 'name email phone')
      .populate('property', 'name address');

    if (!contract) {
      throw ApiError.notFound('مفيش عقد إيجار فعال ليك');
    }

    return contract;
  }

  async getById(contractId: string, userId: string): Promise<IContract> {
    const contract = await ContractModel.findOne({
      _id: contractId,
      $or: [{ landlord: userId }, { tenant: userId }],
    })
      .populate('unit', 'unitNumber floor rooms bathrooms area price')
      .populate('tenant', 'name email phone')
      .populate('landlord', 'name email phone')
      .populate('property', 'name address');

    if (!contract) {
      throw ApiError.notFound('العقد مش موجود');
    }

    return contract;
  }

  async terminate(
    contractId: string,
    landlordId: string,
    dto: TerminateContractDTO
  ): Promise<IContract> {
    const contract = await ContractModel.findOne({
      _id: contractId,
      landlord: landlordId,
      status: 'active',
    });

    if (!contract) {
      throw ApiError.notFound('العقد مش موجود أو مش فعال');
    }

    contract.status = 'terminated';
    contract.terminatedAt = new Date();
    contract.terminationReason = dto.reason;
    await contract.save();

    await UnitModel.findByIdAndUpdate(contract.unit, { status: 'available' });

    return contract;
  }
}
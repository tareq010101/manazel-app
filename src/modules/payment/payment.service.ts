import { PaymentModel } from './payment.model';
import { IPayment } from './payment.interface';
import { ApiError } from '@shared/errors/ApiError';
import { CreatePaymentDTO } from './payment.dto';
import { ContractModel } from '@modules/contract/contract.model';
import { NotificationService } from '@modules/notification/notification.service';

const notificationService = new NotificationService();

export class PaymentService {
  private async verifyContract(
    contractId: string,
    landlordId: string
  ): Promise<any> {
    const contract = await ContractModel.findOne({
      _id: contractId,
      landlord: landlordId,
      status: 'active',
    });

    if (!contract) {
      throw ApiError.notFound('العقد مش موجود أو مش فعال');
    }

    return contract;
  }

  async create(
    landlordId: string,
    dto: CreatePaymentDTO
  ): Promise<IPayment> {
    const contract = await this.verifyContract(dto.contractId, landlordId);

    const payment = await PaymentModel.create({
      contract: dto.contractId,
      unit: contract.unit,
      property: contract.property,
      landlord: landlordId,
      tenant: contract.tenant,
      type: dto.type,
      amount: dto.amount,
      dueDate: dto.dueDate,
      note: dto.note,
    });

    await notificationService.notifyPaymentDue(
      contract.tenant.toString(),
      dto.amount,
      new Date(dto.dueDate)
    );

    return payment.populate([
      { path: 'tenant', select: 'name email phone' },
      { path: 'unit', select: 'unitNumber floor' },
      { path: 'property', select: 'name address' },
    ]);
  }

  async markAsPaid(
    paymentId: string,
    landlordId: string
  ): Promise<IPayment> {
    const payment = await PaymentModel.findOneAndUpdate(
      {
        _id: paymentId,
        landlord: landlordId,
        status: 'pending',
      },
      {
        status: 'paid',
        paidAt: new Date(),
      },
      { new: true }
    ).populate('tenant', 'name');

    if (!payment) {
      throw ApiError.notFound('الدفعة مش موجودة أو تم دفعها بالفعل');
    }

    const tenantName = (payment.tenant as any)?.name ?? 'المستأجر';
    await notificationService.notifyPaymentReceived(
      landlordId,
      tenantName,
      payment.amount
    );

    return payment;
  }

  async markOverdue(): Promise<void> {
    await PaymentModel.updateMany(
      {
        status: 'pending',
        dueDate: { $lt: new Date() },
      },
      { status: 'overdue' }
    );
  }

  async getAllByLandlord(
    landlordId: string,
    status?: string
  ): Promise<IPayment[]> {
    const filter: any = { landlord: landlordId };
    if (status) filter.status = status;

    const payments = await PaymentModel.find(filter)
      .populate('tenant', 'name email phone')
      .populate('unit', 'unitNumber floor')
      .populate('property', 'name address')
      .sort({ dueDate: -1 });

    return payments;
  }

  async getAllByTenant(
    tenantId: string,
    status?: string
  ): Promise<IPayment[]> {
    const filter: any = { tenant: tenantId };
    if (status) filter.status = status;

    const payments = await PaymentModel.find(filter)
      .populate('landlord', 'name email phone')
      .populate('unit', 'unitNumber floor')
      .populate('property', 'name address')
      .sort({ dueDate: -1 });

    return payments;
  }

  async getById(
    paymentId: string,
    userId: string
  ): Promise<IPayment> {
    const payment = await PaymentModel.findOne({
      _id: paymentId,
      $or: [{ landlord: userId }, { tenant: userId }],
    })
      .populate('tenant', 'name email phone')
      .populate('landlord', 'name email phone')
      .populate('unit', 'unitNumber floor')
      .populate('property', 'name address');

    if (!payment) {
      throw ApiError.notFound('الدفعة مش موجودة');
    }

    return payment;
  }

  async getSummary(landlordId: string): Promise<{
    total: number;
    paid: number;
    pending: number;
    overdue: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
  }> {
    const payments = await PaymentModel.find({ landlord: landlordId });

    const summary = payments.reduce(
      (acc, payment) => {
        acc.total++;
        acc.totalAmount += payment.amount;

        if (payment.status === 'paid') {
          acc.paid++;
          acc.paidAmount += payment.amount;
        } else if (payment.status === 'pending') {
          acc.pending++;
          acc.pendingAmount += payment.amount;
        } else if (payment.status === 'overdue') {
          acc.overdue++;
          acc.overdueAmount += payment.amount;
        }

        return acc;
      },
      {
        total: 0,
        paid: 0,
        pending: 0,
        overdue: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        overdueAmount: 0,
      }
    );

    return summary;
  }
}
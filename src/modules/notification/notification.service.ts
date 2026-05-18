import { NotificationModel, INotification, NotificationType } from './notification.model';
import { ApiError } from '@shared/errors/ApiError';
import { getIO } from '@config/socket';
import { SOCKET_EVENTS } from '@shared/constants/events';

export interface CreateNotificationDTO {
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export class NotificationService {
  async create(dto: CreateNotificationDTO): Promise<INotification> {
    const notification = await NotificationModel.create({
      recipient: dto.recipientId,
      sender: dto.senderId,
      type: dto.type,
      title: dto.title,
      message: dto.message,
      data: dto.data,
    });

    try {
      const io = getIO();
      io.to(dto.recipientId).emit(
        SOCKET_EVENTS.NEW_NOTIFICATION,
        notification
      );
    } catch {
      console.warn('⚠️ Socket.IO مش متاح');
    }

    return notification;
  }

  async getAll(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ notifications: INotification[]; total: number; unread: number }> {
    const skip = (page - 1) * limit;

    const [notifications, total, unread] = await Promise.all([
      NotificationModel.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      NotificationModel.countDocuments({ recipient: userId }),
      NotificationModel.countDocuments({ recipient: userId, isRead: false }),
    ]);

    return { notifications, total, unread };
  }

  async markAsRead(
    notificationId: string,
    userId: string
  ): Promise<INotification> {
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw ApiError.notFound('الإشعار مش موجود');
    }

    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );
  }

  async deleteById(
    notificationId: string,
    userId: string
  ): Promise<void> {
    const notification = await NotificationModel.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw ApiError.notFound('الإشعار مش موجود');
    }
  }

  async deleteAll(userId: string): Promise<void> {
    await NotificationModel.deleteMany({ recipient: userId });
  }

  // helpers بتتنادى من modules تانية
  async notifyPaymentDue(
    tenantId: string,
    amount: number,
    dueDate: Date
  ): Promise<void> {
    await this.create({
      recipientId: tenantId,
      type: 'payment_due',
      title: 'تذكير بموعد الدفع',
      message: `الدفعة بقيمة ${amount} ريال مستحقة في ${dueDate.toLocaleDateString('ar')}`,
      data: { amount, dueDate },
    });
  }

  async notifyPaymentReceived(
    landlordId: string,
    tenantName: string,
    amount: number
  ): Promise<void> {
    await this.create({
      recipientId: landlordId,
      type: 'payment_received',
      title: 'تم استلام دفعة',
      message: `تم استلام دفعة بقيمة ${amount} ريال من ${tenantName}`,
      data: { amount, tenantName },
    });
  }

  async notifyMaintenanceUpdate(
    tenantId: string,
    title: string,
    status: string
  ): Promise<void> {
    const statusMap: Record<string, string> = {
      in_progress: 'قيد التنفيذ',
      completed: 'منتهي',
      rejected: 'مرفوض',
    };

    await this.create({
      recipientId: tenantId,
      type: 'maintenance_update',
      title: 'تحديث طلب الصيانة',
      message: `طلب الصيانة "${title}" أصبح ${statusMap[status] ?? status}`,
      data: { title, status },
    });
  }

  async notifyContractCreated(
    tenantId: string,
    landlordName: string
  ): Promise<void> {
    await this.create({
      recipientId: tenantId,
      type: 'contract_created',
      title: 'عقد إيجار جديد',
      message: `تم إنشاء عقد إيجار جديد من ${landlordName}`,
      data: { landlordName },
    });
  }

  async notifyContractExpiring(
    tenantId: string,
    landlordId: string,
    daysLeft: number
  ): Promise<void> {
    await Promise.all([
      this.create({
        recipientId: tenantId,
        type: 'contract_expiring',
        title: 'عقدك قارب على الانتهاء',
        message: `عقد الإيجار الخاص بك سينتهي خلال ${daysLeft} يوم`,
        data: { daysLeft },
      }),
      this.create({
        recipientId: landlordId,
        type: 'contract_expiring',
        title: 'عقد إيجار قارب على الانتهاء',
        message: `عقد الإيجار سينتهي خلال ${daysLeft} يوم`,
        data: { daysLeft },
      }),
    ]);
  }
}
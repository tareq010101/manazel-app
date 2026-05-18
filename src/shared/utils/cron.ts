import { PaymentService } from '@modules/payment/payment.service';
import { ContractModel } from '@modules/contract/contract.model';
import { NotificationService } from '@modules/notification/notification.service';

const paymentService = new PaymentService();
const notificationService = new NotificationService();

export const runCronJobs = (): void => {
  // كل ساعة — تحديث الدفعات المتأخرة
  setInterval(async () => {
    try {
      await paymentService.markOverdue();
      console.log('✅ تم تحديث الدفعات المتأخرة');
    } catch (error) {
      console.error('❌ خطأ في تحديث الدفعات:', error);
    }
  }, 60 * 60 * 1000);

  // كل يوم — تنبيه العقود القاربة على الانتهاء
  setInterval(async () => {
    try {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const expiringContracts = await ContractModel.find({
        status: 'active',
        endDate: { $lte: thirtyDaysFromNow },
      });

      for (const contract of expiringContracts) {
        const daysLeft = Math.ceil(
          (contract.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        await notificationService.notifyContractExpiring(
          contract.tenant.toString(),
          contract.landlord.toString(),
          daysLeft
        );
      }

      console.log('✅ تم إرسال تنبيهات العقود');
    } catch (error) {
      console.error('❌ خطأ في تنبيهات العقود:', error);
    }
  }, 24 * 60 * 60 * 1000);
};
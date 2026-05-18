import { PaymentType } from './payment.interface';

export interface CreatePaymentDTO {
  contractId: string;
  type: PaymentType;
  amount: number;
  dueDate: Date;
  note?: string;
}
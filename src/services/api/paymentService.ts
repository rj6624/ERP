import { Bill, Payment, PaymentMode } from '../../types/erp';
import { ApiClient } from './apiClient';

export const paymentService = {
  async getBills(): Promise<Bill[]> {
    const res = await ApiClient.get<Bill[]>('/admin/bills');
    return res.data;
  },

  async getBillById(id: string): Promise<Bill> {
    const res = await ApiClient.get<Bill>(`/admin/bills/${id}`);
    return res.data;
  },

  async createBill(payload: {
    jobId: string;
    pricePerKg: number;
    billDate: string;
    remarks?: string;
  }): Promise<Bill> {
    const res = await ApiClient.post<Bill>('/admin/bills', payload);
    return res.data;
  },

  async getPayments(): Promise<Payment[]> {
    const res = await ApiClient.get<Payment[]>('/admin/payments');
    return res.data;
  },

  async recordPayment(payload: {
    billId: string;
    amountReceived: number;
    paymentMode: PaymentMode;
    referenceNumber: string;
    paymentDate: string;
    promiseDate?: string;
    remarks?: string;
  }): Promise<Payment> {
    const res = await ApiClient.post<Payment>('/admin/payments', payload);
    return res.data;
  },
};

import { Customer } from '../../types/erp';
import { ApiClient } from './apiClient';

export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    const res = await ApiClient.get<Customer[]>('/customers');
    return res.data;
  },

  async getCustomerById(id: string): Promise<Customer> {
    const res = await ApiClient.get<Customer>(`/customers/${id}`);
    return res.data;
  },

  async createCustomer(payload: { name: string; mobile: string; address: string }): Promise<Customer> {
    const res = await ApiClient.post<Customer>('/customers', payload);
    return res.data;
  },

  async updateCustomer(id: string, payload: Partial<Customer>): Promise<Customer> {
    const res = await ApiClient.put<Customer>(`/customers/${id}`, payload);
    return res.data;
  },

  async deleteCustomer(id: string): Promise<{ success: boolean }> {
    const res = await ApiClient.delete<{ success: boolean }>(`/customers/${id}`);
    return res.data;
  },
};

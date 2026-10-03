import { LabourRecord, LabourBindingTask, LabourOpenTask } from '../../types/erp';
import { ApiClient } from './apiClient';

export const labourService = {
  async getLabourList(): Promise<LabourRecord[]> {
    const res = await ApiClient.get<LabourRecord[]>('/labour');
    return res.data;
  },

  async getBindingTasks(): Promise<LabourBindingTask[]> {
    const res = await ApiClient.get<LabourBindingTask[]>('/labour/binding');
    return res.data;
  },

  async createBindingTask(payload: Omit<LabourBindingTask, 'id' | 'createdAt' | 'totalCharge'>): Promise<LabourBindingTask> {
    const res = await ApiClient.post<LabourBindingTask>('/labour/binding', payload);
    return res.data;
  },

  async getOpenTasks(): Promise<LabourOpenTask[]> {
    const res = await ApiClient.get<LabourOpenTask[]>('/labour/open');
    return res.data;
  },

  async createOpenTask(payload: Omit<LabourOpenTask, 'id' | 'createdAt' | 'totalCharge'>): Promise<LabourOpenTask> {
    const res = await ApiClient.post<LabourOpenTask>('/labour/open', payload);
    return res.data;
  },
};

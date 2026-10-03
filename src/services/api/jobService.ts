import { JewelleryJob, PlatingType, JobPriority } from '../../types/erp';
import { ApiClient } from './apiClient';

export const jobService = {
  async getJobs(params?: { customerId?: string; priority?: string; status?: string }): Promise<JewelleryJob[]> {
    const query = new URLSearchParams(params as any).toString();
    const endpoint = query ? `/jobs?${query}` : '/jobs';
    const res = await ApiClient.get<JewelleryJob[]>(endpoint);
    return res.data;
  },

  async getJobById(id: string): Promise<JewelleryJob> {
    const res = await ApiClient.get<JewelleryJob>(`/jobs/${id}`);
    return res.data;
  },

  async createInward(payload: {
    customerId: string;
    inwardWeight: number;
    platingType: PlatingType;
    priority: JobPriority;
    inwardDate: string;
    itemPhotoUrl?: string;
    scalePhotoUrl?: string;
    inwardRemarks?: string;
  }): Promise<JewelleryJob> {
    const res = await ApiClient.post<JewelleryJob>('/jobs/inward', payload);
    return res.data;
  },

  async processOutward(payload: {
    jobId: string;
    outwardWeight: number;
    outwardDate: string;
    outwardPhotoUrl?: string;
    outwardRemarks?: string;
  }): Promise<{ success: boolean; job: JewelleryJob; platingPerKg: number }> {
    const res = await ApiClient.post<{ success: boolean; job: JewelleryJob; platingPerKg: number }>(
      '/jobs/outward',
      payload
    );
    return res.data;
  },

  async getFastForwardQueue(): Promise<JewelleryJob[]> {
    const res = await ApiClient.get<JewelleryJob[]>('/jobs/fast-forward');
    return res.data;
  },
};

import { ApiClient } from './apiClient';

export interface WeightReportRow {
  date: string;
  inwardKg: number;
  outwardKg: number;
  platingPerKg: number;
  jobCount: number;
}

export interface PlatingSummaryReport {
  overallAvgPlatingPerKg: number;
  totalInwardWeight: number;
  totalOutwardWeight: number;
  platingGainKg: number;
}

export const reportService = {
  async getWeightReports(params?: { startDate?: string; endDate?: string }): Promise<WeightReportRow[]> {
    const query = new URLSearchParams(params as any).toString();
    const endpoint = query ? `/reports/weight?${query}` : '/reports/weight';
    const res = await ApiClient.get<WeightReportRow[]>(endpoint);
    return res.data;
  },

  async getPlatingSummary(): Promise<PlatingSummaryReport> {
    const res = await ApiClient.get<PlatingSummaryReport>('/reports/plating-summary');
    return res.data;
  },

  async getOperationalReport(category: string, params?: Record<string, any>): Promise<any[]> {
    const query = new URLSearchParams(params as any).toString();
    const endpoint = query ? `/reports/${category}?${query}` : `/reports/${category}`;
    const res = await ApiClient.get<any[]>(endpoint);
    return res.data;
  },
};

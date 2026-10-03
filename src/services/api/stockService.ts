import { ChemicalItem, AcidItem, MetalItem, TarTransaction, ScrapRecord } from '../../types/erp';
import { ApiClient } from './apiClient';

export const stockService = {
  // Chemical
  async getChemicals(): Promise<ChemicalItem[]> {
    const res = await ApiClient.get<ChemicalItem[]>('/stock/chemicals');
    return res.data;
  },

  async updateChemicalStock(id: string, quantityChange: number, type: 'Stock In' | 'Usage'): Promise<ChemicalItem> {
    const res = await ApiClient.post<ChemicalItem>(`/stock/chemicals/${id}/transaction`, { quantityChange, type });
    return res.data;
  },

  // Acid
  async getAcids(): Promise<AcidItem[]> {
    const res = await ApiClient.get<AcidItem[]>('/stock/acids');
    return res.data;
  },

  async updateAcidStock(id: string, quantityChange: number, type: 'Stock In' | 'Usage'): Promise<AcidItem> {
    const res = await ApiClient.post<AcidItem>(`/stock/acids/${id}/transaction`, { quantityChange, type });
    return res.data;
  },

  // Metal
  async getMetals(): Promise<MetalItem[]> {
    const res = await ApiClient.get<MetalItem[]>('/stock/metals');
    return res.data;
  },

  async updateMetalStock(id: string, quantityChange: number, type: 'Stock In' | 'Usage'): Promise<MetalItem> {
    const res = await ApiClient.post<MetalItem>(`/stock/metals/${id}/transaction`, { quantityChange, type });
    return res.data;
  },

  // Tar
  async getTarTransactions(): Promise<TarTransaction[]> {
    const res = await ApiClient.get<TarTransaction[]>('/stock/tar');
    return res.data;
  },

  async addTarTransaction(payload: Omit<TarTransaction, 'id'>): Promise<TarTransaction> {
    const res = await ApiClient.post<TarTransaction>('/stock/tar', payload);
    return res.data;
  },

  // Scrap
  async getScrapRecords(): Promise<ScrapRecord[]> {
    const res = await ApiClient.get<ScrapRecord[]>('/stock/scrap');
    return res.data;
  },

  async addScrapRecord(payload: Omit<ScrapRecord, 'id'>): Promise<ScrapRecord> {
    const res = await ApiClient.post<ScrapRecord>('/stock/scrap', payload);
    return res.data;
  },
};

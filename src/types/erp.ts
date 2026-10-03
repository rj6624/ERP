export type PlatingType =
  | 'White Gold'
  | 'Golden Brass'
  | 'Golden Silver'
  | 'Antic Gold'
  | 'Teen Gold'
  | 'Rose Gold'
  | 'Damar Gold'
  | 'Dal Chhol Gold';

export type JobPriority = 'Regular' | 'Fast Forward';

export type JobStatus =
  | 'Inward Received'
  | 'In Process'
  | 'Ready for Outward'
  | 'Outward Completed'
  | 'Cancelled';

export type LabourType = 'Binding' | 'Open' | 'Polishing' | 'General';

export type LabourStatus = 'Pending' | 'In Progress' | 'Completed';

export type StockStatus = 'Healthy' | 'Low Stock' | 'Out of Stock';

export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Pending' | 'Promise Date Due';

export type PaymentMode = 'Cash' | 'Bank Transfer' | 'UPI' | 'Cheque' | 'Other';

export type UserRole = 'Admin' | 'Manager' | 'Operator' | 'Labour User';

export type UserStatus = 'Active' | 'Inactive';

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  totalJobs: number;
  pendingJobs: number;
  completedJobs: number;
  lastJobDate: string;
  totalInwardWeight: number; // in kg
  totalOutwardWeight: number; // in kg
  lastIdSeq: number; // internal sequence e.g., 3 for DARSHAN3
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface JewelleryJob {
  id: string; // e.g. "DARSHAN1"
  customerId: string;
  customerName: string;
  priority: JobPriority;
  platingType: PlatingType;
  status: JobStatus;
  
  // Inward details
  inwardWeight: number; // strictly 3 decimals in kg (e.g. 10.250)
  inwardDate: string; // ISO string
  itemPhotoUrl?: string;
  scalePhotoUrl?: string;
  inwardRemarks?: string;

  // Labour details
  labourId?: string;
  labourName?: string;
  bindingStatus?: LabourStatus;
  bindingStartDate?: string;
  bindingEndDate?: string;
  bindingTarUsed?: number; // in grams
  openStatus?: LabourStatus;
  openStartDate?: string;
  openEndDate?: string;
  openTarUsed?: number;

  // Outward details
  outwardWeight?: number; // strictly 3 decimals in kg (e.g. 10.800)
  platingPerKg?: number; // in g/kg calculated: ((outward - inward) / inward) * 1000
  outwardDate?: string; // ISO string
  outwardPhotoUrl?: string;
  outwardRemarks?: string;

  // Billing & Payment references
  billId?: string;
  billNumber?: string;
  billAmount?: number;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  pendingAmount: number;

  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface LabourRecord {
  id: string;
  name: string;
  mobile: string;
  address: string;
  labourType: LabourType;
  status: 'Active' | 'Inactive';
  defaultChargeRate: number; // per kg or per job (₹)
  activeJobs: number;
  completedJobs: number;
  totalCharges: number;
  createdAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface LabourBindingTask {
  id: string;
  jobId: string;
  customerName: string;
  labourId: string;
  labourName: string;
  inwardWeight: number;
  startDate: string;
  endDate?: string;
  status: LabourStatus;
  tarUsed: number; // g
  tarUnit: string;
  chargeRate: number;
  totalCharge: number;
  remarks?: string;
  createdAt: string;
}

export interface LabourOpenTask {
  id: string;
  jobId: string;
  customerName: string;
  labourId: string;
  labourName: string;
  weight: number;
  startDate: string;
  endDate?: string;
  status: LabourStatus;
  tarUsed: number; // g
  chargeRate: number;
  totalCharge: number;
  remarks?: string;
  createdAt: string;
}

export interface ChemicalItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  unit: string;
  openingStock: number;
  currentStock: number;
  minimumStock: number;
  supplier: string;
  rate: number;
  status: StockStatus;
  lastUpdated: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface AcidItem {
  id: string;
  name: string;
  brand: string;
  unit: string;
  openingStock: number;
  currentStock: number;
  minimumStock: number;
  supplier: string;
  rate: number;
  status: StockStatus;
  lastUpdated: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface MetalItem {
  id: string;
  name: string;
  purity: string; // e.g. "99.9% Pure Silver", "24K Fine Gold"
  unit: string;
  openingStock: number;
  currentStock: number;
  minimumStock: number;
  supplier: string;
  rate: number; // ₹ per g/kg
  status: StockStatus;
  lastUpdated: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface TarTransaction {
  id: string;
  date: string;
  type: 'Purchase' | 'Usage' | 'Adjustment';
  quantity: number; // kg or g
  unit: string;
  labourName?: string;
  jobId?: string;
  rate: number;
  totalAmount: number;
  remarks?: string;
}

export interface ScrapRecord {
  id: string;
  date: string;
  sourceCustomer: string;
  jobId?: string;
  scrapType: string;
  grossWeight: number; // kg (3 decimals)
  recoverableWeight: number; // kg
  nonRecoverableWeight: number; // kg
  metalType: string;
  purity: string;
  status: 'Pending Recovery' | 'Recovered' | 'Disposed';
  remarks?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface Bill {
  id: string;
  billNumber: string; // e.g. "BILL-1025"
  customerId: string;
  customerName: string;
  jobId: string;
  billDate: string;
  inwardWeight: number; // 3 decimals (kg)
  pricePerKg: number; // ₹
  totalAmount: number; // read-only: inwardWeight * pricePerKg
  amountPaid: number;
  pendingAmount: number;
  paymentStatus: PaymentStatus;
  remarks?: string;
  createdAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface Payment {
  id: string;
  paymentNumber: string; // e.g. "PAY-0042"
  customerId: string;
  customerName: string;
  billId: string;
  billNumber: string;
  jobId?: string;
  paymentDate: string;
  amountReceived: number;
  paymentMode: PaymentMode;
  referenceNumber: string;
  promiseDate?: string;
  remarks?: string;
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  createdAt: string;
}

export interface AlertNotification {
  id: string;
  type: 'FAST_FORWARD' | 'LOW_STOCK' | 'PAYMENT_PROMISE' | 'OVERDUE_JOB' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  severity: 'info' | 'warning' | 'urgent';
  targetModule: string;
  targetId?: string;
}

export interface ActivityTimelineItem {
  id: string;
  jobId?: string;
  title: string;
  description: string;
  timestamp: string;
  userName: string;
  type: 'created' | 'labour' | 'processing' | 'outward' | 'billing' | 'payment' | 'alert' | 'stock';
}

export interface RecycleBinItem {
  id: string;
  originalId: string;
  module: 'Customer' | 'Job' | 'Labour' | 'Stock' | 'Bill';
  recordName: string;
  deletedBy: string;
  deletedDate: string;
  summary: string;
  data: any;
}

export interface SystemConfig {
  overduePendingThresholdDays: number; // default 5 days
  currencySymbol: string; // "₹"
  weightUnit: string; // "kg"
  platingUnit: string; // "g/kg"
}

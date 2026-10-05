export type NavigationPage =
  | 'dashboard'
  // Customer section
  | 'customers'
  | 'customer_detail'
  | 'inward_list'
  | 'create_inward'
  | 'inward_detail'
  | 'outward_list'
  | 'create_outward'
  | 'job_detail'
  | 'fast_forward'
  // Labour section
  | 'labour_list'
  | 'labour_binding'
  | 'labour_open'
  | 'labour_reports'
  // Stock section
  | 'stock_chemical'
  | 'stock_acid'
  | 'stock_metal'
  | 'stock_tar'
  | 'stock_scrap'
  | 'stock_reports'
  // Billing section
  | 'bills_list'
  | 'bill_detail'
  // Payments section (Admin only)
  | 'payments_dashboard'
  | 'payments_received'
  | 'payments_pending'
  | 'payments_promise_date'
  // Reports section
  | 'reports_center'
  | 'report_customer'
  | 'report_jobs'
  | 'report_weight'
  | 'report_labour'
  | 'report_stock'
  // Alerts
  | 'alerts'
  // Administration section (Admin only)
  | 'admin_users'
  | 'admin_permissions'
  | 'admin_alerts'
  | 'admin_recycle_bin';

export interface BreadcrumbItem {
  label: string;
  page?: NavigationPage;
  path?: string;
  params?: Record<string, string>;
  onClick?: () => void;
}

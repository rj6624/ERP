import { NavigationPage } from '../types/navigation';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: '/customers/:id',
  INWARD_LIST: '/inward',
  CREATE_INWARD: '/inward/new',
  OUTWARD_LIST: '/outward',
  CREATE_OUTWARD: '/outward/new',
  JOB_DETAIL: '/jobs/:id',
  FAST_FORWARD: '/fast-forward',
  LABOUR_LIST: '/labour',
  LABOUR_BINDING: '/labour/binding',
  LABOUR_OPEN: '/labour/open',
  STOCK_CHEMICAL: '/stock/chemicals',
  STOCK_ACID: '/stock/acids',
  STOCK_METAL: '/stock/metals',
  STOCK_TAR: '/stock/tar',
  STOCK_SCRAP: '/stock/scrap',
  REPORTS: '/reports',
  REPORTS_CATEGORY: '/reports/:category',
  ALERTS: '/alerts',
  // Admin only
  ADMIN_PAYMENTS_DASHBOARD: '/admin/payments',
  ADMIN_PAYMENTS_RECEIVED: '/admin/payments/received',
  ADMIN_PAYMENTS_PENDING: '/admin/payments/pending',
  ADMIN_PAYMENTS_PROMISE_DATE: '/admin/payments/promise-dates',
  ADMIN_BILLS: '/admin/bills',
  ADMIN_BILL_DETAIL: '/admin/bills/:id',
  ADMIN_USERS: '/admin/users',
  ADMIN_PERMISSIONS: '/admin/permissions',
  ADMIN_RECYCLE_BIN: '/admin/recycle-bin',
} as const;

export const pageToPath = (page: NavigationPage, id?: string): string => {
  switch (page) {
    case 'dashboard':
      return ROUTES.DASHBOARD;
    case 'customers':
      return ROUTES.CUSTOMERS;
    case 'customer_detail':
      return id ? `/customers/${id}` : ROUTES.CUSTOMERS;
    case 'inward_list':
      return ROUTES.INWARD_LIST;
    case 'create_inward':
      return ROUTES.CREATE_INWARD;
    case 'outward_list':
      return ROUTES.OUTWARD_LIST;
    case 'create_outward':
      return ROUTES.CREATE_OUTWARD;
    case 'job_detail':
      return id ? `/jobs/${id}` : ROUTES.INWARD_LIST;
    case 'fast_forward':
      return ROUTES.FAST_FORWARD;
    case 'labour_list':
      return ROUTES.LABOUR_LIST;
    case 'labour_binding':
      return ROUTES.LABOUR_BINDING;
    case 'labour_open':
      return ROUTES.LABOUR_OPEN;
    case 'stock_chemical':
      return ROUTES.STOCK_CHEMICAL;
    case 'stock_acid':
      return ROUTES.STOCK_ACID;
    case 'stock_metal':
      return ROUTES.STOCK_METAL;
    case 'stock_tar':
      return ROUTES.STOCK_TAR;
    case 'stock_scrap':
      return ROUTES.STOCK_SCRAP;
    case 'reports_center':
      return ROUTES.REPORTS;
    case 'report_customer':
      return '/reports/customer';
    case 'report_jobs':
      return '/reports/job';
    case 'report_weight':
      return '/reports/weight';
    case 'report_labour':
      return '/reports/labour';
    case 'report_stock':
      return '/reports/stock';
    case 'labour_reports':
      return '/reports/labour';
    case 'stock_reports':
      return '/reports/stock';
    case 'alerts':
    case 'admin_alerts':
      return ROUTES.ALERTS;
    case 'payments_dashboard':
      return ROUTES.ADMIN_PAYMENTS_DASHBOARD;
    case 'payments_received':
      return ROUTES.ADMIN_PAYMENTS_RECEIVED;
    case 'payments_pending':
      return ROUTES.ADMIN_PAYMENTS_PENDING;
    case 'payments_promise_date':
      return ROUTES.ADMIN_PAYMENTS_PROMISE_DATE;
    case 'bills_list':
      return ROUTES.ADMIN_BILLS;
    case 'bill_detail':
      return id ? `/admin/bills/${id}` : ROUTES.ADMIN_BILLS;
    case 'admin_users':
      return ROUTES.ADMIN_USERS;
    case 'admin_permissions':
      return ROUTES.ADMIN_PERMISSIONS;
    case 'admin_recycle_bin':
      return ROUTES.ADMIN_RECYCLE_BIN;
    default:
      return ROUTES.DASHBOARD;
  }
};

export const pathToPage = (path: string): NavigationPage => {
  if (path === '/' || path === '/dashboard') return 'dashboard';
  if (path === '/customers') return 'customers';
  if (path.startsWith('/customers/')) return 'customer_detail';
  if (path === '/inward') return 'inward_list';
  if (path === '/inward/new') return 'create_inward';
  if (path === '/outward') return 'outward_list';
  if (path === '/outward/new') return 'create_outward';
  if (path.startsWith('/jobs/')) return 'job_detail';
  if (path === '/fast-forward') return 'fast_forward';
  if (path === '/labour') return 'labour_list';
  if (path === '/labour/binding') return 'labour_binding';
  if (path === '/labour/open') return 'labour_open';
  if (path === '/stock/chemicals') return 'stock_chemical';
  if (path === '/stock/acids') return 'stock_acid';
  if (path === '/stock/metals') return 'stock_metal';
  if (path === '/stock/tar') return 'stock_tar';
  if (path === '/stock/scrap') return 'stock_scrap';
  if (path.startsWith('/reports')) return 'reports_center';
  if (path === '/alerts') return 'alerts';
  if (path === '/admin/payments') return 'payments_dashboard';
  if (path === '/admin/payments/received') return 'payments_received';
  if (path === '/admin/payments/pending') return 'payments_pending';
  if (path === '/admin/payments/promise-dates') return 'payments_promise_date';
  if (path === '/admin/bills') return 'bills_list';
  if (path.startsWith('/admin/bills/')) return 'bill_detail';
  if (path === '/admin/users') return 'admin_users';
  if (path === '/admin/permissions') return 'admin_permissions';
  if (path === '/admin/recycle-bin') return 'admin_recycle_bin';
  return 'dashboard';
};

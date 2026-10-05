import { Button } from '../ui/Primitives';
import React, { useState, useRef, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Plus,
  Bell,
  
  ChevronRight,
  ShieldCheck,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
  CreditCard,
  UserCog,
} from 'lucide-react';
import { NotificationsPopover } from '../common/NotificationsPopover';
import { RoleSwitcherDropdown } from './RoleSwitcherDropdown';

interface BreadcrumbItem {
  label: string;
  page?: any;
  onClick?: () => void;
}

interface AdminHeaderProps {
  collapsed: boolean;
  setCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, setCollapsed }) => {
  const {
    currentPage,
    setCurrentPage,
    setIsSearchModalOpen,
    setIsQuickActionOpen,
    selectedCustomerId,
    selectedJobId,
    selectedBillId,
    navigateToCustomer,
    navigateToJob,
    navigateToBill,
    customers,
    alerts,
    currentUser,
  } = useERP();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  // Breadcrumbs title helper
  const getPageInfo = (): { title: string; subtitle: string; crumbs: BreadcrumbItem[] } => {
    switch (currentPage) {
      case 'dashboard':
        return {
          title: 'Operational Dashboard',
          subtitle: 'Real-time plating metrics & revenue',
          crumbs: [{ label: 'Dashboard', page: 'dashboard' }],
        };
      case 'customers':
        return {
          title: 'Customer Master & Accounts',
          subtitle: 'Customer directory & profiles',
          crumbs: [
            { label: 'Customer', page: 'customers' },
            { label: 'Customers', page: 'customers' },
          ],
        };
      case 'customer_detail': {
        const cust = customers.find((c) => c.id === selectedCustomerId);
        return {
          title: cust ? cust.name : 'Customer Profile',
          subtitle: 'Profile, job history & ledger',
          crumbs: [
            { label: 'Customer', page: 'customers' },
            { label: 'Customers', page: 'customers' },
            {
              label: cust ? cust.name : (selectedCustomerId || 'Detail'),
              page: 'customer_detail',
              onClick: () => selectedCustomerId && navigateToCustomer(selectedCustomerId),
            },
          ],
        };
      }
      case 'inward_list':
        return {
          title: 'Customer Inward Receipts',
          subtitle: 'Jewellery receipt registry',
          crumbs: [
            { label: 'Customer', page: 'customers' },
            { label: 'Inward', page: 'inward_list' },
          ],
        };
      case 'create_inward':
        return {
          title: 'Create Customer Inward',
          subtitle: 'Auto job ID generator',
          crumbs: [
            { label: 'Customer', page: 'customers' },
            { label: 'Inward', page: 'inward_list' },
            { label: 'New Inward', page: 'create_inward' },
          ],
        };
      case 'outward_list':
        return {
          title: 'Customer Outward Dispatches',
          subtitle: 'Completed job dispatches',
          crumbs: [
            { label: 'Customer', page: 'customers' },
            { label: 'Outward', page: 'outward_list' },
          ],
        };
      case 'create_outward':
        return {
          title: 'Process Customer Outward',
          subtitle: 'Plating calculation & verification',
          crumbs: [
            { label: 'Customer', page: 'customers' },
            { label: 'Outward', page: 'outward_list' },
            { label: 'Process', page: 'create_outward' },
          ],
        };
      case 'job_detail':
        return {
          title: 'Job Lifecycle Traceability',
          subtitle: `Job ID: ${selectedJobId || 'JOB-1025'}`,
          crumbs: [
            { label: 'Operations', page: 'dashboard' },
            { label: 'Jobs', page: 'inward_list' },
            {
              label: selectedJobId || 'Detail',
              page: 'job_detail',
              onClick: () => selectedJobId && navigateToJob(selectedJobId),
            },
          ],
        };
      case 'fast_forward':
        return {
          title: 'Fast Forward Priority Queue',
          subtitle: 'High urgency processing jobs',
          crumbs: [
            { label: 'Operations', page: 'dashboard' },
            { label: 'Fast Forward Queue', page: 'fast_forward' },
          ],
        };
      case 'labour_list':
        return {
          title: 'Labour Master Directory',
          subtitle: 'Artisan directory & active benches',
          crumbs: [
            { label: 'Labour', page: 'labour_list' },
            { label: 'Labour Master', page: 'labour_list' },
          ],
        };
      case 'labour_binding':
        return {
          title: 'Labour Binding & Tar Usage',
          subtitle: 'Wire binding logs & tar consumption',
          crumbs: [
            { label: 'Labour', page: 'labour_list' },
            { label: 'Binding Tasks', page: 'labour_binding' },
          ],
        };
      case 'labour_open':
        return {
          title: 'Labour Untying Operations',
          subtitle: 'Open work piece tracking',
          crumbs: [
            { label: 'Labour', page: 'labour_list' },
            { label: 'Open Tasks', page: 'labour_open' },
          ],
        };
      case 'stock_chemical':
        return {
          title: 'Chemical Stock Inventory',
          subtitle: 'Bath tanks & chemical replenishment',
          crumbs: [
            { label: 'Stock', page: 'stock_chemical' },
            { label: 'Chemicals', page: 'stock_chemical' },
          ],
        };
      case 'stock_acid':
        return {
          title: 'Acid Stock Inventory',
          subtitle: 'Acid drums & titration logs',
          crumbs: [
            { label: 'Stock', page: 'stock_chemical' },
            { label: 'Acids', page: 'stock_acid' },
          ],
        };
      case 'stock_metal':
        return {
          title: 'Precious Metals & Anodes',
          subtitle: 'Gold, Silver & Rhodium stocks',
          crumbs: [
            { label: 'Stock', page: 'stock_chemical' },
            { label: 'Metals', page: 'stock_metal' },
          ],
        };
      case 'stock_tar':
        return {
          title: 'Tar Stock & Melting Logs',
          subtitle: 'Sealing tar weight register',
          crumbs: [
            { label: 'Stock', page: 'stock_chemical' },
            { label: 'Tar Stock', page: 'stock_tar' },
          ],
        };
      case 'stock_scrap':
        return {
          title: 'Scrap Recovery & Refining',
          subtitle: 'Precious metal recovery tracking',
          crumbs: [
            { label: 'Stock', page: 'stock_chemical' },
            { label: 'Scrap Management', page: 'stock_scrap' },
          ],
        };
      case 'bills_list':
        return {
          title: 'Billing & Invoicing',
          subtitle: 'Customer invoices & GST ledger',
          crumbs: [
            { label: 'Billing', page: 'bills_list' },
            { label: 'Bills', page: 'bills_list' },
          ],
        };
      case 'bill_detail':
        return {
          title: `Invoice ${selectedBillId || 'BILL-1025'}`,
          subtitle: 'Invoice breakdown & itemized plating',
          crumbs: [
            { label: 'Billing', page: 'bills_list' },
            { label: 'Bills', page: 'bills_list' },
            {
              label: selectedBillId || 'Invoice',
              page: 'bill_detail',
              onClick: () => selectedBillId && navigateToBill(selectedBillId),
            },
          ],
        };
      case 'payments_dashboard':
        return {
          title: 'Payment & Financial Analytics',
          subtitle: 'Collections, cashflow & receivables',
          crumbs: [
            { label: 'Payments', page: 'payments_dashboard' },
            { label: 'Dashboard', page: 'payments_dashboard' },
          ],
        };
      case 'payments_received':
        return {
          title: 'Payment Received Register',
          subtitle: 'Customer receipt vouchers',
          crumbs: [
            { label: 'Payments', page: 'payments_dashboard' },
            { label: 'Received', page: 'payments_received' },
          ],
        };
      case 'payments_pending':
        return {
          title: 'Pending Customer Receivables',
          subtitle: 'Aging schedule & outstanding balances',
          crumbs: [
            { label: 'Payments', page: 'payments_dashboard' },
            { label: 'Pending', page: 'payments_pending' },
          ],
        };
      case 'payments_promise_date':
        return {
          title: 'Promise Date Due Tracker',
          subtitle: 'Scheduled customer payment commitments',
          crumbs: [
            { label: 'Payments', page: 'payments_dashboard' },
            { label: 'Promise Date Due', page: 'payments_promise_date' },
          ],
        };
      case 'reports_center':
        return {
          title: 'Enterprise Reports Center',
          subtitle: 'Consolidated analytics & export logs',
          crumbs: [
            { label: 'Reports', page: 'reports_center' },
            { label: 'Consolidated', page: 'reports_center' },
          ],
        };
      case 'admin_users':
        return {
          title: 'User Management & Roles',
          subtitle: 'System credentials & access roles',
          crumbs: [
            { label: 'Administration', page: 'admin_users' },
            { label: 'Users', page: 'admin_users' },
          ],
        };
      case 'admin_permissions':
        return {
          title: 'System Permissions Matrix',
          subtitle: 'Granular security & ACL policies',
          crumbs: [
            { label: 'Administration', page: 'admin_users' },
            { label: 'Permissions', page: 'admin_permissions' },
          ],
        };
      case 'admin_alerts':
        return {
          title: 'Alerts & Threshold Center',
          subtitle: 'Real-time alert rules & triggers',
          crumbs: [
            { label: 'Administration', page: 'admin_users' },
            { label: 'Alerts', page: 'admin_alerts' },
          ],
        };
      case 'admin_recycle_bin':
        return {
          title: 'Recycle Bin & Audit Recovery',
          subtitle: 'Soft-deleted records & audit trail',
          crumbs: [
            { label: 'Administration', page: 'admin_users' },
            { label: 'Recycle Bin', page: 'admin_recycle_bin' },
          ],
        };
      default:
        return {
          title: 'Plating ERP Management',
          subtitle: 'Enterprise jewellery manufacturing',
          crumbs: [{ label: 'Dashboard', page: 'dashboard' }],
        };
    }
  };

  const { title, subtitle, crumbs } = getPageInfo();

  return (
    <header className="erp-header h-15 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 flex items-center justify-between z-20 shrink-0 sticky top-0">
      {/* Left: Sidebar Toggle + Title & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0 mr-2">
        <Button variant="secondary" size="icon"
          type="button"
          onClick={() => setCollapsed((prev: boolean) => !prev)}
          className="transition-colors cursor-pointer shrink-0"
          title={collapsed ? "Open sidebar" : "Close sidebar"}
          aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </Button>

        <div className="flex flex-col min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium">
            {crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                  <button
                    type="button"
                    onClick={() => {
                      if (crumb.onClick) {
                        crumb.onClick();
                      } else if (crumb.page) {
                        setCurrentPage(crumb.page);
                      }
                    }}
                    className={`truncate transition-colors cursor-pointer text-left ${
                      isLast
                        ? 'text-slate-800 font-semibold hover:text-emerald-700 hover:underline'
                        : 'text-slate-500 hover:text-slate-900 hover:underline'
                    }`}
                    title={`Navigate to ${crumb.label}`}
                  >
                    {crumb.label}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-snug">
              {title}
            </h1>
            {subtitle && (
              <span className="hidden xl:inline text-[11px] text-slate-600 font-normal truncate">
                • {subtitle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Actions: Date, Search, Quick Add, Notifications, Role Switcher, Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

        {/* Global Search Button */}
        <Button variant="secondary"
          type="button"
          onClick={() => setIsSearchModalOpen(true)}
          aria-label="Search records"
          className="erp-header-search flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          title="Search anything (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Search jobs, bills...</span>
          <kbd className="font-mono text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-semibold border border-slate-300/60">
            ⌘K
          </kbd>
        </Button>

        {/* Notifications Icon + Popover */}
        <div className="relative">
          <Button variant="secondary" size="icon"
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative transition-colors cursor-pointer"
            title="Alerts & Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"></span>
            )}
          </Button>
          <NotificationsPopover
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        {/* Unified Elegant Role Switcher Dropdown */}
        <RoleSwitcherDropdown />

        {/* Admin Profile Menu */}
        <div className="relative pl-1 border-l border-slate-200" ref={profileRef}>
          <Button variant="surface"
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer"
            aria-label="Admin Profile Menu"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              RS
            </div>
            <div className="hidden md:flex flex-col min-w-0 pr-0.5">
              <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                {currentUser?.name || 'Rajan Shah'}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold leading-tight flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Admin
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
          </Button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="ds-popover absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900 leading-snug">{currentUser?.name || 'Rajan Shah'}</p>
                <p className="text-xs text-slate-600 font-medium mt-0.5 break-all">{currentUser?.email || 'rajan.admin@platingerp.internal'}</p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Full Enterprise Administrator
                </div>
              </div>

              <div className="py-1.5 px-1.5 space-y-0.5">
                <Button variant="surface"
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setCurrentPage('payments_dashboard');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 text-slate-800 hover:text-slate-950 text-left text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Payment & Billing Center</span>
                </Button>
                <Button variant="surface"
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setCurrentPage('admin_users');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 text-slate-800 hover:text-slate-950 text-left text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  <UserCog className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>System Users & Permissions</span>
                </Button>
              </div>

              <div className="pt-1.5 px-1.5 border-t border-slate-100">
                <Button variant="surface"
                  type="button"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-left text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

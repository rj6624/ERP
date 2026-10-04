import { Button } from '../ui/Primitives';
import React, { useState, useRef, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Calendar,
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

interface AdminHeaderProps {
  collapsed: boolean;
  setCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ setCollapsed }) => {
  const {
    currentPage,
    setCurrentPage,
    setIsSearchModalOpen,
    setIsQuickActionOpen,
    selectedCustomerId,
    selectedJobId,
    selectedBillId,
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
  const getPageInfo = () => {
    switch (currentPage) {
      case 'dashboard':
        return { title: 'Operational Dashboard', subtitle: 'Real-time plating metrics & revenue', crumbs: ['Dashboard'] };
      case 'customers':
        return { title: 'Customer Master & Accounts', subtitle: 'Customer directory & profiles', crumbs: ['Customer', 'Customers'] };
      case 'customer_detail': {
        const cust = customers.find((c) => c.id === selectedCustomerId);
        return {
          title: cust ? cust.name : 'Customer Profile',
          subtitle: 'Profile, job history & ledger',
          crumbs: ['Customer', 'Customers', cust ? cust.name : 'Detail'],
        };
      }
      case 'inward_list':
        return { title: 'Customer Inward Receipts', subtitle: 'Jewellery receipt registry', crumbs: ['Customer', 'Inward'] };
      case 'create_inward':
        return { title: 'Create Customer Inward', subtitle: 'Auto job ID generator', crumbs: ['Customer', 'Inward', 'New Inward'] };
      case 'outward_list':
        return { title: 'Customer Outward Dispatches', subtitle: 'Completed job dispatches', crumbs: ['Customer', 'Outward'] };
      case 'create_outward':
        return { title: 'Process Customer Outward', subtitle: 'Plating calculation & verification', crumbs: ['Customer', 'Outward', 'Process'] };
      case 'job_detail':
        return {
          title: `Job Lifecycle Traceability`,
          subtitle: `Job ID: ${selectedJobId || 'JOB-1025'}`,
          crumbs: ['Operations', 'Jobs', selectedJobId || 'Detail'],
        };
      case 'fast_forward':
        return { title: 'Fast Forward Priority Queue', subtitle: 'High urgency processing jobs', crumbs: ['Operations', 'Fast Forward Queue'] };
      case 'labour_list':
        return { title: 'Labour Master Directory', subtitle: 'Artisan directory & active benches', crumbs: ['Labour', 'Labour Master'] };
      case 'labour_binding':
        return { title: 'Labour Binding & Tar Usage', subtitle: 'Wire binding logs & tar consumption', crumbs: ['Labour', 'Binding Tasks'] };
      case 'labour_open':
        return { title: 'Labour Untying Operations', subtitle: 'Open work piece tracking', crumbs: ['Labour', 'Open Tasks'] };
      case 'stock_chemical':
        return { title: 'Chemical Stock Inventory', subtitle: 'Bath tanks & chemical replenishment', crumbs: ['Stock', 'Chemicals'] };
      case 'stock_acid':
        return { title: 'Acid Stock Inventory', subtitle: 'Acid drums & titration logs', crumbs: ['Stock', 'Acids'] };
      case 'stock_metal':
        return { title: 'Precious Metals & Anodes', subtitle: 'Gold, Silver & Rhodium stocks', crumbs: ['Stock', 'Metals'] };
      case 'stock_tar':
        return { title: 'Tar Stock & Melting Logs', subtitle: 'Sealing tar weight register', crumbs: ['Stock', 'Tar Stock'] };
      case 'stock_scrap':
        return { title: 'Scrap Recovery & Refining', subtitle: 'Precious metal recovery tracking', crumbs: ['Stock', 'Scrap Management'] };
      case 'bills_list':
        return { title: 'Billing & Invoicing', subtitle: 'Customer invoices & GST ledger', crumbs: ['Billing', 'Bills'] };
      case 'bill_detail':
        return {
          title: `Invoice ${selectedBillId || 'BILL-1025'}`,
          subtitle: 'Invoice breakdown & itemized plating',
          crumbs: ['Billing', 'Bills', selectedBillId || 'Invoice'],
        };
      case 'payments_dashboard':
        return { title: 'Payment & Financial Analytics', subtitle: 'Collections, cashflow & receivables', crumbs: ['Payments', 'Dashboard'] };
      case 'payments_received':
        return { title: 'Payment Received Register', subtitle: 'Customer receipt vouchers', crumbs: ['Payments', 'Received'] };
      case 'payments_pending':
        return { title: 'Pending Customer Receivables', subtitle: 'Aging schedule & outstanding balances', crumbs: ['Payments', 'Pending'] };
      case 'payments_promise_date':
        return { title: 'Promise Date Due Tracker', subtitle: 'Scheduled customer payment commitments', crumbs: ['Payments', 'Promise Date Due'] };
      case 'reports_center':
        return { title: 'Enterprise Reports Center', subtitle: 'Consolidated analytics & export logs', crumbs: ['Reports', 'Consolidated'] };
      case 'admin_users':
        return { title: 'User Management & Roles', subtitle: 'System credentials & access roles', crumbs: ['Administration', 'Users'] };
      case 'admin_permissions':
        return { title: 'System Permissions Matrix', subtitle: 'Granular security & ACL policies', crumbs: ['Administration', 'Permissions'] };
      case 'admin_alerts':
        return { title: 'Alerts & Threshold Center', subtitle: 'Real-time alert rules & triggers', crumbs: ['Administration', 'Alerts'] };
      case 'admin_recycle_bin':
        return { title: 'Recycle Bin & Audit Recovery', subtitle: 'Soft-deleted records & audit trail', crumbs: ['Administration', 'Recycle Bin'] };
      default:
        return { title: 'Plating ERP Management', subtitle: 'Enterprise jewellery manufacturing', crumbs: ['System'] };
    }
  };

  const { title, subtitle, crumbs } = getPageInfo();

  return (
    <header className="erp-header h-15 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-5 flex items-center justify-between z-20 shrink-0 sticky top-0">
      {/* Left: Sidebar Toggle + Title & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0 mr-2">
        <Button variant="secondary" size="icon"
          type="button"
          onClick={() => setCollapsed((prev: boolean) => !prev)}
          className="transition-colors cursor-pointer shrink-0"
          title="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </Button>

        <div className="flex flex-col min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            {crumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                <span
                  onClick={() => {
                    if (idx === 0 && crumb === 'Customer') setCurrentPage('customers');
                    if (idx === 0 && crumb === 'Billing') setCurrentPage('bills_list');
                    if (idx === 0 && crumb === 'Payments') setCurrentPage('payments_dashboard');
                  }}
                  className={`truncate ${
                    idx === crumbs.length - 1
                      ? 'text-slate-700 font-semibold'
                      : 'hover:text-slate-900 cursor-pointer transition-colors'
                  }`}
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
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
        {/* Date / Production Shift Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 font-medium whitespace-nowrap">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Thu, 24 Sep 2026</span>
        </div>

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

        {/* Quick Action Button */}
        <Button variant="primary"
          type="button"
          aria-label="Quick actions"
          onClick={() => setIsQuickActionOpen(true)}
          className="inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick Action</span>
        </Button>

        {/* Notifications Icon + Popover */}
        <div className="relative">
          <Button variant="secondary"
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
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              RS
            </div>
            <div className="hidden md:flex flex-col min-w-0 pr-0.5">
              <span className="text-xs font-bold text-slate-900 leading-tight truncate">
                {currentUser?.name || 'Rajan Shah'}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold leading-tight flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> Admin
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </Button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="ds-popover absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200/90 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 origin-top-right">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="font-bold text-slate-900">{currentUser?.name || 'Rajan Shah'}</p>
                <p className="text-[11px] text-slate-500">{currentUser?.email || 'rajan.admin@platingerp.internal'}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Full Enterprise Administrator
                </div>
              </div>

              <div className="py-1 px-1">
                <Button variant="surface"
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setCurrentPage('payments_dashboard');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 text-left transition-colors cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span>Payment & Billing Center</span>
                </Button>
                <Button variant="surface"
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setCurrentPage('admin_users');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 text-left transition-colors cursor-pointer"
                >
                  <UserCog className="w-3.5 h-3.5 text-slate-400" />
                  <span>System Users & Permissions</span>
                </Button>
              </div>

              <div className="pt-1 px-1 border-t border-slate-100">
                <Button variant="surface"
                  type="button"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 text-red-700 text-left font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
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

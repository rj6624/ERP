import React, { useState, useRef, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Calendar,
  ChevronRight,
  Shield,
  ChevronDown,
  User,
  LogOut,
  Layers,
} from 'lucide-react';
import { NotificationsPopover } from '../common/NotificationsPopover';
import { RoleSwitcherDropdown } from './RoleSwitcherDropdown';

interface ManagerHeaderProps {
  collapsed: boolean;
  setCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export const ManagerHeader: React.FC<ManagerHeaderProps> = ({ setCollapsed }) => {
  const {
    currentPage,
    setCurrentPage,
    setIsSearchModalOpen,
    setIsQuickActionOpen,
    selectedCustomerId,
    selectedJobId,
    customers,
    alerts,
    currentUser,
  } = useERP();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Operational alerts only (exclude payment promises)
  const operationalAlerts = alerts.filter(
    (a) => a.type !== 'PAYMENT_PROMISE' && a.type !== ('PAYMENT' as any)
  );
  const unreadAlertsCount = operationalAlerts.filter((a) => !a.isRead).length;

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
        return { title: 'Operational Command Center', subtitle: 'Factory floor oversight & queues', crumbs: ['Dashboard'] };
      case 'customers':
        return { title: 'Customer Operations & Master', subtitle: 'Client accounts & job intake', crumbs: ['Customer', 'Customers'] };
      case 'customer_detail': {
        const cust = customers.find((c) => c.id === selectedCustomerId);
        return {
          title: cust ? cust.name : 'Customer Profile',
          subtitle: 'Production & job lifecycle tracking',
          crumbs: ['Customer', 'Customers', cust ? cust.name : 'Detail'],
        };
      }
      case 'inward_list':
        return { title: 'Customer Inward Intake Logs', subtitle: 'Raw jewellery intake records', crumbs: ['Customer', 'Inward'] };
      case 'create_inward':
        return { title: 'Create Customer Inward', subtitle: 'Auto job ID generator', crumbs: ['Customer', 'Inward', 'New Intake'] };
      case 'outward_list':
        return { title: 'Customer Outward Dispatches', subtitle: 'Finished plating dispatches', crumbs: ['Customer', 'Outward'] };
      case 'create_outward':
        return { title: 'Process Customer Outward', subtitle: 'Plating verification & dispatch', crumbs: ['Customer', 'Outward', 'Process'] };
      case 'job_detail':
        return {
          title: `Job Production Traceability`,
          subtitle: `Job ID: ${selectedJobId || 'JOB-1025'}`,
          crumbs: ['Operations', 'Jobs', selectedJobId || 'Detail'],
        };
      case 'fast_forward':
        return { title: 'Fast Forward Priority Queue', subtitle: 'High urgency rush orders', crumbs: ['Operations', 'Fast Forward Queue'] };
      case 'labour_list':
        return { title: 'Labour Force & Directory', subtitle: 'Artisan directory & active benches', crumbs: ['Labour', 'Labour Master'] };
      case 'labour_binding':
        return { title: 'Labour Binding & Tar Consumption', subtitle: 'Wire binding task allocation', crumbs: ['Labour', 'Binding Work'] };
      case 'labour_open':
        return { title: 'Labour Untying Operations', subtitle: 'Open piecework tracking', crumbs: ['Labour', 'Open Tasks'] };
      case 'labour_reports':
        return { title: 'Labour Workload & Tar Reports', subtitle: 'Bench productivity analytics', crumbs: ['Labour', 'Reports'] };
      case 'stock_chemical':
        return { title: 'Chemical Baths & Solutions', subtitle: 'Electroplating tank inventory', crumbs: ['Stock', 'Chemicals'] };
      case 'stock_acid':
        return { title: 'Acid Stock & Consumption Logs', subtitle: 'Pickling & cleaning acids', crumbs: ['Stock', 'Acids'] };
      case 'stock_metal':
        return { title: 'Precious Metals & Anodes', subtitle: 'Gold, Silver & Rhodium inventory', crumbs: ['Stock', 'Metals'] };
      case 'stock_tar':
        return { title: 'Tar Stock & Melting Ledger', subtitle: 'Sealing tar weight register', crumbs: ['Stock', 'Tar Stock'] };
      case 'stock_scrap':
        return { title: 'Scrap Recovery & Refining Ledger', subtitle: 'Plating sweep & scrap recovery', crumbs: ['Stock', 'Scrap Management'] };
      case 'stock_reports':
        return { title: 'Inventory & Material Ledger', subtitle: 'Chemical & metal balance logs', crumbs: ['Stock', 'Reports'] };
      case 'reports_center':
      case 'report_customer':
      case 'report_jobs':
      case 'report_weight':
      case 'report_labour':
      case 'report_stock':
        return { title: 'Operational Reports Center', subtitle: 'Performance & yield reports', crumbs: ['Reports', 'Operational Intelligence'] };
      case 'alerts':
      case 'admin_alerts':
        return { title: 'Operational Alerts & Thresholds', subtitle: 'Real-time floor triggers', crumbs: ['Alerts', 'Threshold Monitoring'] };
      default:
        return { title: 'Operational Command Center', subtitle: 'Factory floor operations', crumbs: ['Operations'] };
    }
  };

  const { title, subtitle, crumbs } = getPageInfo();

  return (
    <header className="erp-header h-15 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-5 flex items-center justify-between z-20 shrink-0 sticky top-0 font-sans">
      {/* Left: Sidebar Toggle + Title & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0 mr-2">
        <button
          type="button"
          onClick={() => setCollapsed((prev: boolean) => !prev)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
          title="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            {crumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                <span
                  onClick={() => {
                    if (idx === 0 && crumb === 'Customer') setCurrentPage('customers');
                    if (idx === 0 && crumb === 'Labour') setCurrentPage('labour_list');
                    if (idx === 0 && crumb === 'Stock') setCurrentPage('stock_chemical');
                    if (idx === 0 && crumb === 'Reports') setCurrentPage('reports_center');
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

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Date / Production Shift Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 font-medium whitespace-nowrap">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Thu, 26 Sep 2026</span>
          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-300/60">
            SHIFT 01
          </span>
        </div>

        {/* Global Search Button */}
        <button
          type="button"
          onClick={() => setIsSearchModalOpen(true)}
          aria-label="Search records"
          className="erp-header-search flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/90 text-slate-500 hover:bg-white hover:text-slate-800 hover:border-slate-300 text-xs font-medium transition-all cursor-pointer whitespace-nowrap shadow-2xs"
          title="Search Customers, Job IDs, Labour, Materials (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Search jobs, stock...</span>
          <kbd className="font-mono text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-semibold border border-slate-300/60">
            ⌘K
          </kbd>
        </button>

        {/* Quick Action Button */}
        <button
          type="button"
          aria-label="Quick actions"
          onClick={() => setIsQuickActionOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick Action</span>
        </button>

        {/* Operational Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 relative transition-colors cursor-pointer"
            title="Operational Alerts & Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
            )}
          </button>
          <NotificationsPopover
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        {/* Unified Role Switcher Dropdown */}
        <RoleSwitcherDropdown />

        {/* Manager Profile Menu */}
        <div className="relative pl-1 border-l border-slate-200" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              VJ
            </div>
            <div className="hidden md:flex flex-col min-w-0 pr-0.5">
              <span className="text-xs font-bold text-slate-900 leading-tight truncate">
                {currentUser?.name || 'Vikram Joshi'}
              </span>
              <span className="text-[10px] text-indigo-700 font-semibold leading-tight flex items-center gap-0.5">
                <Shield className="w-2.5 h-2.5 text-indigo-600" /> Manager
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200/90 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 origin-top-right">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="font-bold text-slate-900">{currentUser?.name || 'Vikram Joshi'}</p>
                <p className="text-[11px] text-slate-500">{currentUser?.email || 'vikram.manager@platingerp.in'}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 text-[10px] font-bold border border-indigo-200">
                  <Shield className="w-3 h-3 text-indigo-600" /> Operations Manager
                </div>
              </div>

              <div className="py-1 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setCurrentPage('fast_forward');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 text-left transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Fast Forward Rush Queue</span>
                </button>
              </div>

              <div className="pt-1 px-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 text-red-700 text-left font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

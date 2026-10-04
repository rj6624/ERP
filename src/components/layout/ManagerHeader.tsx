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

export const ManagerHeader: React.FC<ManagerHeaderProps> = ({ collapsed, setCollapsed }) => {
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

        {/* Global Search Button */}
        <Button variant="secondary"
          type="button"
          onClick={() => setIsSearchModalOpen(true)}
          aria-label="Search records"
          className="erp-header-search flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          title="Search Customers, Job IDs, Labour, Materials (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Search jobs, stock...</span>
          <kbd className="font-mono text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-semibold border border-slate-300/60">
            ⌘K
          </kbd>
        </Button>

        {/* Operational Notifications Popover */}
        <div className="relative">
          <Button variant="secondary" size="icon"
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative transition-colors cursor-pointer"
            title="Operational Alerts & Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
            )}
          </Button>
          <NotificationsPopover
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
          />
        </div>

        {/* Unified Role Switcher Dropdown */}
        <RoleSwitcherDropdown />

        {/* Manager Profile Menu */}
        <div className="relative pl-1 border-l border-slate-200" ref={profileRef}>
          <Button variant="surface"
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer"
            aria-label="Manager Profile Menu"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              VJ
            </div>
            <div className="hidden md:flex flex-col min-w-0 pr-0.5">
              <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                {currentUser?.name || 'Vikram Joshi'}
              </span>
              <span className="text-[11px] text-indigo-700 font-semibold leading-tight flex items-center gap-1 mt-0.5">
                <Shield className="w-3 h-3 text-indigo-600" /> Manager
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
          </Button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="ds-popover absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900 leading-snug">{currentUser?.name || 'Vikram Joshi'}</p>
                <p className="text-xs text-slate-600 font-medium mt-0.5 break-all">{currentUser?.email || 'vikram.manager@platingerp.in'}</p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-200">
                  <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> Operations Manager
                </div>
              </div>

              <div className="py-1.5 px-1.5 space-y-0.5">
                <Button variant="surface"
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setCurrentPage('fast_forward');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 text-slate-800 hover:text-slate-950 text-left text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Fast Forward Rush Queue</span>
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

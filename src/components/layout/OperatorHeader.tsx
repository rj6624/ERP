import React, { useState, useRef, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Calendar,
  ChevronDown,
  HardHat,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { NotificationsPopover } from '../common/NotificationsPopover';
import { RoleSwitcherDropdown } from './RoleSwitcherDropdown';

interface OperatorHeaderProps {
  collapsed: boolean;
  setCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export const OperatorHeader: React.FC<OperatorHeaderProps> = ({ setCollapsed }) => {
  const {
    setIsSearchModalOpen,
    alerts,
    currentUser,
  } = useERP();

  const navigate = useNavigate();
  const location = useLocation();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Operational alerts only
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
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') {
      return { title: 'Factory Floor Operations', subtitle: 'Station 01 • Intake & Dispatch Console' };
    }
    if (path === '/inward') {
      return { title: 'Customer Inward Receipts', subtitle: 'Jewellery Intake Log' };
    }
    if (path === '/inward/new') {
      return { title: 'New Customer Inward', subtitle: 'Weight & Dual Photo Intake' };
    }
    if (path === '/outward') {
      return { title: 'Customer Outward Dispatches', subtitle: 'Ready for Plating Dispatch' };
    }
    if (path === '/outward/new') {
      return { title: 'Process Customer Outward', subtitle: 'Weight Verification & Plating Calculation' };
    }
    if (path.startsWith('/jobs/')) {
      return { title: 'Job Traceability Details', subtitle: 'Inward, Photos & Dispatch' };
    }
    if (path === '/fast-forward') {
      return { title: 'Fast Forward Priority Queue', subtitle: 'Urgent Processing Required' };
    }
    if (path === '/customers') {
      return { title: 'Customer Directory', subtitle: 'Contact & Account Lookup' };
    }
    if (path === '/customer-jobs') {
      return { title: 'Customer Jobs History', subtitle: 'Past Inward & Outward Records' };
    }
    if (path.startsWith('/reports')) {
      return { title: 'Operational Daily Reports', subtitle: 'Inward, Outward & Plating' };
    }
    return { title: 'Factory Operator Portal', subtitle: 'Jewellery Plating Operations' };
  };

  const pageInfo = getPageInfo();

  return (
    <header className="erp-header h-15 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-5 flex items-center justify-between z-20 shrink-0 font-sans sticky top-0">
      {/* Left: Sidebar Toggle + Title */}
      <div className="flex items-center gap-3 min-w-0 mr-2">
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
          title="Toggle Navigation"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-snug truncate">
              {pageInfo.title}
            </h1>
            {pageInfo.subtitle && (
              <span className="hidden xl:inline text-[11px] text-slate-600 font-normal truncate">
                • {pageInfo.subtitle}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block truncate leading-tight mt-0.5">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Shift & Station Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 font-medium whitespace-nowrap">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Thu, 26 Sep 2026</span>
          <span className="text-[9px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded border border-sky-300/60">
            STATION 01
          </span>
        </div>

        {/* Global Search Button */}
        <button
          type="button"
          onClick={() => setIsSearchModalOpen(true)}
          aria-label="Search records"
          className="erp-header-search flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/90 text-slate-500 hover:bg-white hover:text-slate-800 hover:border-slate-300 text-xs font-medium transition-all cursor-pointer whitespace-nowrap shadow-2xs"
          title="Search Job IDs (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Search Job ID / Cust...</span>
          <kbd className="font-mono text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-semibold border border-slate-300/60">
            ⌘K
          </kbd>
        </button>

        {/* Direct Inward Quick Action Button */}
        <button
          type="button"
          onClick={() => navigate('/inward/new')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Inward</span>
        </button>

        {/* Operational Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 relative transition-colors cursor-pointer"
            title="Operational Alerts"
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

        {/* Operator Profile Menu */}
        <div className="relative pl-1 border-l border-slate-200" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              RP
            </div>
            <div className="hidden md:flex flex-col min-w-0 pr-0.5">
              <span className="text-xs font-bold text-slate-900 leading-tight truncate">
                {currentUser?.name || 'Ramesh Patel'}
              </span>
              <span className="text-[10px] text-sky-700 font-semibold leading-tight flex items-center gap-0.5">
                <HardHat className="w-2.5 h-2.5 text-sky-600" /> Operator
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200/90 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 origin-top-right">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="font-bold text-slate-900 text-sm">{currentUser?.name || 'Ramesh Patel'}</p>
                <p className="text-[11px] text-slate-500">{currentUser?.email || 'ramesh.operator@platingerp.in'}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 text-[10px] font-bold border border-sky-200">
                  <HardHat className="w-3 h-3 text-sky-600" /> Factory Floor Operator
                </div>
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

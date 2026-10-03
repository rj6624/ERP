import React, { useState, useRef, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Menu,
  Search,
  Bell,
  Calendar,
  ChevronRight,
  Hammer,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { NotificationsPopover } from '../common/NotificationsPopover';
import { useLocation } from 'react-router-dom';
import { RoleSwitcherDropdown } from './RoleSwitcherDropdown';

interface LabourHeaderProps {
  collapsed: boolean;
  setCollapsed: (v: boolean | ((prev: boolean) => boolean)) => void;
}

export const LabourHeader: React.FC<LabourHeaderProps> = ({ setCollapsed }) => {
  const {
    currentUser,
    alerts,
    setIsSearchModalOpen,
  } = useERP();

  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Operational alerts only (exclude payments, promises, billing)
  const operationalAlerts = alerts.filter(
    (a) => a.type === 'FAST_FORWARD' || a.type === 'OVERDUE_JOB' || a.type === 'SYSTEM'
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

  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') {
      return { title: 'Artisan Work Dashboard', subtitle: 'Assigned pieces & daily output', crumbs: ['Labour', 'Dashboard'] };
    }
    if (path === '/my-work') {
      return { title: 'All Assigned Work', subtitle: 'Active piecework queue', crumbs: ['Labour', 'My Work'] };
    }
    if (path === '/labour/binding') {
      return { title: 'Binding Work Operations', subtitle: 'Copper wire & tar preparation', crumbs: ['Labour', 'Binding Work'] };
    }
    if (path === '/labour/open') {
      return { title: 'Open Work Operations', subtitle: 'Untying finished plated pieces', crumbs: ['Labour', 'Open Work'] };
    }
    if (path.startsWith('/labour/reports') || path === '/reports') {
      return { title: 'Labour Work Reports', subtitle: 'Piece count & productivity history', crumbs: ['Labour', 'Reports'] };
    }
    return { title: 'Labour Station', subtitle: 'Artisan piecework bench', crumbs: ['Labour'] };
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
                  className={`truncate ${
                    idx === crumbs.length - 1 ? 'text-slate-700 font-semibold' : 'text-slate-500'
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

      {/* Right Actions: Shift Indicator, Search, Notifications, Role Switcher, Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Shift / Bench Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 font-medium whitespace-nowrap">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Shift 01</span>
          <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded border border-amber-300/60">
            BENCH #4
          </span>
        </div>

        {/* Search Job ID */}
        <button
          type="button"
          onClick={() => setIsSearchModalOpen(true)}
          aria-label="Search records"
          className="erp-header-search flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/90 text-slate-500 hover:bg-white hover:text-slate-800 hover:border-slate-300 text-xs font-medium transition-all cursor-pointer whitespace-nowrap shadow-2xs"
          title="Search Assigned Job ID or Customer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Search work...</span>
          <kbd className="font-mono text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-semibold border border-slate-300/60">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
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

        {/* Labour Profile Menu */}
        <div className="relative pl-1 border-l border-slate-200" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              SP
            </div>
            <div className="hidden md:flex flex-col min-w-0 pr-0.5">
              <span className="text-xs font-bold text-slate-900 leading-tight truncate">
                {currentUser?.name || 'Suresh Parmar'}
              </span>
              <span className="text-[10px] text-amber-700 font-semibold leading-tight flex items-center gap-0.5">
                <Hammer className="w-2.5 h-2.5 text-amber-600" /> Artisan
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200/90 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 origin-top-right">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="font-bold text-slate-900">{currentUser?.name || 'Suresh Parmar'}</p>
                <p className="text-[11px] text-slate-500">{currentUser?.email || 'suresh.labour@platingerp.in'}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-200">
                  <Hammer className="w-3 h-3 text-amber-600" /> Artisan Bench #4 • Station 03
                </div>
              </div>

              <div className="pt-1 px-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-50 text-red-700 text-left font-medium transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>End Shift / Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

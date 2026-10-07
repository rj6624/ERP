import { Button } from '../ui/Primitives';
import React, { useState, useRef, useEffect } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Menu,
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
  Sparkles,
} from 'lucide-react';
import { NotificationsPopover } from '../common/NotificationsPopover';
import { RoleSwitcherSection } from './RoleSwitcherDropdown';

interface BreadcrumbItem {
  label: string;
  page?: any;
  onClick?: () => void;
}

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
    navigateToCustomer,
    navigateToJob,
    customers,
    alerts,
    currentUser,
  } = useERP();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);

  // Operational alerts only (exclude payment promises)
  const operationalAlerts = alerts.filter(
    (a) => a.type !== 'PAYMENT_PROMISE' && a.type !== ('PAYMENT' as any)
  );
  const unreadAlertsCount = operationalAlerts.filter((a) => !a.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        profileRef.current &&
        !profileRef.current.contains(target) &&
        mobileProfileRef.current &&
        !mobileProfileRef.current.contains(target)
      ) {
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
          title: 'Operational Command Center',
          subtitle: 'Factory floor oversight & queues',
          crumbs: [{ label: 'Dashboard', page: 'dashboard' }],
        };
      case 'customers':
        return {
          title: 'Customer Operations & Master',
          subtitle: 'Client accounts & job intake',
          crumbs: [
            { label: 'Customer', page: 'customers' },
            { label: 'Customers', page: 'customers' },
          ],
        };
      case 'customer_detail': {
        const cust = customers.find((c) => c.id === selectedCustomerId);
        return {
          title: cust ? cust.name : 'Customer Profile',
          subtitle: 'Production & job lifecycle tracking',
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
          title: 'Customer Inward Intake Logs',
          subtitle: 'Raw jewellery intake records',
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
            { label: 'New Intake', page: 'create_inward' },
          ],
        };
      case 'outward_list':
        return {
          title: 'Customer Outward Dispatches',
          subtitle: 'Finished plating dispatches',
          crumbs: [
            { label: 'Customer', page: 'customers' },
            { label: 'Outward', page: 'outward_list' },
          ],
        };
      case 'create_outward':
        return {
          title: 'Process Customer Outward',
          subtitle: 'Plating verification & dispatch',
          crumbs: [
            { label: 'Customer', page: 'customers' },
            { label: 'Outward', page: 'outward_list' },
            { label: 'Process', page: 'create_outward' },
          ],
        };
      case 'job_detail':
        return {
          title: 'Job Production Traceability',
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
          subtitle: 'High urgency rush orders',
          crumbs: [
            { label: 'Operations', page: 'dashboard' },
            { label: 'Fast Forward Queue', page: 'fast_forward' },
          ],
        };
      case 'labour_list':
        return {
          title: 'Labour Force & Directory',
          subtitle: 'Artisan directory & active benches',
          crumbs: [
            { label: 'Labour', page: 'labour_list' },
            { label: 'Labour Master', page: 'labour_list' },
          ],
        };
      case 'labour_binding':
        return {
          title: 'Labour Binding & Tar Consumption',
          subtitle: 'Wire binding task allocation',
          crumbs: [
            { label: 'Labour', page: 'labour_list' },
            { label: 'Binding Work', page: 'labour_binding' },
          ],
        };
      case 'labour_open':
        return {
          title: 'Labour Untying Operations',
          subtitle: 'Open piecework tracking',
          crumbs: [
            { label: 'Labour', page: 'labour_list' },
            { label: 'Open Tasks', page: 'labour_open' },
          ],
        };
      case 'labour_reports':
        return {
          title: 'Labour Workload & Tar Reports',
          subtitle: 'Bench productivity analytics',
          crumbs: [
            { label: 'Labour', page: 'labour_list' },
            { label: 'Reports', page: 'labour_reports' },
          ],
        };
      case 'stock_chemical':
        return {
          title: 'Chemical Baths & Solutions',
          subtitle: 'Electroplating tank inventory',
          crumbs: [
            { label: 'Stock', page: 'stock_chemical' },
            { label: 'Chemicals', page: 'stock_chemical' },
          ],
        };
      case 'stock_acid':
        return {
          title: 'Acid Stock & Consumption Logs',
          subtitle: 'Pickling & cleaning acids',
          crumbs: [
            { label: 'Stock', page: 'stock_chemical' },
            { label: 'Acids', page: 'stock_acid' },
          ],
        };
      case 'stock_metal':
        return {
          title: 'Precious Metals & Anodes',
          subtitle: 'Gold, Silver & Rhodium inventory',
          crumbs: [
            { label: 'Stock', page: 'stock_chemical' },
            { label: 'Metals', page: 'stock_metal' },
          ],
        };
      case 'stock_tar':
        return {
          title: 'Tar Stock & Melting Ledger',
          subtitle: 'Sealing tar weight register',
          crumbs: [
            { label: 'Stock', page: 'stock_chemical' },
            { label: 'Tar Stock', page: 'stock_tar' },
          ],
        };
      case 'stock_scrap':
        return {
          title: 'Scrap Recovery & Refining Ledger',
          subtitle: 'Plating sweep & scrap recovery',
          crumbs: [
            { label: 'Stock', page: 'stock_chemical' },
            { label: 'Scrap Management', page: 'stock_scrap' },
          ],
        };
      case 'stock_reports':
        return {
          title: 'Inventory & Material Ledger',
          subtitle: 'Chemical & metal balance logs',
          crumbs: [
            { label: 'Stock', page: 'stock_chemical' },
            { label: 'Reports', page: 'stock_reports' },
          ],
        };
      case 'reports_center':
      case 'report_customer':
      case 'report_jobs':
      case 'report_weight':
      case 'report_labour':
      case 'report_stock':
        return {
          title: 'Operational Reports Center',
          subtitle: 'Performance & yield reports',
          crumbs: [
            { label: 'Reports', page: 'reports_center' },
            { label: 'Operational Intelligence', page: 'reports_center' },
          ],
        };
      case 'alerts':
      case 'admin_alerts':
        return {
          title: 'Operational Alerts & Thresholds',
          subtitle: 'Real-time floor triggers',
          crumbs: [
            { label: 'Alerts', page: 'alerts' },
            { label: 'Threshold Monitoring', page: 'alerts' },
          ],
        };
      default:
        return {
          title: 'Operational Command Center',
          subtitle: 'Factory floor operations',
          crumbs: [{ label: 'Dashboard', page: 'dashboard' }],
        };
    }
  };

  const { title, subtitle, crumbs } = getPageInfo();

  return (
    <header className="erp-header bg-white/95 backdrop-blur-md border-b border-slate-200/90 z-20 shrink-0 sticky top-0">
      {/* MOBILE VIEW (< md / < 768px): Single clean row */}
      <div className="flex md:hidden h-15 w-full items-center justify-between px-3.5">
        {/* Left: Borderless 3 horizontal bars (hamburger) + Branding Logo */}
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setCollapsed((prev: boolean) => !prev)}
            className="cursor-pointer shrink-0 border-0 shadow-none hover:bg-slate-100 text-slate-700 p-2 rounded-xl"
            title={collapsed ? "Open sidebar" : "Close sidebar"}
            aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </Button>

          {/* Application Branding Logo */}
          <Button
            variant="surface"
            type="button"
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2 text-left cursor-pointer p-0 select-none hover:opacity-90 transition-opacity border-0"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center shrink-0 shadow-sm border border-amber-500/20">
              <img src="/brand-logo.png" alt="Plating ERP Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wider text-xs text-slate-900 leading-tight">
                PLATING MGMT
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-tight leading-tight">
                JEWELLERY ERP
              </span>
            </div>
          </Button>
        </div>

        {/* Right: Search Button (replaces notifications) + Profile */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="cursor-pointer shrink-0 border-0 shadow-none hover:bg-slate-100 text-slate-700 p-2 rounded-xl"
            title="Search jobs, bills (Cmd+K)"
            aria-label="Search records"
          >
            <Search className="w-5 h-5 text-slate-700" />
          </Button>

          {/* Profile Avatar Button with Pop-up */}
          <div className="relative" ref={mobileProfileRef}>
            <Button
              variant="surface"
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer border-0"
              aria-label="Manager Profile and role switcher"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                VJ
              </div>
            </Button>

            {/* Mobile Profile Pop-up with Notifications & Role Switcher */}
            {isProfileMenuOpen && (
              <div className="ds-popover fixed top-16 left-3 right-3 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[calc(100dvh-80px)] overflow-y-auto">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      VJ
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 leading-snug truncate">{currentUser?.name || 'Vikram Joshi'}</p>
                      <p className="text-xs text-slate-500 font-medium truncate">{currentUser?.email || 'vikram.manager@platingerp.in'}</p>
                    </div>
                  </div>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 w-full">
                    <Shield className="w-3.5 h-3.5 text-slate-600 shrink-0" /> Operations Manager
                  </div>
                </div>

                {/* Notifications in Profile Menu */}
                <div className="px-2 pt-2">
                  <Button
                    variant="surface"
                    type="button"
                    onClick={() => {
                      setIsNotificationsOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0 relative">
                        <Bell className="w-4 h-4" />
                        {unreadAlertsCount > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"></span>
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Notifications & Alerts</span>
                        <span className="text-[11px] text-slate-500">{unreadAlertsCount > 0 ? `${unreadAlertsCount} unread alert${unreadAlertsCount > 1 ? 's' : ''}` : 'No unread alerts'}</span>
                      </div>
                    </div>
                    {unreadAlertsCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                        {unreadAlertsCount} New
                      </span>
                    )}
                  </Button>
                </div>

                {/* Role Switcher in Profile Menu */}
                <RoleSwitcherSection onRoleSelected={() => setIsProfileMenuOpen(false)} />

                <div className="py-1.5 px-2 border-t border-slate-100 space-y-0.5">
                  <Button variant="surface"
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setCurrentPage('fast_forward');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-950 text-left text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Fast Forward Rush Queue</span>
                  </Button>
                </div>

                <div className="pt-1.5 px-2 border-t border-slate-100">
                  <Button variant="surface"
                    type="button"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-left text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Notifications Popover if opened from profile */}
        <NotificationsPopover
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />
      </div>

      {/* DESKTOP VIEW (>= md / >= 768px): Single row */}
      <div className="hidden md:flex h-16 w-full items-center justify-between px-6">
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

          <div className="flex flex-col justify-center min-w-0">
            <div className="erp-header-breadcrumb flex items-center gap-1.5 text-[11px] font-medium leading-none mb-0.5">
              {crumbs.map((crumb, idx) => {
                const isLast = idx === crumbs.length - 1;
                return (
                  <React.Fragment key={idx}>
                    {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                    <Button
                      variant="surface"
                      type="button"
                      onClick={() => {
                        if (crumb.onClick) {
                          crumb.onClick();
                        } else if (crumb.page) {
                          setCurrentPage(crumb.page);
                        }
                      }}
                      className={`erp-breadcrumb-item truncate transition-colors cursor-pointer text-left leading-none p-0 border-0 shadow-none ${
                        isLast
                          ? 'text-slate-800 font-semibold hover:text-emerald-700 hover:underline'
                          : 'text-slate-500 hover:text-slate-900 hover:underline'
                      }`}
                      title={`Navigate to ${crumb.label}`}
                    >
                      {crumb.label}
                    </Button>
                  </React.Fragment>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 truncate leading-tight">
                {title}
              </h1>
              {subtitle && (
                <span className="hidden xl:inline text-[11px] text-slate-600 font-normal truncate leading-tight">
                  • {subtitle}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Global Search Button */}
          <Button variant="secondary"
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            aria-label="Search records"
            className="erp-header-search flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            title="Search jobs, bills (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 text-xs">Search jobs, bills...</span>
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

          {/* Manager Profile Menu with Role Switcher inside */}
          <div className="relative pl-1 border-l border-slate-200" ref={profileRef}>
            <Button variant="surface"
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left cursor-pointer"
              aria-label="Manager Profile Menu"
            >
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                VJ
              </div>
              <div className="flex flex-col min-w-0 pr-0.5">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                  {currentUser?.name || 'Vikram Joshi'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium leading-tight flex items-center gap-1 mt-0.5">
                  <Shield className="w-3 h-3 text-slate-500" /> Manager
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </Button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="ds-popover absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900 leading-snug">{currentUser?.name || 'Vikram Joshi'}</p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5 break-all">{currentUser?.email || 'vikram.manager@platingerp.in'}</p>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                    <Shield className="w-3.5 h-3.5 text-slate-600 shrink-0" /> Operations Manager
                  </div>
                </div>

                {/* Role Switcher in Profile Menu */}
                <RoleSwitcherSection onRoleSelected={() => setIsProfileMenuOpen(false)} />

                <div className="py-1.5 px-2 border-t border-slate-100 space-y-0.5">
                  <Button variant="surface"
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setCurrentPage('fast_forward');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 hover:text-slate-950 text-left text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>Fast Forward Rush Queue</span>
                  </Button>
                </div>

                <div className="pt-1.5 px-2 border-t border-slate-100">
                  <Button variant="surface"
                    type="button"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-left text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

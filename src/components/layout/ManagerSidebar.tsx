import { Button } from '../ui/Primitives';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useERP } from '../../context/ERPContext';
import { NavigationPage } from '../../types/navigation';
import {
  LayoutDashboard,
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  Hammer,
  Layers,
  Unlock,
  Box,
  FlaskConical,
  Flame,
  ShieldCheck,
  FileText,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Scale,
  CreditCard,
} from 'lucide-react';

interface ManagerSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const ManagerSidebar: React.FC<ManagerSidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentPage,
    setCurrentPage,
    setSelectedReportCategory,
    alerts,
    jobs,
    chemicals,
    acids,
    metals,
    currentTarStock,
    customers,
    currentUser,
  } = useERP();

  // Accordion state for nested groups
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    customer: true,
    labour: true,
    stock: false,
    reports: true,
    admin: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isNavActive = (path: string, pageKey?: NavigationPage) => {
    if (pageKey && currentPage === pageKey) return true;
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNav = (path: string, pageKey?: NavigationPage) => {
    if (pageKey) setCurrentPage(pageKey);
    navigate(path);
  };

  const handleReportNav = (category: string) => {
    setSelectedReportCategory(category);
    setCurrentPage('reports_center');
    navigate(`/reports/${category.toLowerCase()}`);
  };

  const fastForwardCount = jobs.filter(
    (j) => j.priority === 'Fast Forward' && j.status !== 'Outward Completed'
  ).length;

  const operationalAlerts = alerts.filter(
    (a) => a.type !== 'PAYMENT_PROMISE' && a.type !== ('PAYMENT' as any)
  );
  const unreadAlertsCount = operationalAlerts.filter((a) => !a.isRead).length;

  const lowStockCount =
    chemicals.filter((c) => c.status === 'Low Stock' || c.status === 'Out of Stock').length +
    acids.filter((a) => a.status === 'Low Stock' || a.status === 'Out of Stock').length +
    metals.filter((m) => m.status === 'Low Stock' || m.status === 'Out of Stock').length +
    (currentTarStock < 10 ? 1 : 0);

  return (
    <aside
      className={`erp-sidebar bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-200 z-30 select-none font-sans shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className={`h-14 flex items-center border-b border-slate-800 bg-slate-950/60 shrink-0 ${collapsed ? 'justify-center px-0' : 'justify-between px-4'}`}>
        <div
          onClick={() => handleNav('/dashboard', 'dashboard')}
          className={`flex items-center cursor-pointer overflow-hidden ${collapsed ? 'justify-center' : 'gap-2.5'}`}
        >
          <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm shadow-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wider text-xs text-white">
                PLATING MGMT
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-tight flex items-center gap-1">
                JEWELLERY ERP <span className="text-emerald-400 font-bold text-[9px] bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-800/40">MANAGER</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 text-xs custom-scrollbar">
        {/* DASHBOARD */}
        <Button
          variant="surface"
          onClick={() => handleNav('/dashboard', 'dashboard')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
            isNavActive('/dashboard', 'dashboard')
              ? 'erp-nav-active bg-emerald-600 text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="Dashboard"
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </Button>

        {/* CUSTOMER SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <Button
              variant="surface"
              onClick={() => toggleSection('customer')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Customer Operations</span>
              {openSections.customer ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
          )}
          {(!collapsed ? openSections.customer : true) && (
            <div className="space-y-0.5 mt-0.5">
              <Button
                variant="surface"
                onClick={() => handleNav('/customers', 'customers')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/customers', 'customers')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Customers"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Customers</span>}
                </div>
                {!collapsed && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded-[4px] font-mono min-w-[18px] h-[18px] inline-flex items-center justify-center">
                    {customers.length}
                  </span>
                )}
              </Button>

              <Button
                variant="surface"
                onClick={() => handleNav('/inward', 'inward_list')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/inward', 'inward_list')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Inward Intake"
              >
                <div className="flex items-center gap-2.5">
                  <ArrowDownLeft className="w-4 h-4 shrink-0 text-blue-400" />
                  {!collapsed && <span>Inward</span>}
                </div>
              </Button>

              <Button
                variant="surface"
                onClick={() => handleNav('/outward', 'outward_list')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/outward', 'outward_list')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Customer Outward"
              >
                <div className="flex items-center gap-2.5">
                  <ArrowUpRight className="w-4 h-4 shrink-0 text-emerald-400" />
                  {!collapsed && <span>Customer Outward</span>}
                </div>
              </Button>

              <Button
                variant="surface"
                onClick={() => handleNav('/fast-forward', 'fast_forward')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/fast-forward', 'fast_forward')
                    ? 'erp-nav-active bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                    : 'text-amber-400/80 hover:bg-slate-800/60 hover:text-amber-300'
                }`}
                title="Fast Forward Queue"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 shrink-0 text-amber-400 fill-amber-400" />
                  {!collapsed && <span>Fast Forward</span>}
                </div>
                {!collapsed && fastForwardCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1 py-0.5 rounded-[4px] min-w-[18px] h-[18px] inline-flex items-center justify-center">
                    {fastForwardCount}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* LABOUR SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <Button
              variant="surface"
              onClick={() => toggleSection('labour')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Labour Management</span>
              {openSections.labour ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
          )}
          {(!collapsed ? openSections.labour : true) && (
            <div className="space-y-0.5 mt-0.5">
              <Button
                variant="surface"
                onClick={() => handleNav('/labour', 'labour_list')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/labour', 'labour_list')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Labour List"
              >
                <Hammer className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Labour List</span>}
              </Button>

              <Button
                variant="surface"
                onClick={() => handleNav('/labour/binding', 'labour_binding')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/labour/binding', 'labour_binding')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Labour Binding"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Labour Binding</span>}
                </div>
              </Button>

              <Button
                variant="surface"
                onClick={() => handleNav('/labour/open', 'labour_open')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/labour/open', 'labour_open')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Labour Open"
              >
                <div className="flex items-center gap-2.5">
                  <Unlock className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Labour Open</span>}
                </div>
              </Button>
            </div>
          )}
        </div>

        {/* STOCK SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <Button
              variant="surface"
              onClick={() => toggleSection('stock')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Stock & Chemicals</span>
              {openSections.stock ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
          )}
          {(!collapsed ? openSections.stock : true) && (
            <div className="space-y-0.5 mt-0.5">
              <Button
                variant="surface"
                onClick={() => handleNav('/stock/chemicals', 'stock_chemical')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/stock/chemicals', 'stock_chemical')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Chemical Baths"
              >
                <FlaskConical className="w-4 h-4 shrink-0 text-cyan-400" />
                {!collapsed && <span>Chemical Baths</span>}
              </Button>

              <Button
                variant="surface"
                onClick={() => handleNav('/stock/acids', 'stock_acid')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/stock/acids', 'stock_acid')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Acid Stock"
              >
                <Flame className="w-4 h-4 shrink-0 text-orange-400" />
                {!collapsed && <span>Acid Stock</span>}
              </Button>

              <Button
                variant="surface"
                onClick={() => handleNav('/stock/metals', 'stock_metal')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/stock/metals', 'stock_metal')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Precious Metals"
              >
                <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                {!collapsed && <span>Precious Metals</span>}
              </Button>

              <Button
                variant="surface"
                onClick={() => handleNav('/stock/tar', 'stock_tar')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/stock/tar', 'stock_tar')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Sealing Tar Stock"
              >
                <Box className="w-4 h-4 shrink-0 text-slate-400" />
                {!collapsed && <span>Sealing Tar</span>}
              </Button>

              <Button
                variant="surface"
                onClick={() => handleNav('/stock/scrap', 'stock_scrap')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/stock/scrap', 'stock_scrap')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Scrap Refining"
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                {!collapsed && <span>Scrap Refining</span>}
              </Button>
            </div>
          )}
        </div>

        {/* REPORTS SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <Button
              variant="surface"
              onClick={() => toggleSection('reports')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Reports & Analytics</span>
              {openSections.reports ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
          )}
          {(!collapsed ? openSections.reports : true) && (
            <div className="space-y-0.5 mt-0.5">
              <Button
                variant="surface"
                onClick={() => handleNav('/reports', 'reports_center')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('/reports', 'reports_center')
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Reports Center"
              >
                <BarChart3 className="w-4 h-4 shrink-0 text-cyan-400" />
                {!collapsed && <span>Reports Center</span>}
              </Button>

              <Button
                variant="surface"
                onClick={() => handleReportNav('WEIGHT')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  location.pathname === '/reports/weight'
                    ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Weight & Plating Report"
              >
                <Scale className="w-4 h-4 shrink-0 text-emerald-400" />
                {!collapsed && <span>Weight & Plating</span>}
              </Button>
            </div>
          )}
        </div>

        {/* ALERTS SECTION */}
        <div className="pt-2">
          <Button
            variant="surface"
            onClick={() => handleNav('/alerts', 'admin_alerts')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
              isNavActive('/alerts', 'admin_alerts')
                ? 'erp-nav-active bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
            title="Alerts Center"
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Alerts Center</span>}
            </div>
            {!collapsed && unreadAlertsCount > 0 && (
              <span className="text-[10px] bg-red-500 text-white px-1 py-0.5 rounded-[4px] font-bold min-w-[18px] h-[18px] inline-flex items-center justify-center">
                {unreadAlertsCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Manager User Footer Widget */}
      <div className={`p-3 border-t border-slate-800 bg-slate-950/80 flex items-center shrink-0 ${collapsed ? 'justify-center px-0' : 'justify-between'}`}>
        <div className={`flex items-center min-w-0 ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
          <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-600">
            {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'PS'}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate">{currentUser?.name || 'Pravin Soni'}</span>
              <span className="text-[10px] text-emerald-400 font-mono">Plant Manager</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

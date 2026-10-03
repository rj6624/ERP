import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Shield,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Scale,
  Briefcase,
  FileSpreadsheet,
} from 'lucide-react';

interface ManagerSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const ManagerSidebar: React.FC<ManagerSidebarProps> = ({ collapsed }) => {
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
  } = useERP();

  // Accordion state for nested groups
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    customer: true,
    labour: true,
    stock: true,
    reports: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const navigate = useNavigate();

  const isNavActive = (page: NavigationPage) => currentPage === page;

  const handleNav = (page: NavigationPage) => {
    setCurrentPage(page);
  };

  const handleReportNav = (category: string) => {
    setSelectedReportCategory(category);
    navigate(`/reports/${category.toLowerCase()}`);
  };

  // Operational metrics for sidebar badges
  const fastForwardPendingCount = jobs.filter(
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
      <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/70">
        <div
          onClick={() => handleNav('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm shadow-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wider text-xs text-white">
                PLATING MGMT
              </span>
              <span className="text-[10px] text-slate-400 tracking-tight flex items-center gap-1">
                JEWELLERY ERP <span className="text-emerald-400 font-bold text-[9px] bg-emerald-950/90 px-1 py-0.2 rounded border border-emerald-800/40">MANAGER</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 text-xs custom-scrollbar">
        {/* DASHBOARD */}
        <button
          onClick={() => handleNav('dashboard')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
            isNavActive('dashboard')
              ? 'bg-emerald-600 text-white font-semibold shadow-sm'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
          title="Operational Dashboard"
        >
          <LayoutDashboard className="w-4 h-4 shrink-0 text-emerald-400" />
          {!collapsed && <span>Dashboard</span>}
        </button>

        {/* 1. CUSTOMER SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <button
              onClick={() => toggleSection('customer')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Customer</span>
              {openSections.customer ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {(!collapsed ? openSections.customer : true) && (
            <div className="space-y-0.5 mt-0.5">
              <button
                onClick={() => handleNav('customers')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('customers') || isNavActive('customer_detail')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Customers"
              >
                <Users className="w-4 h-4 shrink-0 text-slate-400" />
                {!collapsed && <span>Customers</span>}
              </button>

              <button
                onClick={() => handleNav('inward_list')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('inward_list') || isNavActive('create_inward')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Inward"
              >
                <ArrowDownLeft className="w-4 h-4 shrink-0 text-blue-400" />
                {!collapsed && <span>Inward</span>}
              </button>

              <button
                onClick={() => handleNav('outward_list')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('outward_list') || isNavActive('create_outward')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Customer Outward"
              >
                <ArrowUpRight className="w-4 h-4 shrink-0 text-emerald-400" />
                {!collapsed && <span>Customer Outward</span>}
              </button>

              <button
                onClick={() => handleNav('fast_forward')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('fast_forward')
                    ? 'bg-amber-950/80 text-amber-300 font-semibold border border-amber-800/50'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Fast Forward Priority Queue"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 shrink-0 text-amber-400 fill-amber-400" />
                  {!collapsed && <span>Fast Forward</span>}
                </div>
                {!collapsed && fastForwardPendingCount > 0 && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
                    {fastForwardPendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleReportNav('CUSTOMER')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
                title="Customer Reports"
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0 text-slate-500" />
                {!collapsed && <span>Customer Reports</span>}
              </button>
            </div>
          )}
        </div>

        {/* 2. LABOUR SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <button
              onClick={() => toggleSection('labour')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Labour</span>
              {openSections.labour ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {(!collapsed ? openSections.labour : true) && (
            <div className="space-y-0.5 mt-0.5">
              <button
                onClick={() => handleNav('labour_list')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('labour_list')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Labour Master"
              >
                <Hammer className="w-4 h-4 shrink-0 text-slate-400" />
                {!collapsed && <span>Labour</span>}
              </button>

              <button
                onClick={() => handleNav('labour_binding')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('labour_binding')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Labour Binding"
              >
                <Layers className="w-4 h-4 shrink-0 text-indigo-400" />
                {!collapsed && <span>Labour Binding</span>}
              </button>

              <button
                onClick={() => handleNav('labour_open')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('labour_open')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Labour Open"
              >
                <Unlock className="w-4 h-4 shrink-0 text-orange-400" />
                {!collapsed && <span>Labour Open</span>}
              </button>

              <button
                onClick={() => handleReportNav('LABOUR')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
                title="Labour Reports"
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0 text-slate-500" />
                {!collapsed && <span>Labour Reports</span>}
              </button>
            </div>
          )}
        </div>

        {/* 3. STOCK SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <button
              onClick={() => toggleSection('stock')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Stock</span>
              {openSections.stock ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {(!collapsed ? openSections.stock : true) && (
            <div className="space-y-0.5 mt-0.5">
              <button
                onClick={() => handleNav('stock_chemical')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('stock_chemical')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Chemical"
              >
                <div className="flex items-center gap-2.5">
                  <FlaskConical className="w-4 h-4 shrink-0 text-cyan-400" />
                  {!collapsed && <span>Chemical</span>}
                </div>
                {!collapsed && chemicals.some((c) => c.status === 'Low Stock') && (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>

              <button
                onClick={() => handleNav('stock_acid')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('stock_acid')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Acid"
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 shrink-0 text-red-400" />
                  {!collapsed && <span>Acid</span>}
                </div>
                {!collapsed && acids.some((a) => a.status === 'Low Stock') && (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>

              <button
                onClick={() => handleNav('stock_metal')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('stock_metal')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Metal"
              >
                <Shield className="w-4 h-4 shrink-0 text-emerald-400" />
                {!collapsed && <span>Metal</span>}
              </button>

              <button
                onClick={() => handleNav('stock_tar')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('stock_tar')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Tar Stock"
              >
                <div className="flex items-center gap-2.5">
                  <Box className="w-4 h-4 shrink-0 text-amber-500" />
                  {!collapsed && <span>Tar Stock</span>}
                </div>
                {!collapsed && currentTarStock < 10 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>

              <button
                onClick={() => handleNav('stock_scrap')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('stock_scrap')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Scrap"
              >
                <Box className="w-4 h-4 shrink-0 text-slate-500" />
                {!collapsed && <span>Scrap</span>}
              </button>

              <button
                onClick={() => handleReportNav('STOCK')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
                title="Stock Reports"
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0 text-slate-500" />
                {!collapsed && <span>Stock Reports</span>}
              </button>
            </div>
          )}
        </div>

        {/* 4. REPORTS SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <button
              onClick={() => toggleSection('reports')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Reports</span>
              {openSections.reports ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {(!collapsed ? openSections.reports : true) && (
            <div className="space-y-0.5 mt-0.5">
              <button
                onClick={() => handleReportNav('CUSTOMER')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
                title="Customer Reports"
              >
                <Users className="w-4 h-4 shrink-0 text-slate-500" />
                {!collapsed && <span>Customer Reports</span>}
              </button>

              <button
                onClick={() => handleReportNav('JOB')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
                title="Job Reports"
              >
                <Briefcase className="w-4 h-4 shrink-0 text-slate-500" />
                {!collapsed && <span>Job Reports</span>}
              </button>

              <button
                onClick={() => handleReportNav('WEIGHT')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
                title="Weight Reports"
              >
                <Scale className="w-4 h-4 shrink-0 text-emerald-400" />
                {!collapsed && <span>Weight Reports</span>}
              </button>

              <button
                onClick={() => handleReportNav('LABOUR')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
                title="Labour Reports"
              >
                <Hammer className="w-4 h-4 shrink-0 text-slate-500" />
                {!collapsed && <span>Labour Reports</span>}
              </button>

              <button
                onClick={() => handleReportNav('STOCK')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
                title="Stock Reports"
              >
                <Box className="w-4 h-4 shrink-0 text-slate-500" />
                {!collapsed && <span>Stock Reports</span>}
              </button>

              <button
                onClick={() => handleNav('reports_center')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('reports_center')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="All Reports"
              >
                <BarChart3 className="w-4 h-4 shrink-0 text-cyan-400" />
                {!collapsed && <span>All Reports</span>}
              </button>
            </div>
          )}
        </div>

        {/* 5. ALERTS SECTION */}
        <div className="pt-2">
          <button
            onClick={() => handleNav('alerts')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
              isNavActive('alerts') || isNavActive('admin_alerts')
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
            title="Operational Alerts"
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 shrink-0 text-amber-400" />
              {!collapsed && <span>Alerts</span>}
            </div>
            {!collapsed && unreadAlertsCount > 0 && (
              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Manager User Footer Widget */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-600/50">
            VJ
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate">Vikram Joshi</span>
              <span className="text-[10px] text-emerald-400">Manager • Operations</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

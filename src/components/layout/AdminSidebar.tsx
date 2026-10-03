import React, { useState } from 'react';
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
  CreditCard,
  BarChart3,
  UserCog,
  KeyRound,
  Bell,
  Trash2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Sliders,
  DollarSign,
  PackageCheck,
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed }) => {
  const { currentPage, setCurrentPage, dashboardMetrics, alerts, recycleBin } = useERP();

  // Accordion state for nested groups
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    customer: true,
    labour: false,
    stock: false,
    billing: false,
    payments: true,
    reports: false,
    admin: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isNavActive = (page: NavigationPage) => currentPage === page;

  const handleNav = (page: NavigationPage) => {
    setCurrentPage(page);
  };

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  return (
    <aside
      className={`erp-sidebar bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-200 z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/60">
        <div
          onClick={() => handleNav('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
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
                JEWELLERY ERP <span className="text-emerald-400 font-bold text-[9px] bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-800/40">ADMIN</span>
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
          title="Dashboard"
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </button>

        {/* CUSTOMER SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <button
              onClick={() => toggleSection('customer')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Customer Operations</span>
              {openSections.customer ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {(!collapsed ? openSections.customer : true) && (
            <div className="space-y-0.5 mt-0.5">
              <button
                onClick={() => handleNav('customers')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('customers') || isNavActive('customer_detail')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Customers"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Customers</span>}
                </div>
                {!collapsed && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                    {dashboardMetrics.totalCustomers}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNav('inward_list')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('inward_list') || isNavActive('create_inward')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Inward"
              >
                <div className="flex items-center gap-2.5">
                  <ArrowDownLeft className="w-4 h-4 shrink-0 text-blue-400" />
                  {!collapsed && <span>Inward</span>}
                </div>
              </button>

              <button
                onClick={() => handleNav('outward_list')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('outward_list') || isNavActive('create_outward')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Customer Outward"
              >
                <div className="flex items-center gap-2.5">
                  <ArrowUpRight className="w-4 h-4 shrink-0 text-emerald-400" />
                  {!collapsed && <span>Customer Outward</span>}
                </div>
              </button>

              <button
                onClick={() => handleNav('fast_forward')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('fast_forward')
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                    : 'text-amber-400/80 hover:bg-slate-800/60 hover:text-amber-300'
                }`}
                title="Fast Forward Queue"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 shrink-0 text-amber-400 fill-amber-400" />
                  {!collapsed && <span>Fast Forward</span>}
                </div>
                {!collapsed && dashboardMetrics.fastForwardCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.2 rounded-full animate-pulse">
                    {dashboardMetrics.fastForwardCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* LABOUR SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <button
              onClick={() => toggleSection('labour')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Labour Management</span>
              {openSections.labour ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {(!collapsed ? openSections.labour : true) && (
            <div className="space-y-0.5 mt-0.5">
              <button
                onClick={() => handleNav('labour_list')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('labour_list') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Labour Master"
              >
                <Hammer className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Labour List</span>}
              </button>
              <button
                onClick={() => handleNav('labour_binding')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('labour_binding') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Labour Binding"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Labour Binding</span>}
                </div>
                {!collapsed && dashboardMetrics.pendingBindingCount > 0 && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                    {dashboardMetrics.pendingBindingCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleNav('labour_open')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('labour_open') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Labour Open"
              >
                <div className="flex items-center gap-2.5">
                  <Unlock className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Labour Open</span>}
                </div>
                {!collapsed && dashboardMetrics.pendingOpenCount > 0 && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                    {dashboardMetrics.pendingOpenCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* STOCK SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <button
              onClick={() => toggleSection('stock')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Stock & Inventory</span>
              {openSections.stock ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {(!collapsed ? openSections.stock : true) && (
            <div className="space-y-0.5 mt-0.5">
              <button
                onClick={() => handleNav('stock_chemical')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('stock_chemical') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Chemicals"
              >
                <div className="flex items-center gap-2.5">
                  <FlaskConical className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Chemical</span>}
                </div>
                {!collapsed && dashboardMetrics.lowStockChemicalCount > 0 && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded">
                    {dashboardMetrics.lowStockChemicalCount} Low
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNav('stock_acid')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('stock_acid') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Acids"
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Acid</span>}
                </div>
                {!collapsed && dashboardMetrics.lowStockAcidCount > 0 && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded">
                    {dashboardMetrics.lowStockAcidCount} Low
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNav('stock_metal')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('stock_metal') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Metals"
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Metal</span>}
              </button>

              <button
                onClick={() => handleNav('stock_tar')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('stock_tar') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Tar Stock"
              >
                <Box className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Tar Stock</span>}
              </button>

              <button
                onClick={() => handleNav('stock_scrap')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('stock_scrap') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Scrap"
              >
                <PackageCheck className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Scrap</span>}
              </button>
            </div>
          )}
        </div>

        {/* BILLING SECTION */}
        <div className="pt-2">
          {!collapsed && (
            <button
              onClick={() => toggleSection('billing')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Billing</span>
              {openSections.billing ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {(!collapsed ? openSections.billing : true) && (
            <div className="space-y-0.5 mt-0.5">
              <button
                onClick={() => handleNav('bills_list')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('bills_list') || isNavActive('bill_detail')
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Bills"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Bills</span>}
                </div>
              </button>
            </div>
          )}
        </div>

        {/* PAYMENTS SECTION (ADMIN ONLY) */}
        <div className="pt-2">
          {!collapsed && (
            <button
              onClick={() => toggleSection('payments')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <div className="flex items-center gap-1.5">
                <span>Payments</span>
                <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-1 py-0.2 rounded font-bold">
                  ADMIN
                </span>
              </div>
              {openSections.payments ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {(!collapsed ? openSections.payments : true) && (
            <div className="space-y-0.5 mt-0.5">
              <button
                onClick={() => handleNav('payments_dashboard')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('payments_dashboard') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Payment Analytics"
              >
                <DollarSign className="w-4 h-4 shrink-0 text-emerald-400" />
                {!collapsed && <span>Payment Dashboard</span>}
              </button>

              <button
                onClick={() => handleNav('payments_received')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('payments_received') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Payment Received"
              >
                <CreditCard className="w-4 h-4 shrink-0 text-slate-400" />
                {!collapsed && <span>Payment Received</span>}
              </button>

              <button
                onClick={() => handleNav('payments_pending')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('payments_pending') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Pending Payments"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 flex items-center justify-center text-red-400 font-bold text-xs">₹</span>
                  {!collapsed && <span>Pending Payments</span>}
                </div>
              </button>

              <button
                onClick={() => handleNav('payments_promise_date')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('payments_promise_date') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Promise Date Pending"
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 shrink-0 text-orange-400" />
                  {!collapsed && <span>Promise Date Due</span>}
                </div>
                {!collapsed && dashboardMetrics.promiseDateDueCount > 0 && (
                  <span className="text-[10px] bg-orange-500/20 text-orange-300 border border-orange-500/40 px-1.5 py-0.2 rounded">
                    {dashboardMetrics.promiseDateDueCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {/* REPORTS CENTER */}
        <div className="pt-2">
          <button
            onClick={() => handleNav('reports_center')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
              isNavActive('reports_center') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
            title="Reports Center"
          >
            <BarChart3 className="w-4 h-4 shrink-0 text-cyan-400" />
            {!collapsed && <span>Reports Center</span>}
          </button>
        </div>

        {/* ADMINISTRATION */}
        <div className="pt-2">
          {!collapsed && (
            <button
              onClick={() => toggleSection('admin')}
              className="w-full flex items-center justify-between px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-200"
            >
              <span>Administration</span>
              {openSections.admin ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {(!collapsed ? openSections.admin : true) && (
            <div className="space-y-0.5 mt-0.5">
              <button
                onClick={() => handleNav('admin_users')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('admin_users') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Users"
              >
                <UserCog className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Users</span>}
              </button>

              <button
                onClick={() => handleNav('admin_permissions')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('admin_permissions') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Permissions"
              >
                <KeyRound className="w-4 h-4 shrink-0" />
                {!collapsed && <span>Permissions</span>}
              </button>

              <button
                onClick={() => handleNav('admin_alerts')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('admin_alerts') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Alerts Center"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>Alerts</span>}
                </div>
                {!collapsed && unreadAlertsCount > 0 && (
                  <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.2 rounded-full font-bold">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNav('admin_recycle_bin')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                  isNavActive('admin_recycle_bin') ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
                title="Recycle Bin"
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className="w-4 h-4 shrink-0 text-slate-400" />
                  {!collapsed && <span>Recycle Bin</span>}
                </div>
                {!collapsed && recycleBin.length > 0 && (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                    {recycleBin.length}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Admin User Footer Widget */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0 border border-slate-600">
            RS
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate">Rajan Shah</span>
              <span className="text-[10px] text-emerald-400 font-mono">System Admin</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

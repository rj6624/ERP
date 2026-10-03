import React, { useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { LabourSidebar } from './LabourSidebar';
import { LabourHeader } from './LabourHeader';
import { OperatorSidebar } from './OperatorSidebar';
import { OperatorHeader } from './OperatorHeader';
import { ManagerSidebar } from './ManagerSidebar';
import { ManagerHeader } from './ManagerHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { QuickActionModal } from '../common/QuickActionModal';
import { useERP } from '../../context/ERPContext';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1024);
  const { currentRole, currentPage } = useERP();
  const { pathname } = useLocation();

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)');
    const closeOnResize = () => setCollapsed(true);
    mobile.addEventListener('change', closeOnResize);
    return () => mobile.removeEventListener('change', closeOnResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) setCollapsed(true);
  }, [currentPage, currentRole, pathname]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCollapsed(true);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="erp-shell flex h-screen w-screen overflow-hidden font-sans">
      {!collapsed && (
        <button type="button" aria-label="Close navigation" className="erp-nav-backdrop md:hidden fixed inset-0 z-30 bg-slate-950/40" onClick={() => setCollapsed(true)} />
      )}
      {/* Role-Specific Sidebar */}
      {currentRole === 'Labour' ? (
        <LabourSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      ) : currentRole === 'Operator' ? (
        <OperatorSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      ) : currentRole === 'Admin' ? (
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      ) : (
        <ManagerSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {currentRole === 'Labour' ? (
          <LabourHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        ) : currentRole === 'Operator' ? (
          <OperatorHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        ) : currentRole === 'Admin' ? (
          <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        ) : (
          <ManagerHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        )}

        {/* Content Body */}
        <main className="erp-workspace flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 custom-scrollbar">
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal />
      <QuickActionModal />
    </div>
  );
};

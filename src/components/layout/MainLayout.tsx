import { Button } from '../ui/Primitives';
import React, { useState, useEffect, useRef, ReactNode } from 'react';
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
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollTopRef = useRef(0);
  const mainRef = useRef<HTMLElement | null>(null);

  const { currentRole, currentPage } = useERP();
  const { pathname } = useLocation();

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)');
    const closeOnResize = () => {
      setCollapsed(true);
      if (window.innerWidth >= 768) {
        setIsHeaderVisible(true);
      }
    };
    mobile.addEventListener('change', closeOnResize);
    window.addEventListener('resize', closeOnResize);
    return () => {
      mobile.removeEventListener('change', closeOnResize);
      window.removeEventListener('resize', closeOnResize);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) setCollapsed(true);
    setIsHeaderVisible(true);
    lastScrollTopRef.current = 0;
  }, [currentPage, currentRole, pathname]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCollapsed(true);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Mobile scroll down/up header hide and show listener
  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    let ticking = false;

    const onScroll = () => {
      if (window.innerWidth >= 768) {
        if (!isHeaderVisible) setIsHeaderVisible(true);
        return;
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollTop = container.scrollTop;
          const delta = currentScrollTop - lastScrollTopRef.current;

          // Always show when near the top of the page
          if (currentScrollTop <= 15) {
            setIsHeaderVisible(true);
          } else if (delta > 8 && currentScrollTop > 40) {
            // Scrolled down -> Hide header
            setIsHeaderVisible(false);
          } else if (delta < -6) {
            // Scrolled up -> Show header
            setIsHeaderVisible(true);
          }

          lastScrollTopRef.current = Math.max(0, currentScrollTop);
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isHeaderVisible]);

  return (
    <div className="erp-shell flex h-screen w-screen overflow-hidden font-sans">
      {!collapsed && (
        <Button variant="surface" type="button" aria-label="Close navigation" className="erp-nav-backdrop md:hidden fixed inset-0 z-30 bg-slate-950/40" onClick={() => setCollapsed(true)} />
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Animated Mobile Collapsible Header Wrapper */}
        <div
          className={`erp-header-wrapper shrink-0 z-20 ${
            !isHeaderVisible ? 'erp-header-hidden' : ''
          }`}
        >
          {currentRole === 'Labour' ? (
            <LabourHeader collapsed={collapsed} setCollapsed={setCollapsed} />
          ) : currentRole === 'Operator' ? (
            <OperatorHeader collapsed={collapsed} setCollapsed={setCollapsed} />
          ) : currentRole === 'Admin' ? (
            <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />
          ) : (
            <ManagerHeader collapsed={collapsed} setCollapsed={setCollapsed} />
          )}
        </div>

        {/* Content Body */}
        <main
          ref={mainRef}
          className="erp-workspace flex-1 overflow-y-auto px-6 py-5 space-y-5 custom-scrollbar"
        >
          {children}
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal />
      <QuickActionModal />
    </div>
  );
};

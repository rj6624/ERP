import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ERPProvider, useERP } from './context/ERPContext';
import { MainLayout } from './components/layout/MainLayout';

// Labour Dedicated Pages
import { LabourDashboardPage } from './pages/dashboard/LabourDashboardPage';
import { LabourMyWorkPage } from './pages/labour/LabourMyWorkPage';
import { LabourBindingWorkPage } from './pages/labour/LabourBindingWorkPage';
import { LabourOpenWorkPage } from './pages/labour/LabourOpenWorkPage';
import { LabourReportsPage } from './pages/reports/LabourReportsPage';

// Operator Dedicated Pages
import { OperatorDashboardPage } from './pages/dashboard/OperatorDashboardPage';
import { OperatorCreateInwardPage } from './pages/jobs/OperatorCreateInwardPage';
import { OperatorOutwardPage } from './pages/jobs/OperatorOutwardPage';
import { OperatorCreateOutwardPage } from './pages/jobs/OperatorCreateOutwardPage';
import { OperatorFastForwardPage } from './pages/jobs/OperatorFastForwardPage';
import { OperatorJobDetailPage } from './pages/jobs/OperatorJobDetailPage';
import { OperatorCustomerJobsPage } from './pages/customers/OperatorCustomerJobsPage';
import { OperatorReportsPage } from './pages/reports/OperatorReportsPage';

// Manager & Shared Pages
import { ManagerDashboardPage } from './pages/dashboard/ManagerDashboardPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CustomersListPage } from './pages/customers/CustomersListPage';
import { CustomerDetailPage } from './pages/customers/CustomerDetailPage';
import { InwardListPage } from './pages/jobs/InwardListPage';
import { CreateInwardPage } from './pages/jobs/CreateInwardPage';
import { OutwardListPage } from './pages/jobs/OutwardListPage';
import { CreateOutwardPage } from './pages/jobs/CreateOutwardPage';
import { JobDetailPage } from './pages/jobs/JobDetailPage';
import { FastForwardQueuePage } from './pages/jobs/FastForwardQueuePage';
import { LabourListPage } from './pages/labour/LabourListPage';
import { LabourBindingPage } from './pages/labour/LabourBindingPage';
import { LabourOpenPage } from './pages/labour/LabourOpenPage';
import { ChemicalStockPage } from './pages/stock/ChemicalStockPage';
import { AcidStockPage } from './pages/stock/AcidStockPage';
import { MetalStockPage } from './pages/stock/MetalStockPage';
import { TarStockPage } from './pages/stock/TarStockPage';
import { ScrapManagementPage } from './pages/stock/ScrapManagementPage';
import { ReportsCenterPage } from './pages/reports/ReportsCenterPage';
import { AlertsCenterPage } from './pages/administration/AlertsCenterPage';

// Admin Financial & Administrative Pages
import { PaymentDashboardPage } from './pages/payments/PaymentDashboardPage';
import { PaymentReceivedPage } from './pages/payments/PaymentReceivedPage';
import { PendingPaymentsPage } from './pages/payments/PendingPaymentsPage';
import { PromiseDatePendingPage } from './pages/payments/PromiseDatePendingPage';
import { BillsListPage } from './pages/billing/BillsListPage';
import { BillDetailPage } from './pages/billing/BillDetailPage';
import { UserManagementPage } from './pages/administration/UserManagementPage';
import { PermissionsMatrixPage } from './pages/administration/PermissionsMatrixPage';
import { RecycleBinPage } from './pages/administration/RecycleBinPage';

import { ShieldAlert } from 'lucide-react';

const AccessDeniedView: React.FC<{ title: string; message: string }> = ({ title, message }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-lg mx-auto my-12 p-8 bg-white rounded-2xl border border-red-200 shadow-sm text-center space-y-3 font-sans">
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{message}</p>
      <div className="pt-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="erp-btn-primary"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  const { currentRole } = useERP();

  return (
    <MainLayout>
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 1. DASHBOARD (Role-specific) */}
        <Route
          path="/dashboard"
          element={
            currentRole === 'Labour' ? (
              <LabourDashboardPage />
            ) : currentRole === 'Operator' ? (
              <OperatorDashboardPage />
            ) : currentRole === 'Admin' ? (
              <DashboardPage />
            ) : (
              <ManagerDashboardPage />
            )
          }
        />

        {/* 2. LABOUR USER ASSIGNED WORK */}
        <Route path="/my-work" element={<LabourMyWorkPage />} />
        <Route path="/labour/reports" element={<LabourReportsPage />} />

        {/* 3. CUSTOMER & JOB MANAGEMENT (Restricted for Labour) */}
        <Route
          path="/customers"
          element={
            currentRole === 'Labour' ? (
              <AccessDeniedView
                title="Customer Master Restricted"
                message="Labour Users do not have access to customer management."
              />
            ) : (
              <CustomersListPage />
            )
          }
        />
        <Route
          path="/customers/:id"
          element={
            currentRole === 'Labour' ? (
              <AccessDeniedView
                title="Customer Details Restricted"
                message="Labour Users do not have access to customer profile details."
              />
            ) : (
              <CustomerDetailPage />
            )
          }
        />
        <Route
          path="/customer-jobs"
          element={
            currentRole === 'Labour' ? (
              <AccessDeniedView
                title="Customer Ledger Restricted"
                message="Customer job ledgers are accessible only to Operators and Managers."
              />
            ) : (
              <OperatorCustomerJobsPage />
            )
          }
        />

        <Route
          path="/inward"
          element={
            currentRole === 'Labour' ? (
              <AccessDeniedView
                title="Customer Inward Restricted"
                message="Jewellery intake and scale weighing are handled by Factory Operators."
              />
            ) : (
              <InwardListPage />
            )
          }
        />
        <Route
          path="/inward/new"
          element={
            currentRole === 'Labour' ? (
              <AccessDeniedView
                title="Customer Inward Restricted"
                message="Jewellery intake is handled by Factory Operators."
              />
            ) : currentRole === 'Operator' ? (
              <OperatorCreateInwardPage />
            ) : (
              <CreateInwardPage />
            )
          }
        />

        <Route
          path="/outward"
          element={
            currentRole === 'Labour' ? (
              <AccessDeniedView
                title="Customer Outward Restricted"
                message="Jewellery outward dispatch and plating calculation are handled by Factory Operators."
              />
            ) : currentRole === 'Operator' ? (
              <OperatorOutwardPage />
            ) : (
              <OutwardListPage />
            )
          }
        />
        <Route
          path="/outward/new"
          element={
            currentRole === 'Labour' ? (
              <AccessDeniedView
                title="Customer Outward Restricted"
                message="Jewellery outward dispatch is handled by Factory Operators."
              />
            ) : currentRole === 'Operator' ? (
              <OperatorCreateOutwardPage />
            ) : (
              <CreateOutwardPage />
            )
          }
        />

        <Route
          path="/jobs/:id"
          element={
            currentRole === 'Labour' ? (
              <AccessDeniedView
                title="Job Traceability Restricted"
                message="Please use your assigned My Work screen for labour task details."
              />
            ) : currentRole === 'Operator' ? (
              <OperatorJobDetailPage />
            ) : (
              <JobDetailPage />
            )
          }
        />

        <Route
          path="/fast-forward"
          element={
            currentRole === 'Labour' ? (
              <AccessDeniedView
                title="Fast Forward Queue Restricted"
                message="Priority queues are processed by Factory Operators."
              />
            ) : currentRole === 'Operator' ? (
              <OperatorFastForwardPage />
            ) : (
              <FastForwardQueuePage />
            )
          }
        />

        {/* 4. LABOUR MODULE */}
        <Route
          path="/labour"
          element={
            currentRole === 'Labour' ? (
              <LabourMyWorkPage />
            ) : currentRole === 'Operator' ? (
              <AccessDeniedView
                title="Labour Module Restricted"
                message="Labour assignment and master records are supervised by Plant Managers."
              />
            ) : (
              <LabourListPage />
            )
          }
        />
        <Route
          path="/labour/binding"
          element={
            currentRole === 'Labour' ? (
              <LabourBindingWorkPage />
            ) : currentRole === 'Operator' ? (
              <AccessDeniedView
                title="Labour Binding Restricted"
                message="Labour binding operations are supervised by Plant Managers."
              />
            ) : (
              <LabourBindingPage />
            )
          }
        />
        <Route
          path="/labour/open"
          element={
            currentRole === 'Labour' ? (
              <LabourOpenWorkPage />
            ) : currentRole === 'Operator' ? (
              <AccessDeniedView
                title="Labour Open Restricted"
                message="Labour open work operations are supervised by Plant Managers."
              />
            ) : (
              <LabourOpenPage />
            )
          }
        />

        {/* 5. STOCK & INVENTORY (Restricted for Operator & Labour) */}
        <Route
          path="/stock/chemicals"
          element={
            currentRole === 'Operator' || currentRole === 'Labour' ? (
              <AccessDeniedView
                title="Inventory Access Restricted"
                message="Chemical tank formulations and stock levels are restricted to Plant Management."
              />
            ) : (
              <ChemicalStockPage />
            )
          }
        />
        <Route
          path="/stock/acids"
          element={
            currentRole === 'Operator' || currentRole === 'Labour' ? (
              <AccessDeniedView
                title="Inventory Access Restricted"
                message="Acid stocks are restricted to Plant Management."
              />
            ) : (
              <AcidStockPage />
            )
          }
        />
        <Route
          path="/stock/metals"
          element={
            currentRole === 'Operator' || currentRole === 'Labour' ? (
              <AccessDeniedView
                title="Inventory Access Restricted"
                message="Precious metal reserves are restricted to Plant Management."
              />
            ) : (
              <MetalStockPage />
            )
          }
        />
        <Route
          path="/stock/tar"
          element={
            currentRole === 'Operator' || currentRole === 'Labour' ? (
              <AccessDeniedView
                title="Inventory Access Restricted"
                message="Tar transaction logs and bulk inventory are restricted to Plant Management."
              />
            ) : (
              <TarStockPage />
            )
          }
        />
        <Route
          path="/stock/scrap"
          element={
            currentRole === 'Operator' || currentRole === 'Labour' ? (
              <AccessDeniedView
                title="Inventory Access Restricted"
                message="Scrap recovery ledgers are restricted to Plant Management."
              />
            ) : (
              <ScrapManagementPage />
            )
          }
        />

        {/* 6. OPERATIONAL REPORTS */}
        <Route
          path="/reports"
          element={
            currentRole === 'Labour' ? (
              <LabourReportsPage />
            ) : currentRole === 'Operator' ? (
              <OperatorReportsPage />
            ) : (
              <ReportsCenterPage />
            )
          }
        />
        <Route
          path="/reports/:category"
          element={
            currentRole === 'Labour' ? (
              <LabourReportsPage />
            ) : currentRole === 'Operator' ? (
              <OperatorReportsPage />
            ) : (
              <ReportsCenterPage />
            )
          }
        />

        {/* 6. ALERTS */}
        <Route path="/alerts" element={<AlertsCenterPage />} />

        {/* 7. ADMIN FINANCIAL & BILLING MODULES (Strict Security Protection) */}
        <Route
          path="/admin/payments"
          element={
            currentRole === 'Admin' ? (
              <PaymentDashboardPage />
            ) : (
              <AccessDeniedView
                title="Restricted Financial Module"
                message="Payment received records, financial billing amounts, and collection reports are restricted to authorized Admin accounts."
              />
            )
          }
        />
        <Route
          path="/admin/payments/received"
          element={
            currentRole === 'Admin' ? (
              <PaymentReceivedPage />
            ) : (
              <AccessDeniedView
                title="Restricted Financial Module"
                message="Payment records are restricted to authorized Admin accounts."
              />
            )
          }
        />
        <Route
          path="/admin/payments/pending"
          element={
            currentRole === 'Admin' ? (
              <PendingPaymentsPage />
            ) : (
              <AccessDeniedView
                title="Restricted Financial Module"
                message="Pending payment ledger is restricted to authorized Admin accounts."
              />
            )
          }
        />
        <Route
          path="/admin/payments/promise-dates"
          element={
            currentRole === 'Admin' ? (
              <PromiseDatePendingPage />
            ) : (
              <AccessDeniedView
                title="Restricted Financial Module"
                message="Payment promise reports are restricted to authorized Admin accounts."
              />
            )
          }
        />
        <Route
          path="/admin/bills"
          element={
            currentRole === 'Admin' ? (
              <BillsListPage />
            ) : (
              <AccessDeniedView
                title="Restricted Financial Module"
                message="Customer billing invoices are restricted to authorized Admin accounts."
              />
            )
          }
        />
        <Route
          path="/admin/bills/:id"
          element={
            currentRole === 'Admin' ? (
              <BillDetailPage />
            ) : (
              <AccessDeniedView
                title="Restricted Financial Module"
                message="Billing details are restricted to authorized Admin accounts."
              />
            )
          }
        />

        {/* 8. ADMIN PRIVILEGED CONTROLS */}
        <Route
          path="/admin/users"
          element={
            currentRole === 'Admin' ? (
              <UserManagementPage />
            ) : (
              <AccessDeniedView
                title="Administrative Control Restricted"
                message="User credential management requires System Administrator credentials."
              />
            )
          }
        />
        <Route
          path="/admin/permissions"
          element={
            currentRole === 'Admin' ? (
              <PermissionsMatrixPage />
            ) : (
              <AccessDeniedView
                title="Administrative Control Restricted"
                message="Permission assignments require System Administrator credentials."
              />
            )
          }
        />
        <Route
          path="/admin/recycle-bin"
          element={
            currentRole === 'Admin' ? (
              <RecycleBinPage />
            ) : (
              <AccessDeniedView
                title="Administrative Control Restricted"
                message="System recycle recovery requires System Administrator credentials."
              />
            )
          }
        />

        {/* Catch-all 404 fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <ERPProvider>
        <AppRoutes />
      </ERPProvider>
    </BrowserRouter>
  );
}

export default App;

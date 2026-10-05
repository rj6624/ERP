import { Button, Card } from '../../components/ui/Primitives';
import React from 'react';
import { useERP } from '../../context/ERPContext';
import { KeyRound, ShieldCheck, Lock, Check, X, ShieldAlert } from 'lucide-react';

export const PermissionsMatrixPage: React.FC = () => {
  const { setCurrentPage } = useERP();

  const matrix = [
    {
      module: 'Customers Master',
      admin: { view: true, create: true, edit: true, delete: true, export: true },
      manager: { view: true, create: true, edit: true, delete: false, export: true },
      operator: { view: true, create: true, edit: false, delete: false, export: false },
      labour: { view: false, create: false, edit: false, delete: false, export: false },
    },
    {
      module: 'Inward Operations',
      admin: { view: true, create: true, edit: true, delete: true, export: true },
      manager: { view: true, create: true, edit: true, delete: true, export: true },
      operator: { view: true, create: true, edit: true, delete: false, export: true },
      labour: { view: true, create: false, edit: false, delete: false, export: false },
    },
    {
      module: 'Outward Operations',
      admin: { view: true, create: true, edit: true, delete: true, export: true },
      manager: { view: true, create: true, edit: true, delete: true, export: true },
      operator: { view: true, create: true, edit: true, delete: false, export: true },
      labour: { view: false, create: false, edit: false, delete: false, export: false },
    },
    {
      module: 'Labour & Tar Usage',
      admin: { view: true, create: true, edit: true, delete: true, export: true },
      manager: { view: true, create: true, edit: true, delete: true, export: true },
      operator: { view: true, create: true, edit: false, delete: false, export: false },
      labour: { view: true, create: true, edit: true, delete: false, export: false },
    },
    {
      module: 'Stock & Inventory',
      admin: { view: true, create: true, edit: true, delete: true, export: true },
      manager: { view: true, create: true, edit: true, delete: false, export: true },
      operator: { view: true, create: false, edit: false, delete: false, export: false },
      labour: { view: false, create: false, edit: false, delete: false, export: false },
    },
    {
      module: 'Billing & Invoicing',
      admin: { view: true, create: true, edit: true, delete: true, export: true },
      manager: { view: true, create: true, edit: true, delete: false, export: true },
      operator: { view: false, create: false, edit: false, delete: false, export: false },
      labour: { view: false, create: false, edit: false, delete: false, export: false },
    },
    {
      module: 'Payments & Receivables',
      restricted: true,
      admin: { view: true, create: true, edit: true, delete: true, export: true },
      manager: { view: false, create: false, edit: false, delete: false, export: false },
      operator: { view: false, create: false, edit: false, delete: false, export: false },
      labour: { view: false, create: false, edit: false, delete: false, export: false },
    },
    {
      module: 'Reports Center',
      admin: { view: true, create: true, edit: true, delete: true, export: true },
      manager: { view: true, create: false, edit: false, delete: false, export: true },
      operator: { view: false, create: false, edit: false, delete: false, export: false },
      labour: { view: false, create: false, edit: false, delete: false, export: false },
    },
    {
      module: 'Alerts & Thresholds',
      admin: { view: true, create: true, edit: true, delete: true, export: true },
      manager: { view: true, create: false, edit: false, delete: false, export: false },
      operator: { view: true, create: false, edit: false, delete: false, export: false },
      labour: { view: false, create: false, edit: false, delete: false, export: false },
    },
    {
      module: 'Recycle Bin & Purge',
      admin: { view: true, create: true, edit: true, delete: true, export: true },
      manager: { view: false, create: false, edit: false, delete: false, export: false },
      operator: { view: false, create: false, edit: false, delete: false, export: false },
      labour: { view: false, create: false, edit: false, delete: false, export: false },
    },
    {
      module: 'User Administration',
      admin: { view: true, create: true, edit: true, delete: true, export: true },
      manager: { view: false, create: false, edit: false, delete: false, export: false },
      operator: { view: false, create: false, edit: false, delete: false, export: false },
      labour: { view: false, create: false, edit: false, delete: false, export: false },
    },
  ];

  const renderBadge = (hasAccess: boolean) => {
    if (hasAccess) {
      return (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-100 text-emerald-800">
          <Check className="w-3.5 h-3.5" />
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-100 text-slate-400">
        <X className="w-3.5 h-3.5" />
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* List Header */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Role-Based Access & Permissions Matrix</h2>
          <p className="text-xs text-slate-500">
            Admin has full control across all ERP operational and financial modules. Financial payments are strictly isolated to Admin.
          </p>
        </div>

        <Button variant="primary"
          onClick={() => setCurrentPage('admin_users')}
          className="self-start sm:self-auto"
        >
          Manage Users
        </Button>
      </div>

      {/* Permissions Matrix Table */}
      <Card padding="none" className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
        <table className="erp-table">
          <thead>
            <tr>
              <th className="erp-th w-56">ERP Module / Domain</th>
              <th className="erp-th text-center bg-emerald-50 text-emerald-950 border-r border-emerald-200">
                <span className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Admin (Full Authority)
                </span>
              </th>
              <th className="erp-th text-center">Manager</th>
              <th className="erp-th text-center">Scale Operator</th>
              <th className="erp-th text-center">Labour User</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {matrix.map((row, idx) => (
              <tr key={idx} className={`hover:bg-slate-50/80 ${row.restricted ? 'bg-amber-50/20' : ''}`}>
                <td className="erp-td">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{row.module}</span>
                    {row.restricted && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded">
                        Admin Only
                      </span>
                    )}
                  </div>
                </td>

                {/* Admin */}
                <td className="erp-td text-center bg-emerald-50/40 border-r border-emerald-100">
                  <div className="flex items-center justify-center gap-1 font-mono text-2xs">
                    <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded font-bold">ALL</span>
                    <span className="text-emerald-700">View • Create • Edit • Delete • Export</span>
                  </div>
                </td>

                {/* Manager */}
                <td className="erp-td text-center">
                  <div className="flex items-center justify-center gap-2">
                    {renderBadge(row.manager.view)}
                    {renderBadge(row.manager.create)}
                    {renderBadge(row.manager.edit)}
                    {renderBadge(row.manager.delete)}
                  </div>
                </td>

                {/* Operator */}
                <td className="erp-td text-center">
                  <div className="flex items-center justify-center gap-2">
                    {renderBadge(row.operator.view)}
                    {renderBadge(row.operator.create)}
                    {renderBadge(row.operator.edit)}
                    {renderBadge(row.operator.delete)}
                  </div>
                </td>

                {/* Labour */}
                <td className="erp-td text-center">
                  <div className="flex items-center justify-center gap-2">
                    {renderBadge(row.labour.view)}
                    {renderBadge(row.labour.create)}
                    {renderBadge(row.labour.edit)}
                    {renderBadge(row.labour.delete)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <span>Matrix Key: View • Create • Edit • Delete Permissions</span>
        <span className="font-mono text-emerald-800 font-bold">Admin: Complete System Clearance</span>
      </div>
    </div>
  );
};

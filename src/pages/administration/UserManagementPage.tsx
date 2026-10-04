import { Button, Input, Select } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { AppUser, UserRole, UserStatus } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { UserCog, UserPlus, ShieldCheck, KeyRound, Lock, Unlock } from 'lucide-react';
import { formatDate, formatDateTime } from '../../utils/formatters';

export const UserManagementPage: React.FC = () => {
  const { users, addUser, toggleUserStatus, setCurrentPage } = useERP();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Operator');

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addUser({
      name,
      email,
      role,
      status: 'Active',
    });

    setName('');
    setEmail('');
    setIsAddModalOpen(false);
  };

  const columns: ColumnDef<AppUser>[] = [
    {
      header: 'Staff Name',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900">{row.name}</span>
          <p className="text-2xs text-slate-400 font-mono">{row.id}</p>
        </div>
      ),
    },
    {
      header: 'Internal Email / Login',
      accessorKey: 'email',
      sortable: true,
      cell: (row) => <span className="font-mono text-slate-700 text-xs">{row.email}</span>,
    },
    {
      header: 'Assigned Role',
      accessorKey: 'role',
      sortable: true,
      cell: (row) => {
        if (row.role === 'Admin') {
          return (
            <span className="px-2 py-0.5 rounded text-2xs font-extrabold bg-emerald-900 text-emerald-300 border border-emerald-700">
              Admin (Full Control)
            </span>
          );
        }
        if (row.role === 'Manager') {
          return (
            <span className="px-2 py-0.5 rounded text-2xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Manager
            </span>
          );
        }
        if (row.role === 'Operator') {
          return (
            <span className="px-2 py-0.5 rounded text-2xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              Scale Operator
            </span>
          );
        }
        return (
          <span className="px-2 py-0.5 rounded text-2xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            Labour Worker
          </span>
        );
      },
    },
    {
      header: 'Last System Login',
      accessorKey: 'lastLogin',
      sortable: true,
      cell: (row) => <span className="text-slate-600 text-xs">{formatDateTime(row.lastLogin)}</span>,
    },
    {
      header: 'Account Status',
      accessorKey: 'status',
      sortable: true,
      cell: (row) => <StatusBadge type="user" value={row.status} />,
    },
    {
      header: 'Actions',
      sortable: false,
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button variant="secondary"
            onClick={() => setCurrentPage('admin_permissions')}
            className="text-2xs flex items-center gap-1"
            title="Permissions"
          >
            <KeyRound className="w-3.5 h-3.5" /> Permissions
          </Button>
          {row.role !== 'Admin' && (
            <Button variant="secondary"
              onClick={() => toggleUserStatus(row.id)}
              className=""
              title={row.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
            >
              {row.status === 'Active' ? <Lock className="w-3.5 h-3.5 text-red-500" /> : <Unlock className="w-3.5 h-3.5 text-emerald-600" />}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="erp-list-intro flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCog className="w-4 h-4 text-slate-700" /> Staff & User Access Management
          </h2>
          <p className="text-xs text-slate-500">
            System user accounts, operational roles, and credential administration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary"
            onClick={() => setCurrentPage('admin_permissions')}
            className=""
          >
            <KeyRound className="w-3.5 h-3.5" /> View Permissions Matrix
          </Button>
          <Button variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className=""
          >
            <UserPlus className="w-3.5 h-3.5" /> Add System User
          </Button>
        </div>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchPlaceholder="Search system staff..."
        exportFilename="erp_users_list"
      />

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add System Staff Account"
        subtitle="Configure role and access permissions for factory personnel"
        maxWidth="md"
        footer={
          <>
            <Button variant="secondary"
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className=""
            >
              Cancel
            </Button>
            <Button variant="primary"
              type="button"
              onClick={handleAddUserSubmit}
              className=""
            >
              Create Account
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddUserSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Amit Dave"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Work Email / Login Identifier <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="amit.manager@platingerp.internal"
              className="font-mono w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              System Role <span className="text-red-500">*</span>
            </label>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full"
            >
              <option value="Manager">Manager (Operations, Inventory, Inward/Outward)</option>
              <option value="Operator">Operator (Scale Inward/Outward only)</option>
              <option value="Labour User">Labour User (Binding & Open tasks)</option>
              <option value="Admin">Admin (Full Access + Payment Authority)</option>
            </Select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

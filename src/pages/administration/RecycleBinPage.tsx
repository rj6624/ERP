import { Button } from '../../components/ui/Primitives';
import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { RecycleBinItem } from '../../types/erp';
import { DataTable, ColumnDef } from '../../components/common/DataTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Trash2, RotateCcw, ShieldAlert, AlertTriangle } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const RecycleBinPage: React.FC = () => {
  const {
    recycleBin,
    restoreFromRecycleBin,
    permanentDeleteRecycleItem,
    emptyRecycleBin,
  } = useERP();

  const [restoringItem, setRestoringItem] = useState<RecycleBinItem | null>(null);
  const [purgingItem, setPurgingItem] = useState<RecycleBinItem | null>(null);
  const [isEmptyingBin, setIsEmptyingBin] = useState(false);

  const columns: ColumnDef<RecycleBinItem>[] = [
    {
      header: 'Record / Entity',
      accessorKey: 'recordName',
      sortable: true,
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900">{row.recordName}</span>
          <p className="text-2xs text-slate-400 font-mono">Original ID: {row.originalId}</p>
        </div>
      ),
    },
    {
      header: 'Module',
      accessorKey: 'module',
      sortable: true,
      cell: (row) => (
        <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {row.module}
        </span>
      ),
    },
    {
      header: 'Deleted By',
      accessorKey: 'deletedBy',
      sortable: true,
      cell: (row) => <span className="font-medium text-slate-800 text-xs">{row.deletedBy}</span>,
    },
    {
      header: 'Deletion Timestamp',
      accessorKey: 'deletedDate',
      sortable: true,
      cell: (row) => <span className="text-slate-600 text-xs">{formatDateTime(row.deletedDate)}</span>,
    },
    {
      header: 'Record Details / Summary',
      accessorKey: 'summary',
      cell: (row) => <span className="text-slate-600 text-xs">{row.summary}</span>,
    },
    {
      header: 'Actions',
      sortable: false,
      align: 'right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost"
            onClick={() => setRestoringItem(row)}
            className="inline-flex items-center gap-1 text-2xs transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Restore Record
          </Button>
          <Button variant="ghost" size="icon"
            onClick={() => setPurgingItem(row)}
            className="transition-colors"
            title="Permanent Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="erp-light-panel bg-slate-900 text-white p-5 rounded-lg border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-slate-400" />
            <h2 className="text-sm font-bold tracking-wide uppercase text-white">
              Admin Recycle Bin & Soft-Deleted Audit Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Deleted records are safely archived here. Admin can audit and restore records back into the active database or purge permanently.
          </p>
        </div>

        {recycleBin.length > 0 && (
          <Button variant="danger"
            onClick={() => setIsEmptyingBin(true)}
            className="self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" /> Empty Recycle Bin
          </Button>
        )}
      </div>

      <DataTable
        data={recycleBin}
        columns={columns}
        searchPlaceholder="Search deleted records..."
        emptyTitle="Recycle Bin is Empty"
        emptyDescription="No soft-deleted customer accounts, jobs, or inventory records in archive."
        exportFilename="recycle_bin_audit"
      />

      {/* Restore Dialog */}
      {restoringItem && (
        <ConfirmDialog
          isOpen={!!restoringItem}
          onClose={() => setRestoringItem(null)}
          onConfirm={() => restoreFromRecycleBin(restoringItem.id)}
          title={`Restore "${restoringItem.recordName}"?`}
          message={`This will reinstate this ${restoringItem.module} record back to the active production database with full historical integrity.`}
          confirmText="Restore Record"
          variant="primary"
          icon="restore"
        />
      )}

      {/* Permanent Delete Dialog */}
      {purgingItem && (
        <ConfirmDialog
          isOpen={!!purgingItem}
          onClose={() => setPurgingItem(null)}
          onConfirm={() => permanentDeleteRecycleItem(purgingItem.id)}
          title={`Permanently Purge "${purgingItem.recordName}"?`}
          message="WARNING: This action cannot be undone. All audit data for this record will be irreversibly erased from the system."
          confirmText="Permanently Erase"
          variant="danger"
          icon="trash"
        />
      )}

      {/* Empty Bin Dialog */}
      {isEmptyingBin && (
        <ConfirmDialog
          isOpen={isEmptyingBin}
          onClose={() => setIsEmptyingBin(false)}
          onConfirm={emptyRecycleBin}
          title="Empty Entire Recycle Bin?"
          message="Are you sure you want to permanently erase all records in the Recycle Bin? This action is non-reversible."
          confirmText="Empty Bin"
          variant="danger"
          icon="trash"
        />
      )}
    </div>
  );
};

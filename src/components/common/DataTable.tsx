import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Download,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';
import { EmptyState } from './EmptyState';

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  onRowClick?: (item: T) => void;
  actions?: React.ReactNode;
  exportFilename?: string;
  enableSelection?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  initialPageSize?: number;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  title,
  subtitle,
  searchPlaceholder = 'Search records...',
  onRowClick,
  actions,
  exportFilename = 'erp_export',
  enableSelection = false,
  onSelectionChange,
  emptyTitle = 'No records found',
  emptyDescription = 'No matching records found in this view.',
  initialPageSize = 10,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [density, setDensity] = useState<'compact' | 'normal'>('normal');
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((item) =>
      Object.values(item as any).some((val) => {
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(term);
      })
    );
  }, [data, searchTerm]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key?: keyof T, sortable?: boolean) => {
    if (!key || sortable === false) return;
    if (sortKey === key) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else {
        setSortKey(null);
        setSortOrder('asc');
      }
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(paginatedData.map((item) => item.id ?? JSON.stringify(item)));
      setSelectedIds(allIds);
      if (onSelectionChange) onSelectionChange(paginatedData);
    } else {
      setSelectedIds(new Set());
      if (onSelectionChange) onSelectionChange([]);
    }
  };

  const handleSelectRow = (item: T) => {
    const id = item.id ?? JSON.stringify(item);
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
    if (onSelectionChange) {
      const selectedItems = data.filter((d) => next.has(d.id ?? JSON.stringify(d)));
      onSelectionChange(selectedItems);
    }
  };

  const handleExportCSV = () => {
    const headers = columns.map((col) => col.header);
    const rows = sortedData.map((item) =>
      columns.map((col) => {
        if (col.accessorKey) {
          return String((item as any)[col.accessorKey] ?? '');
        }
        return '';
      })
    );
    exportToCSV(exportFilename, headers, rows);
  };

  const rowPadding = density === 'compact' ? 'py-2 px-3 text-xs' : 'py-3 px-3.5 text-xs';

  return (
    <div className="erp-data-table min-w-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-3.5 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          {title && <h3 className="text-sm font-bold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="pl-8 pr-3 py-1.5 rounded-md border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 w-full sm:w-56"
            />
          </div>

          {/* Density switch */}
          <button
            onClick={() => setDensity(density === 'compact' ? 'normal' : 'compact')}
            className="hidden sm:block p-1.5 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"
            title="Toggle Row Density"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-medium"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          {actions}
        </div>
      </div>

      {/* Table Element */}
      <div className="sm:hidden p-3 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Sort records"
            className="erp-input flex-1 min-w-0"
            value={sortKey ? String(sortKey) : ''}
            onChange={(event) => {
              setSortKey((event.target.value || null) as keyof T | null);
              setSortOrder('asc');
            }}
          >
            <option value="">Original order</option>
            {columns.filter((col) => col.accessorKey && col.sortable !== false).map((col) => (
              <option key={String(col.accessorKey)} value={String(col.accessorKey)}>{col.header}</option>
            ))}
          </select>
          {sortKey && <button type="button" className="erp-btn-secondary" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} aria-label="Reverse sort order">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</button>}
          {enableSelection && <label className="flex items-center gap-2 w-full py-2"><input type="checkbox" checked={paginatedData.length > 0 && paginatedData.every((item) => selectedIds.has(item.id ?? JSON.stringify(item)))} onChange={handleSelectAll} /> Select this page</label>}
        </div>
        {paginatedData.length ? paginatedData.map((row, index) => (
          <article key={row.id ?? index} className="rounded-lg border border-slate-200 p-3 space-y-2 bg-slate-50/50">
            {enableSelection && <label className="flex items-center gap-2 py-2"><input type="checkbox" checked={selectedIds.has(row.id ?? JSON.stringify(row))} onChange={() => handleSelectRow(row)} /> Select record {index + 1}</label>}
            <dl className="space-y-2">
              {columns.map((col, columnIndex) => (
                <div key={columnIndex} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3 items-start">
                  <dt className="text-xs text-slate-500 pt-0.5">{col.header}</dt>
                  <dd className="min-w-0 text-sm text-slate-800 break-words [&>*]:max-w-full [&_.flex]:flex-wrap">
                    {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? '-') : '-'}
                  </dd>
                </div>
              ))}
            </dl>
            {onRowClick && <button type="button" className="erp-btn-secondary w-full" onClick={() => onRowClick(row)}>View details <ChevronRight className="w-4 h-4" /></button>}
          </article>
        )) : <EmptyState title={emptyTitle} description={emptyDescription} />}
      </div>
      <div className="hidden sm:block overflow-x-auto">
        <table className="erp-table">
          <thead>
            <tr>
              {enableSelection && (
                <th className="erp-th w-10 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedData.length > 0 && paginatedData.every((i) => selectedIds.has(i.id ?? JSON.stringify(i)))}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                </th>
              )}
              {columns.map((col, idx) => {
                const isSorted = sortKey === col.accessorKey;
                const alignClass =
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left';

                return (
                  <th
                    key={idx}
                    onClick={() => handleSort(col.accessorKey, col.sortable)}
                    style={{ width: col.width }}
                    className={`erp-th ${alignClass} ${
                      col.sortable !== false ? 'cursor-pointer hover:bg-slate-100/80 transition-colors' : ''
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-1 ${
                        col.align === 'right' ? 'justify-end w-full' : ''
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable !== false && (
                        <span className="text-slate-400">
                          {isSorted ? (
                            sortOrder === 'asc' ? (
                              <ChevronUp className="w-3.5 h-3.5 text-slate-800" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-800" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => {
                const rowId = row.id ?? JSON.stringify(row);
                const isSelected = selectedIds.has(rowId);

                return (
                  <tr
                    key={rowIdx}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${isSelected ? 'bg-brand-50/40' : ''}`}
                  >
                    {enableSelection && (
                      <td
                        className="erp-td text-center w-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                      </td>
                    )}
                    {columns.map((col, cIdx) => {
                      const alignClass =
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left';

                      return (
                        <td key={cIdx} className={`${rowPadding} ${alignClass} erp-td`}>
                          {col.cell
                            ? col.cell(row)
                            : col.accessorKey
                            ? String((row as any)[col.accessorKey] ?? '-')
                            : '-'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (enableSelection ? 1 : 0)}
                  className="p-4 text-center"
                >
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-3.5 py-2.5 border-t border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex flex-wrap justify-center items-center gap-3">
          <span>
            Showing <strong>{sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, sortedData.length)}</strong> of{' '}
            <strong>{sortedData.length}</strong> records
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-slate-500">Rows:</span>
            <select
              aria-label="Records per page"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded border border-slate-300 py-0.5 px-1.5 text-xs bg-white focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            aria-label="Previous page"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-0.5 text-xs font-semibold text-slate-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            aria-label="Next page"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

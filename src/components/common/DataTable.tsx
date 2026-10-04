import { Button, Card, Input, Select } from '../ui/Primitives';
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
  LayoutGrid,
  List,
  ArrowUp,
  ArrowDown,
  X,
} from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';
import { EmptyState } from './EmptyState';

export type DataTableViewMode = 'table' | 'card';

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
  viewMode?: DataTableViewMode;
  defaultViewMode?: DataTableViewMode;
  onViewModeChange?: (mode: DataTableViewMode) => void;
  showViewToggle?: boolean;
  renderCard?: (item: T, index: number) => React.ReactNode;
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
  viewMode: controlledViewMode,
  defaultViewMode = 'table',
  onViewModeChange,
  showViewToggle = true,
  renderCard,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [density, setDensity] = useState<'compact' | 'normal'>('normal');
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [internalViewMode, setInternalViewMode] = useState<DataTableViewMode>(defaultViewMode);

  const currentViewMode = controlledViewMode !== undefined ? controlledViewMode : internalViewMode;

  const handleViewModeChange = (mode: DataTableViewMode) => {
    if (controlledViewMode === undefined) {
      setInternalViewMode(mode);
    }
    if (onViewModeChange) {
      onViewModeChange(mode);
    }
  };

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

  const rowPadding = density === 'compact' ? 'py-2.5 px-3.5 text-xs' : 'py-3.5 px-4 text-xs';

  // Render Top Toolbar Bar (Separate from table)
  const renderTopBar = () => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Title / Subtitle if provided, or Search box */}
      <div className="flex items-center gap-3 flex-1">
        {(title || subtitle) && (
          <div className="min-w-0 pr-2">
            {title && <h3 className="text-sm font-bold text-slate-900 truncate">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 truncate mt-0.5">{subtitle}</p>}
          </div>
        )}

        {/* Search Box on Left */}
        <div className="relative flex-1 sm:max-w-xs min-w-[180px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="erp-toolbar-control pl-8 pr-7 w-full text-xs ds-control-leading py-0"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Right End: Filter (Density), Export, Actions, and View Switcher */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {/* Filter / Density toggle button */}
        {currentViewMode === 'table' && (
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setDensity(density === 'compact' ? 'normal' : 'compact')}
            className="erp-toolbar-control w-9 inline-flex shrink-0 aspect-square p-0 justify-center items-center"
            title="Toggle Row Density"
            aria-label="Toggle Row Density"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </Button>
        )}

        {/* CSV Export */}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExportCSV}
          className="erp-toolbar-control inline-flex items-center gap-1.5 px-3 text-xs shrink-0 py-0"
          title="Export CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export</span>
        </Button>

        {actions}

        {/* Reference-Styled Icon Segmented View Switcher Pill */}
        {showViewToggle && (
          <div className="erp-toolbar-control inline-flex items-center p-1 bg-white border border-slate-200 shadow-none gap-1 shrink-0">
            {/* Cards / Grid View Button */}
            <button
              type="button"
              onClick={() => handleViewModeChange('card')}
              className={`h-7 w-7 flex items-center justify-center rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer ${
                currentViewMode === 'card'
                  ? 'bg-[#081c05] text-white'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
              title="Cards View"
              aria-label="Cards View"
              aria-pressed={currentViewMode === 'card'}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            {/* Table / List View Button */}
            <button
              type="button"
              onClick={() => handleViewModeChange('table')}
              className={`h-7 w-7 flex items-center justify-center rounded-[var(--ds-radius-sm,6px)] transition-all cursor-pointer ${
                currentViewMode === 'table'
                  ? 'bg-[#081c05] text-white'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
              title="Table View"
              aria-label="Table View"
              aria-pressed={currentViewMode === 'table'}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render Pagination Footer
  const renderPaginationFooter = () => (
    <>
      <div className="flex flex-wrap justify-center items-center gap-3">
        <span>
          Showing <strong>{sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
          <strong>{Math.min(currentPage * pageSize, sortedData.length)}</strong> of{' '}
          <strong>{sortedData.length}</strong> records
        </span>
        <div className="flex items-center gap-1.5 ml-2">
          <span className="text-slate-500">Rows:</span>
          <Select
            aria-label="Records per page"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-8 py-0.5 text-xs"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="secondary" size="icon"
          aria-label="Previous page"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="disabled:opacity-40 disabled:cursor-not-allowed h-8 w-8"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>
        <span className="px-2 py-0.5 text-xs font-semibold text-slate-800">
          Page {currentPage} of {totalPages}
        </span>
        <Button variant="secondary" size="icon"
          aria-label="Next page"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="disabled:opacity-40 disabled:cursor-not-allowed h-8 w-8"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </>
  );

  return (
    <div className="erp-data-table min-w-0 space-y-3.5 font-sans">
      {/* 1. SEPARATE TOP SEARCH & CONTROLS BAR */}
      {renderTopBar()}

      {/* 2. MAIN CONTENT (SEPARATED FROM SEARCH BAR) */}
      {currentViewMode === 'card' ? (
        /* CARD VIEW */
        <div className="space-y-3.5">
          {enableSelection && paginatedData.length > 0 && (
            <div className="bg-white px-4 py-2.5 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
                <Input
                  type="checkbox"
                  checked={paginatedData.length > 0 && paginatedData.every((item) => selectedIds.has(item.id ?? JSON.stringify(item)))}
                  onChange={handleSelectAll}
                />
                <span>Select all {paginatedData.length} cards on this page</span>
              </label>
              {selectedIds.size > 0 && (
                <span className="text-emerald-700 font-semibold">{selectedIds.size} selected</span>
              )}
            </div>
          )}

          {paginatedData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {paginatedData.map((row, index) => {
                if (renderCard) {
                  return (
                    <React.Fragment key={row.id ?? index}>
                      {renderCard(row, index)}
                    </React.Fragment>
                  );
                }
                const rowId = row.id ?? JSON.stringify(row);
                const isSelected = selectedIds.has(rowId);
                return (
                  <article
                    key={rowId}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-md hover:border-slate-300 transition-all ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${isSelected ? 'ring-2 ring-emerald-500/40 bg-emerald-50/20' : ''} flex flex-col justify-between space-y-3 group`}
                  >
                    {enableSelection && (
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 pb-2 border-b border-slate-100" onClick={(e) => e.stopPropagation()}>
                        <Input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row)}
                        />
                        <span>Select record</span>
                      </label>
                    )}
                    <dl className="space-y-2 text-xs">
                      {columns.map((col, columnIndex) => (
                        <div key={columnIndex} className="flex items-start justify-between gap-2">
                          <dt className="text-slate-500 font-medium">{col.header}</dt>
                          <dd className="min-w-0 text-slate-900 font-semibold text-right break-words">
                            {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? '-') : '-'}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {onRowClick && (
                      <Button variant="secondary" size="sm" type="button" className="w-full text-xs" onClick={() => onRowClick(row)}>
                        View Details <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs">
              <EmptyState title={emptyTitle} description={emptyDescription} />
            </div>
          )}

          {/* Clean Standalone Pagination Bar for Card View */}
          <div className="px-4 py-3 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
            {renderPaginationFooter()}
          </div>
        </div>
      ) : (
        /* TABLE VIEW (STANDALONE CARD CONTAINER SEPARATE FROM TOP BAR) */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden p-0">
          <div className="overflow-x-auto w-full">
            <table className="erp-table w-full">
              <thead>
                <tr>
                  {enableSelection && (
                    <th className="erp-th w-10 text-center">
                      <Input
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
                            <Input
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
                      className="p-8 text-center"
                    >
                      <EmptyState title={emptyTitle} description={emptyDescription} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
            {renderPaginationFooter()}
          </div>
        </div>
      )}
    </div>
  );
}

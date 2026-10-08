/**
 * Export and Print Utilities for Plating Management ERP
 */

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const val = cell !== undefined && cell !== null ? String(cell) : '';
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTableToCSV<T>(
  filename: string,
  columns: { header: string; accessorKey?: any }[],
  data: T[]
) {
  const validCols = columns.filter((col) => col.header && col.header !== 'Actions');
  const headers = validCols.map((col) => col.header);
  const rows = data.map((item) =>
    validCols.map((col) => {
      if (col.accessorKey) {
        return String((item as any)[col.accessorKey] ?? '');
      }
      return '';
    })
  );
  exportToCSV(filename, headers, rows);
}

export function triggerPrint() {
  window.print();
}


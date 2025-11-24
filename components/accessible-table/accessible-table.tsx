'use client';

import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import type { SortDirection } from '@/types/accessible-table';

/**
 * Reusable Accessible Table Component
 * 
 * This component demonstrates how to build a fully accessible table using divs
 * with proper ARIA roles instead of semantic HTML table elements.
 * 
 * @example
 * ```tsx
 * <AccessibleTable
 *   data={employees}
 *   columns={[
 *     { key: 'name', label: 'Name', width: 'w-1/4' },
 *     { key: 'role', label: 'Role', width: 'w-1/4' },
 *   ]}
 *   ariaLabel="Employee directory"
 *   sortColumn="name"
 *   sortDirection="ascending"
 *   onSort={(column) => handleSort(column)}
 * />
 * ```
 */

interface AccessibleTableProps<T extends Record<string, any>> {
  /** Array of data objects to display */
  data: T[];
  /** Column configuration */
  columns: Array<{
    key: keyof T;
    label: string;
    width: string;
    sortable?: boolean;
  }>;
  /** Accessible label for the table */
  ariaLabel: string;
  /** Optional detailed description */
  ariaDescription?: string;
  /** Current sort column */
  sortColumn: keyof T | null;
  /** Current sort direction */
  sortDirection: SortDirection;
  /** Sort handler function */
  onSort: (column: keyof T) => void;
  /** Optional CSS class for the container */
  className?: string;
  /** Optional row key extractor */
  getRowKey?: (row: T, index: number) => string | number;
}

export function AccessibleTable<T extends Record<string, any>>({
  data,
  columns,
  ariaLabel,
  ariaDescription,
  sortColumn,
  sortDirection,
  onSort,
  className = '',
  getRowKey = (_, index) => index,
}: AccessibleTableProps<T>) {
  // Get sort icon component
  const getSortIcon = (column: keyof T) => {
    const iconClass = "w-4 h-4";
    const commonProps = { className: iconClass, 'aria-hidden': true as const };

    if (sortColumn !== column) {
      return <ChevronsUpDown {...commonProps} />;
    }
    if (sortDirection === 'ascending') {
      return <ChevronUp {...commonProps} />;
    }
    if (sortDirection === 'descending') {
      return <ChevronDown {...commonProps} />;
    }
    return <ChevronsUpDown {...commonProps} />;
  };

  // Get aria-sort value for a column
  const getAriaSort = (column: keyof T): 'ascending' | 'descending' | undefined => {
    if (sortColumn !== column || sortDirection === 'none') return undefined;
    return sortDirection;
  };

  // Format cell value
  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return String(value);
  };

  return (
    <div className={className}>
      {/* Screen reader instructions */}
      <div className="sr-only" role="region" aria-label="Table instructions">
        This table displays information in {columns.length} columns. 
        You can sort columns by clicking on the column headers or pressing Enter or Space when focused. 
        Use Tab to navigate between sortable headers.
      </div>

      {/* Horizontal scroll wrapper for mobile */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          {/* Table container with role="table" */}
          <div
            role="table"
            aria-label={ariaLabel}
            aria-describedby={ariaDescription ? 'table-desc' : undefined}
            className="w-full min-w-[600px] border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
          >
        {ariaDescription && (
          <div id="table-desc" className="sr-only">
            {ariaDescription}
          </div>
        )}

        {/* Table Header */}
        <div role="rowgroup" className="bg-gray-100 dark:bg-gray-700">
          <div role="row" className="flex border-b-2 border-gray-300 dark:border-gray-600">
            {columns.map((column) => (
              <div
                key={String(column.key)}
                role="columnheader"
                aria-sort={getAriaSort(column.key)}
                className={`${column.width} px-2 sm:px-4 py-2 sm:py-3 flex-shrink-0`}
              >
                {column.sortable !== false ? (
                  <button
                    onClick={() => onSort(column.key)}
                    className="flex items-center justify-between w-full text-left font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700 rounded px-2 py-2 sm:py-1 min-h-[44px] sm:min-h-0 transition-colors touch-manipulation"
                    aria-label={`Sort by ${column.label}`}
                  >
                    <span className="truncate pr-1">{column.label}</span>
                    <span className="flex-shrink-0">{getSortIcon(column.key)}</span>
                  </button>
                ) : (
                  <span className="font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-200 px-2 py-1">
                    {column.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Table Body */}
        <div role="rowgroup">
          {data.length === 0 ? (
            <div
              role="row"
              className="flex justify-center items-center py-8 text-gray-900 dark:text-gray-100"
            >
              <div role="cell" className="w-full text-center">
                No data available
              </div>
            </div>
          ) : (
            data.map((row, index) => (
              <div
                key={getRowKey(row, index)}
                role="row"
                className="flex border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <div
                    key={String(column.key)}
                    role="cell"
                    className={`${column.width} px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base flex-shrink-0 ${
                      colIndex === 0
                        ? 'font-medium text-gray-900 dark:text-white'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {formatCellValue(row[column.key])}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccessibleTable;


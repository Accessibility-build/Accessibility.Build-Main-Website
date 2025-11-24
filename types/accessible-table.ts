/**
 * Types for Accessible Table Implementation
 * These types ensure type safety for sortable table components
 */

/**
 * Sort direction for table columns
 * - 'ascending': Sort from low to high / A to Z
 * - 'descending': Sort from high to low / Z to A
 * - 'none': No sorting applied
 */
export type SortDirection = 'ascending' | 'descending' | 'none';

/**
 * Base interface for any sortable table row data
 * Extend this interface for your specific data types
 */
export interface SortableTableRow {
  id: number | string;
}

/**
 * Configuration for a table column
 * @template T - The data type for the table rows
 */
export interface TableColumn<T> {
  /** Unique key for the column (should match a property in T) */
  key: keyof T;
  /** Display label for the column header */
  label: string;
  /** Tailwind width class for the column */
  width: string;
  /** Whether this column is sortable (default: true) */
  sortable?: boolean;
  /** Custom formatter function for cell content */
  formatter?: (value: T[keyof T], row: T) => string | number;
}

/**
 * Props for a sortable table component
 * @template T - The data type for the table rows
 */
export interface SortableTableProps<T extends SortableTableRow> {
  /** Array of data to display in the table */
  data: T[];
  /** Column configuration */
  columns: TableColumn<T>[];
  /** Accessible label for the table */
  ariaLabel: string;
  /** Detailed description for the table (optional) */
  ariaDescription?: string;
  /** Caption text for the table (optional) */
  caption?: string;
  /** Custom class name for styling (optional) */
  className?: string;
}

/**
 * State interface for managing table sorting
 * @template T - The data type for the table rows
 */
export interface TableSortState<T> {
  /** Currently sorted column key */
  sortColumn: keyof T | null;
  /** Current sort direction */
  sortDirection: SortDirection;
}

/**
 * Hook return type for useTableSort
 * @template T - The data type for the table rows
 */
export interface UseTableSortReturn<T> {
  /** Sorted data array */
  sortedData: T[];
  /** Current sort column */
  sortColumn: keyof T | null;
  /** Current sort direction */
  sortDirection: SortDirection;
  /** Function to handle sorting */
  handleSort: (column: keyof T) => void;
  /** Function to get aria-sort value for a column */
  getAriaSort: (column: keyof T) => 'ascending' | 'descending' | 'none' | undefined;
}



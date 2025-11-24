'use client';

import { useState, useMemo, useCallback } from 'react';
import type { SortDirection } from '@/types/accessible-table';

/**
 * Custom hook for managing table sorting functionality
 * 
 * This hook provides all the logic needed to implement sortable tables
 * with proper TypeScript type safety and performance optimization.
 * 
 * @template T - The type of data objects in the table
 * @param initialData - The initial array of data to sort
 * @param initialColumn - Optional initial sort column
 * @param initialDirection - Optional initial sort direction
 * 
 * @returns Object containing sorted data and sorting controls
 * 
 * @example
 * ```tsx
 * const {
 *   sortedData,
 *   sortColumn,
 *   sortDirection,
 *   handleSort,
 *   getAriaSort,
 * } = useTableSort(employees, 'name', 'ascending');
 * ```
 */
export function useTableSort<T extends Record<string, any>>(
  initialData: T[],
  initialColumn: keyof T | null = null,
  initialDirection: SortDirection = 'none'
) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(initialColumn);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialDirection);

  /**
   * Sorts the data based on current sort column and direction
   * Uses useMemo for performance optimization
   */
  const sortedData = useMemo(() => {
    if (!sortColumn || sortDirection === 'none') {
      return initialData;
    }

    return [...initialData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
        return sortDirection === 'ascending' ? comparison : -comparison;
      }

      // Number comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'ascending' ? aValue - bValue : bValue - aValue;
      }

      // Boolean comparison
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        const aNum = aValue ? 1 : 0;
        const bNum = bValue ? 1 : 0;
        return sortDirection === 'ascending' ? aNum - bNum : bNum - aNum;
      }

      // Date comparison
      // Type guard: check if values are objects and then check if they're Date instances
      if (
        typeof aValue === 'object' &&
        aValue !== null &&
        typeof bValue === 'object' &&
        bValue !== null
      ) {
        // Use type assertion for instanceof check since TypeScript can't narrow T[keyof T]
        const aDate = aValue as any;
        const bDate = bValue as any;
        if (aDate instanceof Date && bDate instanceof Date) {
          return sortDirection === 'ascending'
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }
      }

      // Default: convert to string and compare
      const aStr = String(aValue);
      const bStr = String(bValue);
      const comparison = aStr.localeCompare(bStr);
      return sortDirection === 'ascending' ? comparison : -comparison;
    });
  }, [initialData, sortColumn, sortDirection]);

  /**
   * Handles sorting when a column header is clicked
   * Cycles through: none → ascending → descending → none
   */
  const handleSort = useCallback((column: keyof T) => {
    setSortColumn((prevColumn) => {
      if (prevColumn === column) {
        setSortDirection((prevDirection) => {
          if (prevDirection === 'none') return 'ascending';
          if (prevDirection === 'ascending') return 'descending';
          setSortColumn(null);
          return 'none';
        });
        return prevColumn;
      } else {
        setSortDirection('ascending');
        return column;
      }
    });
  }, []);

  /**
   * Gets the appropriate aria-sort value for a column
   * Returns undefined for non-sorted columns
   */
  const getAriaSort = useCallback(
    (column: keyof T): 'ascending' | 'descending' | 'none' | undefined => {
      if (sortColumn !== column) return undefined;
      return sortDirection === 'none' ? undefined : sortDirection;
    },
    [sortColumn, sortDirection]
  );

  /**
   * Resets sorting to initial state
   */
  const resetSort = useCallback(() => {
    setSortColumn(initialColumn);
    setSortDirection(initialDirection);
  }, [initialColumn, initialDirection]);

  /**
   * Sets a specific sort state
   */
  const setSort = useCallback((column: keyof T | null, direction: SortDirection) => {
    setSortColumn(column);
    setSortDirection(direction);
  }, []);

  return {
    sortedData,
    sortColumn,
    sortDirection,
    handleSort,
    getAriaSort,
    resetSort,
    setSort,
  };
}

export default useTableSort;



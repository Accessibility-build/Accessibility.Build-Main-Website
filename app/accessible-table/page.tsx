'use client';

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

// Types for our data
interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  salary: number;
  yearsOfService: number;
}

// Sample data
const sampleData: Employee[] = [
  { id: 1, name: 'Alice Johnson', role: 'Software Engineer', department: 'Engineering', salary: 95000, yearsOfService: 5 },
  { id: 2, name: 'Bob Smith', role: 'Product Manager', department: 'Product', salary: 110000, yearsOfService: 8 },
  { id: 3, name: 'Carol Williams', role: 'UX Designer', department: 'Design', salary: 85000, yearsOfService: 3 },
  { id: 4, name: 'David Brown', role: 'Data Analyst', department: 'Analytics', salary: 78000, yearsOfService: 2 },
  { id: 5, name: 'Emma Davis', role: 'Senior Developer', department: 'Engineering', salary: 120000, yearsOfService: 10 },
  { id: 6, name: 'Frank Miller', role: 'Marketing Manager', department: 'Marketing', salary: 95000, yearsOfService: 6 },
  { id: 7, name: 'Grace Lee', role: 'HR Specialist', department: 'Human Resources', salary: 72000, yearsOfService: 4 },
  { id: 8, name: 'Henry Wilson', role: 'DevOps Engineer', department: 'Engineering', salary: 105000, yearsOfService: 7 },
];

type SortDirection = 'ascending' | 'descending' | 'none';
type SortableColumn = keyof Employee;

export default function AccessibleTablePage() {
  const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortColumn || sortDirection === 'none') {
      return sampleData;
    }

    return [...sampleData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'ascending' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'ascending' 
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }, [sortColumn, sortDirection]);

  // Handle sorting
  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      // Cycle through: none -> ascending -> descending -> none
      if (sortDirection === 'none') {
        setSortDirection('ascending');
      } else if (sortDirection === 'ascending') {
        setSortDirection('descending');
      } else {
        setSortDirection('none');
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('ascending');
    }
  };

  // Get sort icon
  const getSortIcon = (column: SortableColumn) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="w-4 h-4 sm:w-4 sm:h-4" aria-hidden="true" />;
    }
    if (sortDirection === 'ascending') {
      return <ChevronUp className="w-4 h-4 sm:w-4 sm:h-4" aria-hidden="true" />;
    }
    if (sortDirection === 'descending') {
      return <ChevronDown className="w-4 h-4 sm:w-4 sm:h-4" aria-hidden="true" />;
    }
    return <ChevronsUpDown className="w-4 h-4 sm:w-4 sm:h-4" aria-hidden="true" />;
  };

  // Get aria-sort value
  const getAriaSort = (column: SortableColumn): 'ascending' | 'descending' | 'none' | undefined => {
    if (sortColumn !== column) return undefined;
    return sortDirection === 'none' ? undefined : sortDirection;
  };

  const columns: { key: SortableColumn; label: string; width: string; minWidth: string }[] = [
    { key: 'name', label: 'Name', width: 'w-1/4', minWidth: 'min-w-[140px]' },
    { key: 'role', label: 'Role', width: 'w-1/4', minWidth: 'min-w-[140px]' },
    { key: 'department', label: 'Department', width: 'w-1/5', minWidth: 'min-w-[120px]' },
    { key: 'salary', label: 'Salary', width: 'w-1/6', minWidth: 'min-w-[100px]' },
    { key: 'yearsOfService', label: 'Years', width: 'w-1/6', minWidth: 'min-w-[100px]' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-2">
            Accessible Table Implementation
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            A fully accessible table built with divs and ARIA roles, featuring sortable columns 
            and keyboard navigation
          </p>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Employee Directory
          </h2>
          
          {/* Screen reader instructions */}
          <div className="sr-only" role="region" aria-label="Table instructions">
            This table displays employee information. You can sort columns by clicking on the column headers. 
            Use Tab to navigate between sortable headers and press Enter or Space to sort.
          </div>

          {/* Horizontal scroll wrapper for mobile */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              {/* Table container with role="table" */}
              <div 
                role="table" 
                aria-label="Employee directory table"
                aria-describedby="table-desc"
                className="w-full min-w-[800px] border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
              >
            <div id="table-desc" className="sr-only">
              A sortable table showing employee information including name, role, department, 
              salary, and years of service. Click column headers to sort.
            </div>

            {/* Table Header */}
            <div 
              role="rowgroup" 
              className="bg-gray-100 dark:bg-gray-700"
            >
              <div 
                role="row" 
                className="flex border-b-2 border-gray-300 dark:border-gray-600"
              >
                {columns.map((column) => (
                  <div
                    key={column.key}
                    role="columnheader"
                    aria-sort={getAriaSort(column.key)}
                    className={`${column.width} ${column.minWidth} px-2 sm:px-4 py-2 sm:py-3 flex-shrink-0`}
                  >
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center justify-between w-full text-left font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-2 sm:py-1 min-h-[44px] sm:min-h-0 transition-colors touch-manipulation"
                      aria-label={`Sort by ${column.label}`}
                    >
                      <span className="truncate pr-1">{column.label}</span>
                      <span className="flex-shrink-0">{getSortIcon(column.key)}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Body */}
            <div role="rowgroup">
              {sortedData.map((employee) => (
                <div
                  key={employee.id}
                  role="row"
                  className="flex border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div 
                    role="cell" 
                    className={`${columns[0].width} ${columns[0].minWidth} px-2 sm:px-4 py-2 sm:py-3 font-medium text-sm sm:text-base text-gray-900 dark:text-white flex-shrink-0`}
                  >
                    {employee.name}
                  </div>
                  <div 
                    role="cell" 
                    className={`${columns[1].width} ${columns[1].minWidth} px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 dark:text-gray-100 flex-shrink-0`}
                  >
                    {employee.role}
                  </div>
                  <div 
                    role="cell" 
                    className={`${columns[2].width} ${columns[2].minWidth} px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 dark:text-gray-100 flex-shrink-0`}
                  >
                    {employee.department}
                  </div>
                  <div 
                    role="cell" 
                    className={`${columns[3].width} ${columns[3].minWidth} px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 dark:text-gray-100 flex-shrink-0`}
                  >
                    ${employee.salary.toLocaleString()}
                  </div>
                  <div 
                    role="cell" 
                    className={`${columns[4].width} ${columns[4].minWidth} px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 dark:text-gray-100 flex-shrink-0`}
                  >
                    {employee.yearsOfService} {employee.yearsOfService === 1 ? 'year' : 'years'}
                  </div>
                </div>
              ))}
            </div>
              </div>
            </div>
          </div>

          {/* Table info */}
          <div className="mt-4 text-xs sm:text-sm text-gray-900 dark:text-gray-100">
            Showing {sortedData.length} employees
            {sortColumn && sortDirection !== 'none' && (
              <span className="block sm:inline"> - Sorted by {columns.find(c => c.key === sortColumn)?.label} ({sortDirection})</span>
            )}
          </div>
        </div>

        {/* Implementation Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 lg:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
            Implementation Guide
          </h2>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Step 1: Define Proper ARIA Roles
              </h3>
              <p className="text-gray-900 dark:text-gray-100 mb-3">
                Instead of using semantic HTML table elements, we use divs with explicit ARIA roles:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-900 dark:text-gray-100 ml-4">
                <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">role="table"</code> - Identifies the main table container</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">role="rowgroup"</code> - Groups header and body rows (like thead/tbody)</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">role="row"</code> - Defines each table row</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">role="columnheader"</code> - Defines column headers (replaces th)</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">role="cell"</code> - Defines data cells (replaces td)</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Step 2: Add aria-label and aria-describedby
              </h3>
              <p className="text-gray-900 dark:text-gray-100 mb-3">
                Provide context for screen reader users:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-900 dark:text-gray-100 ml-4">
                <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">aria-label</code> - Names the table ("Employee directory table")</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">aria-describedby</code> - Links to a detailed description</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">sr-only</code> class - Provides instructions visible only to screen readers</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Step 3: Implement aria-sort for Sortable Columns
              </h3>
              <p className="text-gray-900 dark:text-gray-100 mb-3">
                The <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">aria-sort</code> attribute indicates the sort order:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-900 dark:text-gray-100 ml-4">
                <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">aria-sort="ascending"</code> - Column sorted in ascending order</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">aria-sort="descending"</code> - Column sorted in descending order</li>
                <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">aria-sort="none"</code> or undefined - Column not sorted</li>
              </ul>
              <p className="text-gray-900 dark:text-gray-100 mt-3">
                Only one column should have aria-sort="ascending" or "descending" at a time.
              </p>
            </div>

            {/* Step 4 */}
            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Step 4: Make Headers Keyboard Accessible
              </h3>
              <p className="text-gray-900 dark:text-gray-100 mb-3">
                Column headers are implemented as buttons for accessibility:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-900 dark:text-gray-100 ml-4">
                <li>Use <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">&lt;button&gt;</code> elements for interactive headers</li>
                <li>Buttons are keyboard navigable (Tab, Enter, Space)</li>
                <li>Include descriptive <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">aria-label</code> indicating current sort state</li>
                <li>Add focus indicators with <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">focus:ring</code> for visibility</li>
              </ul>
            </div>

            {/* Step 5 */}
            <div className="border-l-4 border-red-500 pl-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Step 5: Implement TypeScript Sorting Logic
              </h3>
              <p className="text-gray-900 dark:text-gray-100 mb-3">
                The sorting functionality uses TypeScript for type safety:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-900 dark:text-gray-100 ml-4">
                <li>Define types for data structure and sort states</li>
                <li>Use <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">useState</code> to track current sort column and direction</li>
                <li>Use <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">useMemo</code> to optimize sorting performance</li>
                <li>Handle both string and number sorting appropriately</li>
                <li>Cycle through sort states: none → ascending → descending → none</li>
              </ul>
            </div>

            {/* Step 6 */}
            <div className="border-l-4 border-teal-500 pl-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Step 6: Provide Visual and Auditory Feedback
              </h3>
              <p className="text-gray-900 dark:text-gray-100 mb-3">
                Users need to know when the table state changes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-900 dark:text-gray-100 ml-4">
                <li>Visual icons (↑↓) indicate sort direction</li>
                <li>Use <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">aria-hidden="true"</code> on decorative icons</li>
                <li>Status text with <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">role="status"</code> and <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">aria-live="polite"</code> announces changes</li>
                <li>Hover states provide visual feedback</li>
                <li>Focus states are clearly visible for keyboard users</li>
              </ul>
            </div>

            {/* Step 7 */}
            <div className="border-l-4 border-indigo-500 pl-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                Step 7: Ensure Semantic Structure
              </h3>
              <p className="text-gray-900 dark:text-gray-100 mb-3">
                Even with divs, maintain logical table structure:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-900 dark:text-gray-100 ml-4">
                <li>Group headers in one <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">rowgroup</code></li>
                <li>Group data rows in another <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">rowgroup</code></li>
                <li>Maintain consistent column widths across rows</li>
                <li>Use flexbox for proper alignment</li>
                <li>Ensure cells align vertically with their headers</li>
              </ul>
            </div>
          </div>

          {/* Key Accessibility Features */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Key Accessibility Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">✓ Screen Reader Support</h4>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  Complete ARIA roles and labels for navigation
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">✓ Keyboard Navigation</h4>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  Full keyboard access with Tab, Enter, and Space
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">✓ Focus Management</h4>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  Visible focus indicators on all interactive elements
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">✓ Live Regions</h4>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  Status updates announced to assistive technologies
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">✓ Semantic Structure</h4>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  Proper table semantics maintained with ARIA
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">✓ Visual Feedback</h4>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  Clear visual indicators for all states
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">✓ Color Contrast</h4>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  WCAG AA compliant contrast ratios (4.5:1 minimum)
                </p>
              </div>
            </div>
          </div>

          {/* TypeScript Functions Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              TypeScript Sorting Functions Explained
            </h3>
            
            {/* State Management */}
            <div className="mb-8 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                1. State Management with useState
              </h4>
              <p className="text-gray-900 dark:text-gray-100 mb-4">
                Two pieces of state control the sorting behavior:
              </p>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-sm">
                  <code>{`// Track which column is currently sorted
const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);

// Track the direction: 'ascending', 'descending', or 'none'
const [sortDirection, setSortDirection] = useState<SortDirection>('none');`}</code>
                </pre>
              </div>
              <p className="text-gray-900 dark:text-gray-100">
                <strong>sortColumn:</strong> Stores the column key being sorted (e.g., 'name', 'salary')<br />
                <strong>sortDirection:</strong> Stores the current sort direction
              </p>
            </div>

            {/* handleSort Function */}
            <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                2. handleSort Function - Tri-State Cycling Logic
              </h4>
              <p className="text-gray-900 dark:text-gray-100 mb-4">
                This function is called when a column header is clicked. It cycles through three states:
              </p>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-sm">
                  <code>{`const handleSort = (column: SortableColumn) => {
  if (sortColumn === column) {
    // Clicking the same column cycles through states
    if (sortDirection === 'none') {
      setSortDirection('ascending');
    } else if (sortDirection === 'ascending') {
      setSortDirection('descending');
    } else {
      // Reset to no sorting
      setSortDirection('none');
      setSortColumn(null);
    }
  } else {
    // Clicking a different column starts with ascending
    setSortColumn(column);
    setSortDirection('ascending');
  }
};`}</code>
                </pre>
              </div>
              <div className="space-y-2 text-gray-900 dark:text-gray-100">
                <p><strong>Click 1:</strong> none → ascending (A to Z, 0 to 9)</p>
                <p><strong>Click 2:</strong> ascending → descending (Z to A, 9 to 0)</p>
                <p><strong>Click 3:</strong> descending → none (original order)</p>
                <p><strong>Different Column:</strong> Always starts with ascending</p>
              </div>
            </div>

            {/* sortedData with useMemo */}
            <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                3. sortedData - Optimized with useMemo
              </h4>
              <p className="text-gray-900 dark:text-gray-100 mb-4">
                useMemo ensures sorting only happens when sortColumn or sortDirection changes:
              </p>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-sm">
                  <code>{`const sortedData = useMemo(() => {
  // If no column selected or direction is 'none', return original data
  if (!sortColumn || sortDirection === 'none') {
    return sampleData;
  }

  // Create a copy and sort it
  return [...sampleData].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    // String comparison (case-insensitive, locale-aware)
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'ascending' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Number comparison
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'ascending' 
        ? aValue - bValue
        : bValue - aValue;
    }

    return 0;
  });
}, [sortColumn, sortDirection]);`}</code>
                </pre>
              </div>
              <p className="text-gray-900 dark:text-gray-100">
                <strong>Performance:</strong> Only re-sorts when dependencies change<br />
                <strong>Immutability:</strong> Creates a new array with [...sampleData]<br />
                <strong>Type Safety:</strong> TypeScript ensures correct property access
              </p>
            </div>

            {/* getAriaSort Function */}
            <div className="mb-8 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                4. getAriaSort Function - Accessibility Helper
              </h4>
              <p className="text-gray-900 dark:text-gray-100 mb-4">
                Returns the correct aria-sort value for screen readers:
              </p>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-sm">
                  <code>{`const getAriaSort = (column: SortableColumn): 
  'ascending' | 'descending' | 'none' | undefined => {
  if (sortColumn !== column) return undefined;
  return sortDirection === 'none' ? undefined : sortDirection;
};`}</code>
                </pre>
              </div>
              <p className="text-gray-900 dark:text-gray-100">
                <strong>undefined:</strong> Column not sorted<br />
                <strong>'ascending':</strong> Column sorted A→Z or 0→9<br />
                <strong>'descending':</strong> Column sorted Z→A or 9→0
              </p>
            </div>

            {/* getSortIcon Function */}
            <div className="mb-8 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                5. getSortIcon Function - Visual Feedback
              </h4>
              <p className="text-gray-900 dark:text-gray-100 mb-4">
                Displays the appropriate icon based on sort state:
              </p>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
                <pre className="text-sm">
                  <code>{`const getSortIcon = (column: SortableColumn) => {
  if (sortColumn !== column) {
    return <ChevronsUpDown />; // ↕ Not sorted
  }
  if (sortDirection === 'ascending') {
    return <ChevronUp />;       // ↑ Ascending
  }
  if (sortDirection === 'descending') {
    return <ChevronDown />;     // ↓ Descending
  }
  return <ChevronsUpDown />;    // ↕ Default
};`}</code>
                </pre>
              </div>
              <p className="text-gray-900 dark:text-gray-100">
                Icons have <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">aria-hidden="true"</code> 
                so screen readers ignore them. The aria-label on the button provides context.
              </p>
            </div>

            {/* Data Flow Diagram */}
            <div className="mb-8 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                6. Complete Data Flow
              </h4>
              <div className="space-y-4 text-gray-900 dark:text-gray-100">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <strong>User clicks column header</strong>
                    <p className="text-sm mt-1">Button onClick triggers handleSort(columnKey)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    <strong>handleSort updates state</strong>
                    <p className="text-sm mt-1">setSortColumn and setSortDirection called</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <strong>useMemo detects change</strong>
                    <p className="text-sm mt-1">sortedData recomputes with new sort parameters</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <div>
                    <strong>Component re-renders</strong>
                    <p className="text-sm mt-1">Table displays newly sorted data</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">5</span>
                  <div>
                    <strong>Visual updates</strong>
                    <p className="text-sm mt-1">Icon changes, aria-sort updates, live region announces</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Type Definitions */}
            <div className="mb-8 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-6">
              <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                7. TypeScript Type Definitions
              </h4>
              <p className="text-gray-900 dark:text-gray-100 mb-4">
                Type safety ensures correct usage throughout:
              </p>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`// Employee data structure
interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  salary: number;
  yearsOfService: number;
}

// Sort direction type
type SortDirection = 'ascending' | 'descending' | 'none';

// Column keys that can be sorted
type SortableColumn = keyof Employee;

// Usage in state
const [sortColumn, setSortColumn] = 
  useState<SortableColumn | null>(null);
const [sortDirection, setSortDirection] = 
  useState<SortDirection>('none');`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Interactive Example */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Try It Live!
            </h3>
            <p className="text-gray-900 dark:text-gray-100 mb-4">
              Click any column header in the table above and watch:
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What Changes:</h4>
                <ul className="space-y-2 text-gray-900 dark:text-gray-100">
                  <li>• Data reorders immediately</li>
                  <li>• Icon updates (↕ → ↑ → ↓ → ↕)</li>
                  <li>• Status text shows sort info</li>
                  <li>• Screen reader announces change</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Behind the Scenes:</h4>
                <ul className="space-y-2 text-gray-900 dark:text-gray-100">
                  <li>• handleSort() updates state</li>
                  <li>• useMemo() recalculates data</li>
                  <li>• React re-renders table</li>
                  <li>• ARIA attributes update</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded p-3">
              <p className="text-sm text-gray-900 dark:text-gray-100">
                <strong>Current State:</strong> {sortColumn ? `Sorting by "${sortColumn}" (${sortDirection})` : 'No sorting applied'}
              </p>
            </div>
          </div>

          {/* Code Structure Example */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Complete Component Structure
            </h3>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm">
                <code>{`// Table structure with ARIA roles
<div role="table" aria-label="Employee directory table">
  {/* Header */}
  <div role="rowgroup">
    <div role="row">
      <div role="columnheader" aria-sort="ascending">
        <button onClick={handleSort} aria-label="Sort by name">
          Name
          {getSortIcon('name')}
        </button>
      </div>
    </div>
  </div>
  
  {/* Body - renders sortedData, not original data */}
  <div role="rowgroup">
    {sortedData.map((employee) => (
      <div role="row" key={employee.id}>
        <div role="cell">{employee.name}</div>
      </div>
    ))}
  </div>
</div>`}</code>
              </pre>
            </div>
          </div>

          {/* Testing Instructions */}
          <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              Testing Your Accessible Table
            </h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-900 dark:text-gray-100">
              <li><strong>Screen Reader Test:</strong> Use NVDA, JAWS, or VoiceOver to navigate the table</li>
              <li><strong>Keyboard Test:</strong> Navigate using only Tab, Enter, and Space keys</li>
              <li><strong>Focus Test:</strong> Ensure focus indicators are clearly visible</li>
              <li><strong>Sort Test:</strong> Verify sorting works correctly and is announced</li>
              <li><strong>ARIA Test:</strong> Use browser DevTools to inspect ARIA attributes</li>
              <li><strong>Automated Test:</strong> Run axe-core or WAVE for automated checks</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}


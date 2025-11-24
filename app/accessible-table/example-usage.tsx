'use client';

/**
 * Example Usage: Accessible Table Component
 * 
 * This file demonstrates different ways to use the accessible table components
 * in your application with various data types and configurations.
 */

import React from 'react';
import { AccessibleTable } from '@/components/accessible-table/accessible-table';
import { useTableSort } from '@/hooks/use-table-sort';

// ===== Example 1: Simple Employee Table =====

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
}

const employees: Employee[] = [
  { id: 1, name: 'Alice Johnson', role: 'Engineer', department: 'Engineering' },
  { id: 2, name: 'Bob Smith', role: 'Designer', department: 'Design' },
  { id: 3, name: 'Carol White', role: 'Manager', department: 'Operations' },
];

export function EmployeeTable() {
  const { sortedData, sortColumn, sortDirection, handleSort, getAriaSort } =
    useTableSort(employees);

  return (
    <AccessibleTable
      data={sortedData}
      columns={[
        { key: 'name', label: 'Name', width: 'w-1/3' },
        { key: 'role', label: 'Role', width: 'w-1/3' },
        { key: 'department', label: 'Department', width: 'w-1/3' },
      ]}
      ariaLabel="Employee directory"
      ariaDescription="A list of employees with their roles and departments"
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      onSort={handleSort}
    />
  );
}

// ===== Example 2: Product Inventory Table =====

interface Product {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  inStock: boolean;
}

const products: Product[] = [
  { sku: 'PRD001', name: 'Laptop', category: 'Electronics', price: 999.99, stock: 15, inStock: true },
  { sku: 'PRD002', name: 'Mouse', category: 'Accessories', price: 29.99, stock: 0, inStock: false },
  { sku: 'PRD003', name: 'Keyboard', category: 'Accessories', price: 79.99, stock: 8, inStock: true },
];

export function ProductTable() {
  const { sortedData, sortColumn, sortDirection, handleSort } =
    useTableSort(products, 'name', 'ascending');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Inventory</h2>
        <div role="status" aria-live="polite" className="text-sm text-gray-900 dark:text-gray-100">
          {sortColumn && sortDirection !== 'none' && (
            <span>Sorted by {String(sortColumn)} ({sortDirection})</span>
          )}
        </div>
      </div>
      
      <AccessibleTable
        data={sortedData}
        columns={[
          { key: 'sku', label: 'SKU', width: 'w-1/6', sortable: false },
          { key: 'name', label: 'Product Name', width: 'w-1/4' },
          { key: 'category', label: 'Category', width: 'w-1/6' },
          { key: 'price', label: 'Price ($)', width: 'w-1/6' },
          { key: 'stock', label: 'Stock', width: 'w-1/6' },
          { key: 'inStock', label: 'Available', width: 'w-1/6' },
        ]}
        ariaLabel="Product inventory table"
        ariaDescription="Current product inventory showing SKU, name, category, price, and stock levels"
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        getRowKey={(row) => row.sku}
      />
    </div>
  );
}

// ===== Example 3: User Analytics Table =====

interface UserAnalytics {
  userId: string;
  username: string;
  visits: number;
  bounceRate: number;
  avgSessionDuration: number;
  lastVisit: Date;
}

const userAnalytics: UserAnalytics[] = [
  {
    userId: 'U001',
    username: 'john_doe',
    visits: 45,
    bounceRate: 32.5,
    avgSessionDuration: 245,
    lastVisit: new Date('2024-11-15'),
  },
  {
    userId: 'U002',
    username: 'jane_smith',
    visits: 78,
    bounceRate: 28.3,
    avgSessionDuration: 312,
    lastVisit: new Date('2024-11-16'),
  },
];

export function AnalyticsTable() {
  const { sortedData, sortColumn, sortDirection, handleSort, resetSort } =
    useTableSort(userAnalytics, 'visits', 'descending');

  // Custom formatter for displaying data
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Analytics</h2>
        <button
          onClick={resetSort}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Reset table sorting"
        >
          Reset Sort
        </button>
      </div>

      <AccessibleTable
        data={sortedData}
        columns={[
          { key: 'username', label: 'Username', width: 'w-1/5' },
          { key: 'visits', label: 'Total Visits', width: 'w-1/5' },
          { key: 'bounceRate', label: 'Bounce Rate (%)', width: 'w-1/5' },
          { key: 'avgSessionDuration', label: 'Avg. Session', width: 'w-1/5' },
          { key: 'lastVisit', label: 'Last Visit', width: 'w-1/5' },
        ]}
        ariaLabel="User analytics data table"
        ariaDescription="Analytics data showing user engagement metrics including visits, bounce rate, and session duration"
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        getRowKey={(row) => row.userId}
      />

      {/* Legend or additional information */}
      <div className="text-sm text-gray-900 dark:text-gray-100 space-y-1">
        <p><strong>Bounce Rate:</strong> Percentage of visitors who leave after viewing only one page</p>
        <p><strong>Avg. Session:</strong> Average time users spend on the site per visit</p>
      </div>
    </div>
  );
}

// ===== Example 4: Custom Styled Table =====

interface Task {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'To Do' | 'In Progress' | 'Done';
  assignee: string;
  dueDate: string;
}

const tasks: Task[] = [
  {
    id: 'T001',
    title: 'Fix login bug',
    priority: 'Critical',
    status: 'In Progress',
    assignee: 'Alice',
    dueDate: '2024-11-20',
  },
  {
    id: 'T002',
    title: 'Update documentation',
    priority: 'Low',
    status: 'To Do',
    assignee: 'Bob',
    dueDate: '2024-11-25',
  },
];

export function TaskTable() {
  const { sortedData, sortColumn, sortDirection, handleSort } = useTableSort(tasks);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'To Do': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Task Management</h2>
      
      {/* Custom rendering with badges */}
      <div role="table" aria-label="Task management table" className="w-full">
        <div role="rowgroup" className="bg-gray-100 dark:bg-gray-700">
          <div role="row" className="flex border-b-2 border-gray-300">
            <div role="columnheader" className="w-1/3 px-4 py-3 font-semibold">
              Task
            </div>
            <div role="columnheader" className="w-1/6 px-4 py-3 font-semibold">
              Priority
            </div>
            <div role="columnheader" className="w-1/6 px-4 py-3 font-semibold">
              Status
            </div>
            <div role="columnheader" className="w-1/6 px-4 py-3 font-semibold">
              Assignee
            </div>
            <div role="columnheader" className="w-1/6 px-4 py-3 font-semibold">
              Due Date
            </div>
          </div>
        </div>

        <div role="rowgroup">
          {sortedData.map((task) => (
            <div key={task.id} role="row" className="flex border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700">
              <div role="cell" className="w-1/3 px-4 py-3 font-medium text-gray-900 dark:text-white">
                {task.title}
              </div>
              <div role="cell" className="w-1/6 px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <div role="cell" className="w-1/6 px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
              <div role="cell" className="w-1/6 px-4 py-3 text-gray-900 dark:text-gray-100">
                {task.assignee}
              </div>
              <div role="cell" className="w-1/6 px-4 py-3 text-gray-900 dark:text-gray-100">
                {task.dueDate}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== Example 5: Empty State Handling =====

export function EmptyTableExample() {
  const emptyData: Employee[] = [];
  const { sortedData, sortColumn, sortDirection, handleSort } = useTableSort(emptyData);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Empty State Example</h2>
      
      <AccessibleTable
        data={sortedData}
        columns={[
          { key: 'name', label: 'Name', width: 'w-1/3' },
          { key: 'role', label: 'Role', width: 'w-1/3' },
          { key: 'department', label: 'Department', width: 'w-1/3' },
        ]}
        ariaLabel="Empty employee table"
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      
      <p className="text-sm text-gray-900 dark:text-gray-100">
        When no data is available, the table displays a friendly "No data available" message.
      </p>
    </div>
  );
}

// Export all examples for demonstration
export default function ExampleUsagePage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-4">Accessible Table Examples</h1>
        <p className="text-gray-900 dark:text-gray-100">
          Various examples demonstrating different use cases for accessible tables.
        </p>
      </div>

      <section>
        <EmployeeTable />
      </section>

      <section>
        <ProductTable />
      </section>

      <section>
        <AnalyticsTable />
      </section>

      <section>
        <TaskTable />
      </section>

      <section>
        <EmptyTableExample />
      </section>
    </div>
  );
}


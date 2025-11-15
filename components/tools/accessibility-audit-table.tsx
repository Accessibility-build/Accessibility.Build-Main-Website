"use client"

import { useState, useMemo } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Eye,
  EyeOff,
  Filter,
  Search,
  ExternalLink,
  Code,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  ChevronDown,
  Copy,
  FileSpreadsheet,
  FileText,
  Lightbulb,
  Target,
  Tag
} from "lucide-react"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface Violation {
  id: string
  violationId: string
  description: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  helpUrl: string
  detectedBy?: string[]
  confidence?: number
  toolSpecificData?: {
    axe?: any
    pa11y?: any
  }
  wcagCriteria: Array<{
    criterion: string
    level: string
    guideline: string
  }>
  wcagLevel: string
  selector: string
  html: string
  target: string[]
  aiExplanation: string
  fixSuggestion: string
  codeExample?: string
  createdAt: string
  elementCount?: number // Added for multiple instances
}

interface AuditInfo {
  url: string
  title?: string
  overallScore?: number
  confidenceScore?: number
  toolsUsed?: string[]
  consensusViolations?: number
  uniqueViolations?: number
  axeCoreResults?: {
    violations: number
    passes: number
    incomplete: number
    inapplicable: number
  }
  pa11yResults?: {
    errors: number
    warnings: number
    notices: number
    total: number
  }
  totalViolations: number
  criticalCount: number
  seriousCount: number
  moderateCount: number
  minorCount: number
  createdAt: string
}

interface AccessibilityAuditTableProps {
  violations: Violation[]
  auditInfo: AuditInfo
}

const SEVERITY_CONFIG = {
  critical: { 
    color: 'bg-red-100 text-red-800 border-red-200', 
    icon: XCircle, 
    label: 'Critical',
    priority: 4 
  },
  serious: { 
    color: 'bg-orange-100 text-orange-800 border-orange-200', 
    icon: AlertCircle, 
    label: 'Serious',
    priority: 3 
  },
  moderate: { 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    icon: AlertCircle, 
    label: 'Moderate',
    priority: 2 
  },
  minor: { 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: Info, 
    label: 'Minor',
    priority: 1 
  }
}

export default function AccessibilityAuditTable({ violations, auditInfo }: AccessibilityAuditTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'priority', desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null)

  // Add priority and formatted fields to violations
  const enhancedViolations = useMemo(() => 
    violations.map(violation => ({
      ...violation,
      priority: SEVERITY_CONFIG[violation.impact].priority,
      wcagCriteriaText: violation.wcagCriteria
        ?.map(c => c.criterion)
        .join(', ') || 'N/A',
      elementPreview: violation.html.length > 100 
        ? violation.html.substring(0, 100) + '...' 
        : violation.html,
      hasCodeExample: !!violation.codeExample,
      ruleCategory: violation.violationId.split('-')[0] || 'other'
    })),
    [violations]
  )

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "violationId",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 font-medium"
        >
          Rule ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">
                {row.getValue("violationId")}
              </Badge>
              {row.original.elementCount && row.original.elementCount > 1 && (
                <Badge variant="secondary" className="text-xs">
                  {row.original.elementCount} instances
                </Badge>
              )}
            </div>
            {row.original.detectedBy && row.original.detectedBy.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {row.original.detectedBy.map((tool: string) => (
                  <Badge 
                    key={tool} 
                    variant={tool === 'axe-core' ? 'default' : 'secondary'} 
                    className="text-xs px-1 py-0"
                  >
                    {tool === 'axe-core' ? 'axe' : tool}
                  </Badge>
                ))}
                {row.original.confidence && (
                  <Badge 
                    variant="outline" 
                    className="text-xs px-1 py-0"
                  >
                    {row.original.confidence}%
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 font-medium"
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="max-w-md">
          <p className="text-sm font-medium leading-tight">
            {row.getValue("description")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "impact",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 font-medium"
        >
          Impact
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const impact = row.getValue("impact") as keyof typeof SEVERITY_CONFIG
        const config = SEVERITY_CONFIG[impact]
        const Icon = config.icon
        
        return (
          <Badge className={config.color}>
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 font-medium"
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const priority = row.getValue("priority") as number
        const config = Object.values(SEVERITY_CONFIG).find(c => c.priority === priority)
        return (
          <div className="text-center font-medium">
            {priority}
          </div>
        )
      },
    },
    {
      accessorKey: "wcagLevel",
      header: "WCAG Level",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue("wcagLevel") || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "wcagCriteriaText",
      header: "WCAG Criteria",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-32 truncate">
          {row.getValue("wcagCriteriaText")}
        </div>
      ),
    },
    {
      accessorKey: "selector",
      header: "Element",
      cell: ({ row }) => (
        <div className="font-mono text-xs bg-muted px-2 py-1 rounded max-w-32 truncate">
          {row.getValue("selector") || "Multiple elements"}
        </div>
      ),
    },
    {
      accessorKey: "hasCodeExample",
      header: "Code Fix",
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("hasCodeExample") ? (
            <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-400 mx-auto" />
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedViolation(row.original)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Badge variant="outline" className="font-mono text-sm">
                    {row.original.violationId}
                  </Badge>
                  <span className="truncate">{row.original.description}</span>
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Detailed accessibility violation analysis with AI-powered recommendations
                </DialogDescription>
              </DialogHeader>
              
              {selectedViolation && <ViolationDetailView violation={selectedViolation} />}
            </DialogContent>
          </Dialog>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(row.original.helpUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: enhancedViolations,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  })

  const exportToExcel = () => {
    try {
      const exportData = enhancedViolations.map(violation => ({
        'Rule ID': violation.violationId,
        'Description': violation.description,
        'Impact': violation.impact,
        'Priority': violation.priority,
        'Detected By': violation.detectedBy?.join(', ') || 'N/A',
        'Confidence': violation.confidence ? `${violation.confidence}%` : 'N/A',
        'WCAG Level': violation.wcagLevel,
        'WCAG Criteria': violation.wcagCriteriaText,
        'Element Selector': violation.selector,
        'AI Explanation': violation.aiExplanation,
        'Fix Suggestion': violation.fixSuggestion,
        'Code Example': violation.codeExample || 'N/A',
        'Help URL': violation.helpUrl,
        'HTML Element': violation.html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      }))

      // Add summary sheet data
      const summaryData = [{
        'Website URL': auditInfo.url,
        'Page Title': auditInfo.title || 'N/A',
        'Overall Score': auditInfo.overallScore || 'N/A',
        'Confidence Score': auditInfo.confidenceScore ? `${auditInfo.confidenceScore}%` : 'N/A',
        'Tools Used': auditInfo.toolsUsed?.join(', ') || 'N/A',
        'Total Violations': auditInfo.totalViolations,
        'Consensus Violations': auditInfo.consensusViolations || 'N/A',
        'Unique Violations': auditInfo.uniqueViolations || 'N/A',
        'Critical': auditInfo.criticalCount,
        'Serious': auditInfo.seriousCount,
        'Moderate': auditInfo.moderateCount,
        'Minor': auditInfo.minorCount,
        'axe-core Results': auditInfo.axeCoreResults ? 
          `${auditInfo.axeCoreResults.violations} violations, ${auditInfo.axeCoreResults.passes} passes` : 'N/A',
        'Pa11y Results': auditInfo.pa11yResults ? 
          `${auditInfo.pa11yResults.errors} errors, ${auditInfo.pa11yResults.warnings} warnings` : 'N/A',
        'Audit Date': new Date(auditInfo.createdAt).toLocaleDateString()
      }]

      const wb = XLSX.utils.book_new()
      
      // Add summary sheet
      const summaryWs = XLSX.utils.json_to_sheet(summaryData)
      XLSX.utils.book_append_sheet(wb, summaryWs, "Audit Summary")
      
      // Add violations sheet
      const violationsWs = XLSX.utils.json_to_sheet(exportData)
      XLSX.utils.book_append_sheet(wb, violationsWs, "Violations")

      const fileName = `accessibility-audit-${new Date(auditInfo.createdAt).toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(wb, fileName)
      
      toast.success("Excel report exported successfully!")
    } catch (error) {
      console.error('Export error:', error)
      toast.error("Failed to export Excel report")
    }
  }

  const exportToPDF = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4') // Landscape orientation
      
      // Title
      doc.setFontSize(20)
      doc.text('Accessibility Audit Report', 20, 20)
      
      // Summary information
      doc.setFontSize(12)
      doc.text(`Website: ${auditInfo.url}`, 20, 35)
      doc.text(`Page Title: ${auditInfo.title || 'N/A'}`, 20, 45)
      doc.text(`Overall Score: ${auditInfo.overallScore || 'N/A'}/100`, 20, 55)
      
      if (auditInfo.toolsUsed && auditInfo.toolsUsed.length > 1) {
        doc.text(`Multi-Tool Analysis: ${auditInfo.toolsUsed.join(' + ')}`, 20, 65)
        doc.text(`Confidence Score: ${auditInfo.confidenceScore || 'N/A'}%`, 20, 75)
        doc.text(`Consensus Violations: ${auditInfo.consensusViolations || 0} | Unique: ${auditInfo.uniqueViolations || 0}`, 20, 85)
        doc.text(`Total Violations: ${auditInfo.totalViolations}`, 20, 95)
        doc.text(`Critical: ${auditInfo.criticalCount} | Serious: ${auditInfo.seriousCount} | Moderate: ${auditInfo.moderateCount} | Minor: ${auditInfo.minorCount}`, 20, 105)
        doc.text(`Audit Date: ${new Date(auditInfo.createdAt).toLocaleDateString()}`, 20, 115)
      } else {
        doc.text(`Total Violations: ${auditInfo.totalViolations}`, 20, 65)
        doc.text(`Critical: ${auditInfo.criticalCount} | Serious: ${auditInfo.seriousCount} | Moderate: ${auditInfo.moderateCount} | Minor: ${auditInfo.minorCount}`, 20, 75)
        doc.text(`Audit Date: ${new Date(auditInfo.createdAt).toLocaleDateString()}`, 20, 85)
      }

      // Violations table
      const tableData = enhancedViolations.map(violation => [
        violation.violationId,
        violation.description.substring(0, 45) + (violation.description.length > 45 ? '...' : ''),
        violation.impact,
        violation.priority,
        violation.wcagLevel,
        violation.selector.substring(0, 25) + (violation.selector.length > 25 ? '...' : ''),
        violation.aiExplanation.substring(0, 50) + (violation.aiExplanation.length > 50 ? '...' : ''),
        violation.fixSuggestion.substring(0, 50) + (violation.fixSuggestion.length > 50 ? '...' : '')
      ])

      autoTable(doc, {
        startY: auditInfo.toolsUsed && auditInfo.toolsUsed.length > 1 ? 125 : 95,
        head: [['Rule ID', 'Description', 'Impact', 'Priority', 'WCAG', 'Element', 'AI Explanation', 'Fix Suggestion']],
        body: tableData,
        styles: { fontSize: 7 },
        headStyles: { fillColor: [79, 70, 229] },
        columnStyles: {
          0: { cellWidth: 22 },
          1: { cellWidth: 35 },
          2: { cellWidth: 18 },
          3: { cellWidth: 12 },
          4: { cellWidth: 12 },
          5: { cellWidth: 25 },
          6: { cellWidth: 45 },
          7: { cellWidth: 45 }
        }
      })

      const fileName = `accessibility-audit-${new Date(auditInfo.createdAt).toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
      
      toast.success("PDF report exported successfully!")
    } catch (error) {
      console.error('Export error:', error)
      toast.error("Failed to export PDF report")
    }
  }

  const copyTableData = () => {
    const tableText = enhancedViolations.map(violation => 
      `${violation.violationId}\t${violation.description}\t${violation.impact}\t${violation.priority}\t${violation.wcagLevel}\t${violation.selector}\t${violation.aiExplanation}`
    ).join('\n')
    
    navigator.clipboard.writeText(tableText).then(() => {
      toast.success("Table data copied to clipboard")
    })
  }

  return (
    <div className="space-y-6">
      {/* Table Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Accessibility Violations ({violations.length})
                {auditInfo.toolsUsed && auditInfo.toolsUsed.length > 1 && (
                  <Badge variant="outline" className="ml-2">
                    Multi-Tool Analysis
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {auditInfo.toolsUsed && auditInfo.toolsUsed.length > 1 ? (
                  <>
                    Comprehensive multi-tool analysis using {auditInfo.toolsUsed.join(' + ')} with {auditInfo.consensusViolations || 0} consensus violations 
                    and {auditInfo.confidenceScore || 0}% overall confidence
                  </>
                ) : (
                  'Detailed analysis of accessibility issues with AI-powered fix recommendations'
                )}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyTableData}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              
              <Button variant="outline" size="sm" onClick={exportToExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Excel
              </Button>
              
              <Button variant="outline" size="sm" onClick={exportToPDF}>
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <EyeOff className="h-4 w-4 mr-2" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search violations..."
                value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("description")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={(table.getColumn("impact")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("impact")?.setFilterValue(event.target.value || undefined)
                }
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Severities</option>
                <option value="critical">Critical</option>
                <option value="serious">Serious</option>
                <option value="moderate">Moderate</option>
                <option value="minor">Minor</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-medium">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-muted/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <p className="text-muted-foreground">No violations found!</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Card>
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Showing {table.getRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} violations
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: table.getPageCount() }, (_, i) => (
                <Button
                  key={i}
                  variant={table.getState().pagination.pageIndex === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => table.setPageIndex(i)}
                  className="w-8 h-8 p-0"
                >
                  {i + 1}
                </Button>
              )).slice(
                Math.max(0, table.getState().pagination.pageIndex - 2),
                Math.min(table.getPageCount(), table.getState().pagination.pageIndex + 3)
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ViolationDetailView({ violation }: { violation: Violation }) {
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard`)
    })
  }

  const config = SEVERITY_CONFIG[violation.impact]
  const Icon = config.icon

  return (
    <div className="space-y-6 w-full">
      {/* Header Section */}
      <div className="border-b pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono text-xs shrink-0">
                {violation.violationId}
              </Badge>
              <Badge className={`${config.color} text-xs shrink-0`}>
                <Icon className="mr-1 h-3 w-3" />
                {config.label}
              </Badge>
              {violation.elementCount && violation.elementCount > 1 && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  {violation.elementCount} instances
                </Badge>
              )}
              {violation.detectedBy && violation.detectedBy.length > 0 && (
                <>
                  {violation.detectedBy.map((tool) => (
                    <Badge 
                      key={tool} 
                      variant={tool === 'axe-core' ? 'default' : 'secondary'} 
                      className="text-xs shrink-0"
                    >
                      {tool === 'axe-core' ? 'axe' : tool}
                    </Badge>
                  ))}
                  {violation.confidence && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      {violation.confidence}% confidence
                    </Badge>
                  )}
                </>
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground leading-tight break-words">
              {violation.description}
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(violation.helpUrl, '_blank')}
            className="shrink-0 self-start"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            WCAG
          </Button>
        </div>

        {/* WCAG Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg text-center">
          <div>
            <div className="text-xs text-muted-foreground mb-1">WCAG Level</div>
            <Badge variant="secondary" className="text-xs">
              {violation.wcagLevel || 'N/A'}
            </Badge>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Priority</div>
            <div className="text-sm font-semibold">
              {config.priority}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Criteria</div>
            <div className="text-xs font-mono break-words">
              {violation.wcagCriteria?.map(c => c.criterion).join(', ') || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      {(violation.aiExplanation || violation.fixSuggestion) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <h4 className="text-base font-semibold">AI Analysis & Recommendations</h4>
          </div>

          {/* AI Explanation */}
          {violation.aiExplanation && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="h-3.5 w-3.5 shrink-0" />
                  What's the issue?
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm leading-relaxed text-blue-900 break-words">
                  {violation.aiExplanation}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Fix Suggestion */}
          {violation.fixSuggestion && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-3.5 w-3.5 shrink-0" />
                  How to fix it?
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm leading-relaxed text-green-900 break-words">
                  {violation.fixSuggestion}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Code Example */}
          {violation.codeExample && (
            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader className="pb-2 pt-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Code className="h-3.5 w-3.5 shrink-0" />
                    Code Example
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(violation.codeExample!, 'Code')}
                    className="h-7 px-2 shrink-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="relative w-full">
                  <pre className="bg-purple-900/10 border border-purple-200 rounded p-3 text-xs font-mono text-purple-900 whitespace-pre-wrap break-all overflow-x-hidden">
                    {violation.codeExample}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Technical Details Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-muted/20 shrink-0">
            <Tag className="h-4 w-4 text-muted-foreground" />
          </div>
          <h4 className="text-base font-semibold">Technical Details</h4>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Element Information */}
          <Card className="min-w-0">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-sm">Element Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pb-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  CSS Selector
                </label>
                <div className="relative">
                  <div className="font-mono text-xs bg-muted p-2 rounded border break-all pr-8 min-h-[2rem] flex items-center">
                    <span className="break-all">{violation.selector || 'Multiple elements'}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 shrink-0"
                    onClick={() => copyToClipboard(violation.selector, 'Selector')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {violation.target && violation.target.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Affected Elements {violation.elementCount && violation.elementCount > 1 && `(${violation.elementCount})`}
                  </label>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {violation.target.slice(0, 5).map((target, index) => (
                      <div key={index} className="font-mono text-xs bg-muted/50 p-1.5 rounded border break-all">
                        {target}
                      </div>
                    ))}
                    {violation.target.length > 5 && (
                      <div className="text-xs text-muted-foreground italic">
                        ...and {violation.target.length - 5} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* HTML Context */}
          <Card className="min-w-0">
            <CardHeader className="pb-2 pt-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">HTML Context</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(violation.html, 'HTML')}
                  className="h-7 px-2 shrink-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="relative w-full">
                <pre className="bg-muted/30 border rounded p-2 text-xs font-mono text-muted-foreground max-h-40 overflow-y-auto whitespace-pre-wrap break-all overflow-x-hidden">
                  {violation.html || 'No HTML context available'}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Steps */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-100 shrink-0">
            <CheckCircle className="h-4 w-4 text-orange-600" />
          </div>
          <h4 className="text-base font-semibold">Next Steps</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Card className="border-orange-200 bg-orange-50/30">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-semibold shrink-0 mt-0.5">
                  1
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm">Fix the Issue</div>
                  <p className="text-xs text-muted-foreground mt-0.5 break-words">
                    Apply the recommended fix to resolve this violation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50/30">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-semibold shrink-0 mt-0.5">
                  2
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm">Test & Verify</div>
                  <p className="text-xs text-muted-foreground mt-0.5 break-words">
                    Use screen readers and keyboard navigation to verify
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold mb-2">Additional Resources</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(violation.helpUrl, '_blank')}
            className="h-7 text-xs shrink-0"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            WCAG Documentation
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://www.w3.org/WAI/WCAG21/Understanding/`, '_blank')}
            className="h-7 text-xs shrink-0"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Understanding WCAG
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://webaim.org/`, '_blank')}
            className="h-7 text-xs shrink-0"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            WebAIM
          </Button>
        </div>
      </div>
    </div>
  )
}

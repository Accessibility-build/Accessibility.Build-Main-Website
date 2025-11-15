"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Search, 
  FileSpreadsheet,
  FileText,
  RotateCcw,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  BarChart3,
  CheckSquare,
  Square,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Award,
  Eye,
  Target
} from 'lucide-react'
import { wcagCriteria } from '@/lib/wcag-data'
import * as XLSX from 'xlsx'

interface CriterionStatus {
  checked: boolean
  note: string
}

interface ChecklistState {
  [key: string]: CriterionStatus
}

const InteractiveWCAGChecklist = () => {
  const [checklistState, setChecklistState] = useState<ChecklistState>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [principleFilter, setPrincipleFilter] = useState<string>('all')
  const [versionFilter, setVersionFilter] = useState<string>('all')
  const [introducedFilter, setIntroducedFilter] = useState<string>('all')
  const [showCompleted, setShowCompleted] = useState(true)
  const [showIncomplete, setShowIncomplete] = useState(true)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'number' | 'title' | 'level'>('number')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isExporting, setIsExporting] = useState(false)

  // Available WCAG guides mapping
  const availableGuides = new Set([
    '1.1.1', '1.2.1', '1.2.2', '1.2.3', '1.3.1', '1.3.2', '1.3.3',
    '1.4.1', '1.4.2', '1.4.3', '2.1.1', '2.1.2', '2.1.4', '2.2.1',
    '2.2.2', '2.3.1', '2.4.1', '2.4.2', '2.4.3'
  ])

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('wcag-checklist-state')
    if (saved) {
      try {
        setChecklistState(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load checklist state:', e)
      }
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wcag-checklist-state', JSON.stringify(checklistState))
  }, [checklistState])

  const toggleCriterion = useCallback((number: string) => {
    setChecklistState(prev => ({
      ...prev,
      [number]: {
        checked: !prev[number]?.checked,
        note: prev[number]?.note || ''
      }
    }))
  }, [])

  const updateNote = useCallback((number: string, note: string) => {
    setChecklistState(prev => ({
      ...prev,
      [number]: {
        checked: prev[number]?.checked || false,
        note
      }
    }))
  }, [])

  const filteredAndSortedData = useMemo(() => {
    const filtered = wcagCriteria.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.number.includes(searchTerm)
      
      const matchesLevel = levelFilter === 'all' || item.level === levelFilter
      const matchesPrinciple = principleFilter === 'all' || item.principle === principleFilter
      
      // Version filter should show all criteria available in that version (cumulative)
      const matchesVersion = versionFilter === 'all' || 
        (versionFilter === '2.0' && item.introduced === '2.0') ||
        (versionFilter === '2.1' && (item.introduced === '2.0' || item.introduced === '2.1')) ||
        (versionFilter === '2.2' && (item.introduced === '2.0' || item.introduced === '2.1' || item.introduced === '2.2'))
      
      const matchesIntroduced = introducedFilter === 'all' || item.introduced === introducedFilter
      
      const isCompleted = checklistState[item.number]?.checked || false
      const matchesCompletion = (showCompleted && isCompleted) || (showIncomplete && !isCompleted)
      
      return matchesSearch && matchesLevel && matchesPrinciple && matchesVersion && matchesIntroduced && matchesCompletion
    })

    // Sort the filtered data
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'number':
          aValue = a.number
          bValue = b.number
          break
        case 'title':
          aValue = a.title
          bValue = b.title
          break
        case 'level':
          const levelOrder = { 'A': 1, 'AA': 2, 'AAA': 3 }
          aValue = levelOrder[a.level]
          bValue = levelOrder[b.level]
          break
        default:
          aValue = a.number
          bValue = b.number
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [searchTerm, levelFilter, principleFilter, showCompleted, showIncomplete, checklistState, sortBy, sortOrder])

  const stats = useMemo(() => {
    const total = wcagCriteria.length
    const completed = wcagCriteria.filter(item => checklistState[item.number]?.checked).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    
    const byLevel = {
      A: { total: 0, completed: 0 },
      AA: { total: 0, completed: 0 },
      AAA: { total: 0, completed: 0 }
    }
    
    wcagCriteria.forEach(item => {
      byLevel[item.level].total++
      if (checklistState[item.number]?.checked) {
        byLevel[item.level].completed++
      }
    })
    
    return { total, completed, percentage, byLevel }
  }, [checklistState])

  const getLevelBadge = (level: 'A' | 'AA' | 'AAA') => {
    const variants = {
      'A': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 shadow-sm',
      'AA': 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 shadow-sm', 
      'AAA': 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200 shadow-sm'
    }
    
    return (
      <Badge variant="outline" className={`${variants[level]} font-mono text-xs font-bold`}>
        {level}
      </Badge>
    )
  }

  const exportToExcel = () => {
    setIsExporting(true)
    try {
      // Main checklist data with proper formatting
      const checklistData = wcagCriteria.map((criterion, index) => ({
        'Row #': index + 1,
        'SC Number': criterion.number,
        'Success Criterion': criterion.title,
        'Level': criterion.level,
        'Principle': criterion.principle,
        'Guideline': criterion.guideline,
        'Description': criterion.description,
        'Status': checklistState[criterion.number]?.checked ? 'COMPLETED' : 'NOT COMPLETED',
        'Completion Date': checklistState[criterion.number]?.checked ? new Date().toLocaleDateString() : '',
        'Notes': checklistState[criterion.number]?.note || '',
        'Priority': criterion.level === 'AA' ? 'HIGH' : criterion.level === 'A' ? 'MEDIUM' : 'LOW'
      }))

      // Create main worksheet
      const worksheet = XLSX.utils.json_to_sheet(checklistData)
      
      // Enhanced column widths for accessibility
      const columnWidths = [
        { wch: 8 },  // Row #
        { wch: 12 }, // SC Number
        { wch: 40 }, // Success Criterion
        { wch: 8 },  // Level
        { wch: 20 }, // Principle
        { wch: 30 }, // Guideline
        { wch: 60 }, // Description
        { wch: 15 }, // Status
        { wch: 15 }, // Completion Date
        { wch: 40 }, // Notes
        { wch: 10 }  // Priority
      ]
      worksheet['!cols'] = columnWidths

      // Add autofilter for accessibility
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
      worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(range) }

      // Create workbook and add main sheet
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'WCAG 2.2 Checklist')
      
      // Create enhanced summary sheet
      const summaryData = [
        ['WCAG 2.2 Accessibility Audit Report'],
        ['Generated by Accessibility.build'],
        [''],
        ['AUDIT SUMMARY'],
        ['Total Success Criteria:', stats.total],
        ['Completed Criteria:', stats.completed],
        ['Remaining Criteria:', stats.total - stats.completed],
        ['Overall Progress:', `${stats.percentage}%`],
        [''],
        ['CONFORMANCE LEVEL BREAKDOWN'],
        ['Level A - Total:', stats.byLevel.A.total],
        ['Level A - Completed:', stats.byLevel.A.completed],
        ['Level A - Progress:', `${stats.byLevel.A.total > 0 ? Math.round((stats.byLevel.A.completed / stats.byLevel.A.total) * 100) : 0}%`],
        [''],
        ['Level AA - Total:', stats.byLevel.AA.total],
        ['Level AA - Completed:', stats.byLevel.AA.completed],
        ['Level AA - Progress:', `${stats.byLevel.AA.total > 0 ? Math.round((stats.byLevel.AA.completed / stats.byLevel.AA.total) * 100) : 0}%`],
        [''],
        ['Level AAA - Total:', stats.byLevel.AAA.total],
        ['Level AAA - Completed:', stats.byLevel.AAA.completed],
        ['Level AAA - Progress:', `${stats.byLevel.AAA.total > 0 ? Math.round((stats.byLevel.AAA.completed / stats.byLevel.AAA.total) * 100) : 0}%`],
        [''],
        ['EXPORT INFORMATION'],
        ['Export Date:', new Date().toLocaleDateString()],
        ['Export Time:', new Date().toLocaleTimeString()],
        ['Exported by:', 'Accessibility.build Platform'],
        [''],
        ['NEXT STEPS'],
        ['1. Review all incomplete criteria'],
        ['2. Prioritize Level AA criteria for compliance'],
        ['3. Document implementation details in Notes'],
        ['4. Test with assistive technologies'],
        ['5. Conduct user testing with disabled users']
      ]
      
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
      
      // Set column widths for summary
      summarySheet['!cols'] = [{ wch: 30 }, { wch: 25 }]
      
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Audit Summary')

      // Create progress tracking sheet
      const progressData = [
        ['Progress Tracking'],
        [''],
        ['Date', 'Total Completed', 'Level A', 'Level AA', 'Level AAA', 'Notes'],
        [new Date().toLocaleDateString(), stats.completed, stats.byLevel.A.completed, stats.byLevel.AA.completed, stats.byLevel.AAA.completed, 'Initial export']
      ]
      
      const progressSheet = XLSX.utils.aoa_to_sheet(progressData)
      progressSheet['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 30 }]
      
      XLSX.utils.book_append_sheet(workbook, progressSheet, 'Progress Tracking')

      const fileName = `WCAG-2.2-Accessibility-Audit-${new Date().toISOString().split('T')[0]}.xlsx`
      XLSX.writeFile(workbook, fileName)
      
      // Show success message
      alert(`✅ Excel report exported successfully!\n\nFile: ${fileName}\n\nThe report includes:\n• Complete checklist with your progress\n• Audit summary and statistics\n• Progress tracking template\n• Autofilters for easy sorting`)
      
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      alert('❌ Error exporting to Excel. Please try again or contact support.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    try {
      // Dynamic import to avoid SSR issues
      const [jsPDFModule, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable')
      ])
      
      const doc = new jsPDFModule.jsPDF('l', 'mm', 'a4') // landscape orientation
      
      // Header with logo area
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text('WCAG 2.2 Accessibility Checklist', 20, 25)
      
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text('Generated by Accessibility.build', 20, 35)
      
      // Summary box
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Audit Summary', 20, 50)
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      const summaryText = [
        `Total Progress: ${stats.completed}/${stats.total} (${stats.percentage}%)`,
        `Level A: ${stats.byLevel.A.completed}/${stats.byLevel.A.total} (${stats.byLevel.A.total > 0 ? Math.round((stats.byLevel.A.completed / stats.byLevel.A.total) * 100) : 0}%)`,
        `Level AA: ${stats.byLevel.AA.completed}/${stats.byLevel.AA.total} (${stats.byLevel.AA.total > 0 ? Math.round((stats.byLevel.AA.completed / stats.byLevel.AA.total) * 100) : 0}%)`,
        `Level AAA: ${stats.byLevel.AAA.completed}/${stats.byLevel.AAA.total} (${stats.byLevel.AAA.total > 0 ? Math.round((stats.byLevel.AAA.completed / stats.byLevel.AAA.total) * 100) : 0}%)`,
        `Export Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
      ]
      
      summaryText.forEach((text, index) => {
        doc.text(text, 20, 60 + (index * 8))
      })

      // Prepare enhanced table data
      const tableData = wcagCriteria.map(criterion => [
        criterion.number,
        criterion.title.length > 40 ? criterion.title.substring(0, 40) + '...' : criterion.title,
        criterion.level,
        checklistState[criterion.number]?.checked ? '✓' : '✗',
        (checklistState[criterion.number]?.note || '').length > 30 ? 
          (checklistState[criterion.number]?.note || '').substring(0, 30) + '...' : 
          (checklistState[criterion.number]?.note || '')
      ])

      // Enhanced table with better styling
      autoTable(doc, {
        head: [['SC #', 'Success Criterion', 'Level', 'Status', 'Notes']],
        body: tableData,
        startY: 110,
        styles: { 
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
          halign: 'left'
        },
        headStyles: { 
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 20, halign: 'center' }, // SC #
          1: { cellWidth: 85 }, // Success Criterion
          2: { cellWidth: 15, halign: 'center' }, // Level
          3: { cellWidth: 15, halign: 'center' }, // Status
          4: { cellWidth: 45 }  // Notes
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        },
        didParseCell: function(data) {
          if (data.column.index === 3) {
            if (data.cell.raw === '✓') {
              data.cell.styles.textColor = [34, 197, 94] // green
              data.cell.styles.fontStyle = 'bold'
            } else if (data.cell.raw === '✗') {
              data.cell.styles.textColor = [239, 68, 68] // red
              data.cell.styles.fontStyle = 'bold'
            }
          }
          
          // Highlight Level AA criteria
          if (data.column.index === 2 && data.cell.raw === 'AA') {
            data.cell.styles.fillColor = [219, 234, 254]
            data.cell.styles.fontStyle = 'bold'
          }
        }
      })

      // Footer - simplified without page numbers to avoid API issues
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('Generated by Accessibility.build', 20, 200)

      const fileName = `WCAG-2.2-Accessibility-Audit-${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
      
      // Show success message
      alert(`✅ PDF report exported successfully!\n\nFile: ${fileName}\n\nThe report includes your complete audit progress with detailed formatting.`)
      
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      alert('❌ Error exporting to PDF. Please check your browser settings and try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const checkAll = () => {
    const newState: ChecklistState = {}
    wcagCriteria.forEach(criterion => {
      newState[criterion.number] = {
        checked: true,
        note: checklistState[criterion.number]?.note || ''
      }
    })
    setChecklistState(newState)
  }

  const uncheckAll = () => {
    const newState: ChecklistState = {}
    wcagCriteria.forEach(criterion => {
      newState[criterion.number] = {
        checked: false,
        note: checklistState[criterion.number]?.note || ''
      }
    })
    setChecklistState(newState)
  }

  const resetAll = () => {
    if (confirm('⚠️ Are you sure you want to reset all progress?\n\nThis will remove all checkmarks and notes. This action cannot be undone.')) {
      setChecklistState({})
      localStorage.removeItem('wcag-checklist-state')
      setExpandedRows(new Set())
      alert('✅ All progress has been reset.')
    }
  }

  const toggleExpanded = (number: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(number)) {
        newSet.delete(number)
      } else {
        newSet.add(number)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Progress Overview */}
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Progress Overview
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center group">
              <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-600 group-hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold text-slate-700 dark:text-slate-300 mb-2">{stats.completed}/{stats.total}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Progress</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 rounded-2xl border border-green-200 dark:border-green-700 group-hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{stats.percentage}%</div>
                <div className="text-sm text-green-700 dark:text-green-300 font-medium">Complete</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-2xl border border-blue-200 dark:border-blue-700 group-hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stats.byLevel.AA.completed}/{stats.byLevel.AA.total}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Level AA</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/30 rounded-2xl border border-purple-200 dark:border-purple-700 group-hover:scale-105 transition-all duration-300">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{stats.byLevel.AAA.completed}/{stats.byLevel.AAA.total}</div>
                <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">Level AAA</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${stats.percentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {stats.completed} of {stats.total} criteria completed
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Controls */}
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-teal-50 dark:from-indigo-900/20 dark:to-teal-900/20">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-teal-600 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            Filtering & Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                placeholder="Search criteria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 rounded-xl transition-all"
              />
            </div>

            {/* Level Filter */}
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-xl">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="A">Level A</SelectItem>
                <SelectItem value="AA">Level AA</SelectItem>
                <SelectItem value="AAA">Level AAA</SelectItem>
              </SelectContent>
            </Select>

            {/* Principle Filter */}
            <Select value={principleFilter} onValueChange={setPrincipleFilter}>
              <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-xl">
                <SelectValue placeholder="Filter by principle" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl">
                <SelectItem value="all">All Principles</SelectItem>
                <SelectItem value="1. Perceivable">1. Perceivable</SelectItem>
                <SelectItem value="2. Operable">2. Operable</SelectItem>
                <SelectItem value="3. Understandable">3. Understandable</SelectItem>
                <SelectItem value="4. Robust">4. Robust</SelectItem>
              </SelectContent>
            </Select>

            {/* Version Filter */}
            <Select value={versionFilter} onValueChange={setVersionFilter}>
              <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-xl">
                <SelectValue placeholder="Filter by version" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl">
                <SelectItem value="all">All Versions</SelectItem>
                <SelectItem value="2.0">WCAG 2.0 Only</SelectItem>
                <SelectItem value="2.1">WCAG 2.1 (includes 2.0)</SelectItem>
                <SelectItem value="2.2">WCAG 2.2 (all criteria)</SelectItem>
              </SelectContent>
            </Select>

            {/* Introduced Filter */}
            <Select value={introducedFilter} onValueChange={setIntroducedFilter}>
              <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-xl">
                <SelectValue placeholder="Filter by introduced" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl">
                <SelectItem value="all">All Versions</SelectItem>
                <SelectItem value="2.0">Introduced in 2.0</SelectItem>
                <SelectItem value="2.1">Introduced in 2.1</SelectItem>
                <SelectItem value="2.2">Introduced in 2.2</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [newSortBy, newSortOrder] = value.split('-') as [typeof sortBy, typeof sortOrder]
              setSortBy(newSortBy)
              setSortOrder(newSortOrder)
            }}>
              <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl">
                <SelectItem value="number-asc">Number (A-Z)</SelectItem>
                <SelectItem value="number-desc">Number (Z-A)</SelectItem>
                <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                <SelectItem value="level-asc">Level (A-AAA)</SelectItem>
                <SelectItem value="level-desc">Level (AAA-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Completion Filters */}
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-completed"
                  checked={showCompleted}
                  onCheckedChange={(checked) => setShowCompleted(checked === true)}
                  className="border-green-300 data-[state=checked]:bg-green-600"
                />
                <label htmlFor="show-completed" className="text-sm font-medium cursor-pointer">
                  Show completed ({stats.completed})
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-incomplete"
                  checked={showIncomplete}
                  onCheckedChange={(checked) => setShowIncomplete(checked === true)}
                  className="border-orange-300 data-[state=checked]:bg-orange-600"
                />
                <label htmlFor="show-incomplete" className="text-sm font-medium cursor-pointer">
                  Show incomplete ({stats.total - stats.completed})
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {/* Bulk Actions */}
              <Button variant="outline" size="sm" onClick={checkAll} className="hover:bg-green-50 hover:border-green-300 hover:text-green-700">
                <CheckSquare className="w-4 h-4 mr-2" />
                Check All
              </Button>
              <Button variant="outline" size="sm" onClick={uncheckAll} className="hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700">
                <Square className="w-4 h-4 mr-2" />
                Uncheck All
              </Button>

              {/* Export & Reset */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportToExcel}
                disabled={isExporting}
                className="hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'Excel'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportToPDF}
                disabled={isExporting}
                className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isExporting ? 'Exporting...' : 'PDF'}
              </Button>
              <Button variant="outline" size="sm" onClick={resetAll} className="hover:bg-red-50 hover:border-red-300 hover:text-red-700">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            Showing {filteredAndSortedData.length} of {wcagCriteria.length} criteria
          </span>
        </div>
        {isExporting && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="font-medium">Generating export...</span>
          </div>
        )}
      </div>

      {/* Enhanced Checklist Table */}
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left p-4 w-12 font-semibold text-slate-700 dark:text-slate-300">#</th>
                  <th className="text-left p-4 w-20 font-semibold text-slate-700 dark:text-slate-300">SC #</th>
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Success Criterion</th>
                  <th className="text-left p-4 w-16 font-semibold text-slate-700 dark:text-slate-300">Level</th>
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Description</th>
                  <th className="text-left p-4 w-32 font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedData.map((criterion, _index) => {
                  const isChecked = checklistState[criterion.number]?.checked || false
                  const hasNote = checklistState[criterion.number]?.note || ''
                  const isExpanded = expandedRows.has(criterion.number)
                  
                  return (
                    <React.Fragment key={criterion.number}>
                      <tr className={`border-b border-slate-100 dark:border-slate-700 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/10 dark:hover:to-purple-900/10 transition-all duration-200 ${
                        isChecked ? 'bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10' : ''
                      }`}>
                        <td className="p-4">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleCriterion(criterion.number)}
                            className="border-slate-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                          />
                        </td>
                        <td className="p-4 font-mono text-sm font-medium text-slate-600 dark:text-slate-400">{criterion.number}</td>
                        <td className="p-4 font-medium">
                          <div className="flex items-center gap-2">
                            {availableGuides.has(criterion.number) ? (
                              <Link 
                                href={`/wcag/${criterion.number.replace(/\./g, '-')}`}
                                className="text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 underline decoration-2 decoration-blue-500/30 hover:decoration-blue-500 transition-colors"
                                title={`View interactive guide for ${criterion.title}`}
                              >
                                {criterion.title}
                              </Link>
                            ) : (
                              <span className="text-slate-800 dark:text-slate-200">{criterion.title}</span>
                            )}
                            {isChecked && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                            {hasNote && <MessageSquare className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                          </div>
                        </td>
                        <td className="p-4">{getLevelBadge(criterion.level)}</td>
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400 max-w-md">
                          {criterion.description}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700">
                                  <MessageSquare className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                                    Notes for {criterion.number}: {criterion.title}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Implementation Notes</label>
                                    <Textarea
                                      placeholder="Add your notes, findings, implementation details, test results, or action items..."
                                      value={hasNote}
                                      onChange={(e) => updateNote(criterion.number, e.target.value)}
                                      rows={4}
                                      className="mt-1 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                                    />
                                  </div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                                    <strong>Guideline:</strong> {criterion.guideline}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(criterion.number)}
                              className="h-8 w-8 p-0 hover:bg-purple-100 hover:text-purple-700"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-slate-50/80 to-blue-50/40 dark:from-slate-800/80 dark:to-blue-900/20">
                          <td colSpan={6} className="p-6">
                            <div className="space-y-4">
                              <div className="grid md:grid-cols-2 gap-6 text-sm">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-blue-600" />
                                    <strong className="text-slate-800 dark:text-slate-200">Principle:</strong>
                                  </div>
                                  <p className="text-slate-600 dark:text-slate-400 ml-6">{criterion.principle}</p>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-purple-600" />
                                    <strong className="text-slate-800 dark:text-slate-200">Guideline:</strong>
                                  </div>
                                  <p className="text-slate-600 dark:text-slate-400 ml-6">{criterion.guideline}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-teal-600" />
                                  <strong className="text-slate-800 dark:text-slate-200">Full Description:</strong>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 ml-6 leading-relaxed">{criterion.description}</p>
                              </div>
                              {hasNote && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                                  <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="w-4 h-4 text-blue-600" />
                                    <strong className="text-blue-900 dark:text-blue-300">Your Notes:</strong>
                                  </div>
                                  <p className="text-blue-800 dark:text-blue-300 ml-6">{hasNote}</p>
                                </div>
                              )}
                              <div className="flex items-center gap-3 pt-2">
                                <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-full ${
                                  isChecked ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-orange-100 text-orange-800 border border-orange-200'
                                }`}>
                                  {isChecked ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                  <span className="font-medium">{isChecked ? 'Completed' : 'Needs Attention'}</span>
                                </div>
                                {criterion.level === 'AA' && (
                                  <div className="text-xs px-3 py-2 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                    <Award className="w-3 h-3 inline mr-1" />
                                    Required for Legal Compliance
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InteractiveWCAGChecklist 
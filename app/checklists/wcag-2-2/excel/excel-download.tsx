"use client"

import { useState } from "react"
import { getWCAGStats, wcagCriteria } from "@/lib/wcag-data"
import * as XLSX from "xlsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { 
  FileSpreadsheet, 
  Download, 
  ArrowLeft, 
  CheckCircle, 
  FileText, 
  Settings, 
  Sparkles,
  Star,
  Users,
  Building2,
  Zap,
  Filter,
  ClipboardList,
  BarChart3,
  TrendingUp,
  BookOpen,
  Target,
  Lock,
  Columns,
  AlignJustify,
  Layers,
  Lightbulb
} from "lucide-react"
import Link from "next/link"

interface ExportOptions {
  includeLevelA: boolean
  includeLevelAA: boolean
  includeLevelAAA: boolean
  includeNotes: boolean
  includeSummary: boolean
  includeProgressSheet: boolean
  projectName: string
  auditorName: string
  format: 'xlsx' | 'csv'
}

// Professional Excel styling utilities
const createStyledWorkbook = () => {
  const workbook = XLSX.utils.book_new()
  return workbook
}

// Apply professional styling to worksheet
const applyProfessionalStyling = (worksheet: XLSX.WorkSheet, dataLength: number, columnCount: number) => {
  // Set column widths
  const colWidths: XLSX.ColInfo[] = []
  for (let i = 0; i < columnCount; i++) {
    colWidths.push({ wch: 15 })
  }
  worksheet['!cols'] = colWidths

  // Set row heights for header
  worksheet['!rows'] = [{ hpt: 30 }]
  
  return worksheet
}

export default function WCAGExcelDownload() {
  const stats = getWCAGStats()
  const [isDownloading, setIsDownloading] = useState(false)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeLevelA: true,
    includeLevelAA: true,
    includeLevelAAA: true,
    includeNotes: true,
    includeSummary: true,
    includeProgressSheet: true,
    projectName: '',
    auditorName: '',
    format: 'xlsx'
  })

  const getSelectedCriteria = () => {
    return wcagCriteria.filter(criterion => {
      if (criterion.level === 'A' && exportOptions.includeLevelA) return true
      if (criterion.level === 'AA' && exportOptions.includeLevelAA) return true
      if (criterion.level === 'AAA' && exportOptions.includeLevelAAA) return true
      return false
    })
  }

  const selectedCount = getSelectedCriteria().length

  // Get level color for Excel
  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'A': return '10B981' // Emerald
      case 'AA': return '3B82F6' // Blue
      case 'AAA': return '8B5CF6' // Purple
      default: return '64748B' // Slate
    }
  }

  // Get priority color for Excel
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'HIGH': return 'EF4444' // Red
      case 'MEDIUM': return 'F59E0B' // Amber
      case 'LOW': return '22C55E' // Green
      default: return '64748B'
    }
  }

  const downloadExcelTemplate = () => {
    setIsDownloading(true)
    try {
      const selectedCriteria = getSelectedCriteria()
      const workbook = createStyledWorkbook()

      // ============================================
      // SHEET 1: WCAG 2.2 CHECKLIST (Main Sheet)
      // ============================================
      
      // Create header row with professional styling
      // Excel-native structure: Status and Result columns for filtering
      const headers = [
        '#',
        'SC Number',
        'Success Criterion',
        'Level',
        'Principle',
        'Guideline',
        'Description',
        'Status',           // Dropdown: NOT STARTED, IN PROGRESS, COMPLETED
        'Result',           // Dropdown: PENDING, PASS, FAIL, N/A
        ...(exportOptions.includeNotes ? ['Notes & Findings'] : []),
        'Priority',
        'Assigned To',
        'Due Date',
        'Completion Date',
        'Test Date'         // When the test was performed
      ]

      // Create data rows with Excel-friendly values
      const rows = selectedCriteria.map((criterion, index) => {
        const priority = criterion.level === 'AA' ? 'HIGH' : criterion.level === 'A' ? 'MEDIUM' : 'LOW'
        return [
          index + 1,
          criterion.number,
          criterion.title,
          criterion.level,
          criterion.principle,
          criterion.guideline,
          criterion.description,
          'NOT STARTED',     // Status: NOT STARTED, IN PROGRESS, COMPLETED
          'PENDING',         // Result: PENDING, PASS, FAIL, N/A (filterable)
          ...(exportOptions.includeNotes ? [''] : []),
          priority,
          '',
          '',
          '',
          ''
        ]
      })

      // Create worksheet with headers and data
      const wsData = [headers, ...rows]
      const worksheet = XLSX.utils.aoa_to_sheet(wsData)

      // Set professional column widths
      worksheet['!cols'] = [
        { wch: 5 },   // #
        { wch: 10 },  // SC Number
        { wch: 45 },  // Success Criterion
        { wch: 8 },   // Level
        { wch: 18 },  // Principle
        { wch: 35 },  // Guideline
        { wch: 70 },  // Description
        { wch: 15 },  // Status (dropdown)
        { wch: 12 },  // Result (dropdown: PENDING, PASS, FAIL, N/A)
        ...(exportOptions.includeNotes ? [{ wch: 50 }] : []), // Notes
        { wch: 10 },  // Priority
        { wch: 18 },  // Assigned To
        { wch: 14 },  // Due Date
        { wch: 16 },  // Completion Date
        { wch: 14 }   // Test Date
      ]

      // Set row heights
      worksheet['!rows'] = [
        { hpt: 35 }, // Header row height
        ...rows.map(() => ({ hpt: 45 })) // Data rows with good height for content
      ]

      // Add autofilter
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
      worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(range) }

      // Add freeze pane for header
      worksheet['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft', state: 'frozen' }

      XLSX.utils.book_append_sheet(workbook, worksheet, 'WCAG 2.2 Checklist')

      // ============================================
      // SHEET 2: AUDIT SUMMARY
      // ============================================
      if (exportOptions.includeSummary) {
        const levelACriteria = selectedCriteria.filter(c => c.level === 'A').length
        const levelAACriteria = selectedCriteria.filter(c => c.level === 'AA').length
        const levelAAACriteria = selectedCriteria.filter(c => c.level === 'AAA').length

        const summaryData = [
          ['', '', ''],
          ['', 'WCAG 2.2 ACCESSIBILITY AUDIT REPORT', ''],
          ['', 'Generated by Accessibility.build', ''],
          ['', '', ''],
          ['', '═══════════════════════════════════════════', ''],
          ['', '', ''],
          ['', 'PROJECT INFORMATION', ''],
          ['', '─────────────────────────────────────────', ''],
          ['', 'Project Name:', exportOptions.projectName || '(Not Specified)'],
          ['', 'Auditor:', exportOptions.auditorName || '(Not Specified)'],
          ['', 'Audit Date:', new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
          ['', 'Generated:', new Date().toLocaleTimeString()],
          ['', '', ''],
          ['', '═══════════════════════════════════════════', ''],
          ['', '', ''],
          ['', 'AUDIT SCOPE', ''],
          ['', '─────────────────────────────────────────', ''],
          ['', 'Total Success Criteria:', selectedCriteria.length],
          ['', '', ''],
          ['', '    Level A (Essential):', `${levelACriteria} criteria`],
          ['', '    Level AA (Required):', `${levelAACriteria} criteria`],
          ['', '    Level AAA (Enhanced):', `${levelAAACriteria} criteria`],
          ['', '', ''],
          ['', '═══════════════════════════════════════════', ''],
          ['', '', ''],
          ['', 'CONFORMANCE TARGETS', ''],
          ['', '─────────────────────────────────────────', ''],
          ['', 'Level A:', exportOptions.includeLevelA ? '✓ Included' : '✗ Excluded'],
          ['', 'Level AA:', exportOptions.includeLevelAA ? '✓ Included' : '✗ Excluded'],
          ['', 'Level AAA:', exportOptions.includeLevelAAA ? '✓ Included' : '✗ Excluded'],
          ['', '', ''],
          ['', '═══════════════════════════════════════════', ''],
          ['', '', ''],
          ['', 'AUDIT STATUS TRACKING', ''],
          ['', '─────────────────────────────────────────', ''],
          ['', 'Status', 'Count'],
          ['', 'NOT STARTED', '0'],
          ['', 'IN PROGRESS', '0'],
          ['', 'COMPLETED', '0'],
          ['', '', ''],
          ['', 'Result', 'Count'],
          ['', 'PENDING', '0'],
          ['', 'PASS', '0'],
          ['', 'FAIL', '0'],
          ['', 'N/A', '0'],
          ['', '', ''],
          ['', '═══════════════════════════════════════════', ''],
          ['', '', ''],
          ['', 'INSTRUCTIONS', ''],
          ['', '─────────────────────────────────────────', ''],
          ['', '1.', 'Navigate to the "WCAG 2.2 Checklist" sheet'],
          ['', '2.', 'Update the Status column: NOT STARTED, IN PROGRESS, or COMPLETED'],
          ['', '3.', 'Set the Result column: PENDING, PASS, FAIL, or N/A'],
          ['', '4.', 'Use Data Validation (see "Data Validation" sheet) for dropdown lists'],
          ['', '5.', 'Add detailed notes in the Notes & Findings column'],
          ['', '6.', 'Assign team members and set due dates'],
          ['', '7.', 'Use filters (dropdown arrows in header) to filter by Status, Result, or Level'],
          ['', '8.', 'Filter by Result = FAIL to see all criteria needing remediation'],
          ['', '9.', 'Track progress over time using the Progress Tracking sheet'],
          ['', '', ''],
          ['', '═══════════════════════════════════════════', ''],
          ['', '', ''],
          ['', 'STATUS DEFINITIONS', ''],
          ['', '─────────────────────────────────────────', ''],
          ['', 'NOT STARTED', 'Criterion has not been evaluated yet'],
          ['', 'IN PROGRESS', 'Currently being evaluated or remediated'],
          ['', 'COMPLETED', 'Evaluation finished (regardless of result)'],
          ['', '', ''],
          ['', 'RESULT DEFINITIONS', ''],
          ['', '─────────────────────────────────────────', ''],
          ['', 'PENDING', 'Not yet tested (default value)'],
          ['', 'PASS', 'Criterion fully met - no issues found'],
          ['', 'FAIL', 'Criterion not met - remediation required'],
          ['', 'N/A', 'Criterion does not apply to this content'],
          ['', '', ''],
          ['', '═══════════════════════════════════════════', ''],
        ]

        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
        summarySheet['!cols'] = [{ wch: 5 }, { wch: 35 }, { wch: 40 }]
        summarySheet['!rows'] = [
          { hpt: 10 },
          { hpt: 30 }, // Title
          { hpt: 20 }, // Subtitle
          ...Array(summaryData.length - 3).fill({ hpt: 18 })
        ]
        
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Audit Summary')
      }

      // ============================================
      // SHEET 3: PROGRESS TRACKING
      // ============================================
      if (exportOptions.includeProgressSheet) {
        const progressData = [
          ['', '', '', '', '', '', '', ''],
          ['', 'PROGRESS TRACKING', '', '', '', '', '', ''],
          ['', 'Track your audit progress over time', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '═══════════════════════════════════════════════════════════════', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', 'Date', 'Total Tested', 'Pass', 'Fail', 'N/A', 'Progress %', 'Notes'],
          ['', '─────────────', '─────────────', '─────────', '─────────', '─────────', '─────────────', '─────────────────────────────'],
          ['', new Date().toLocaleDateString(), '0', '0', '0', '0', '0%', 'Audit started'],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '═══════════════════════════════════════════════════════════════', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', 'LEVEL-SPECIFIC PROGRESS', '', '', '', '', '', ''],
          ['', '─────────────────────────────────────────', '', '', '', '', '', ''],
          ['', '', '', '', '', '', '', ''],
          ['', 'Level', 'Total', 'Tested', 'Pass', 'Fail', 'Progress', ''],
          ['', 'Level A', selectedCriteria.filter(c => c.level === 'A').length.toString(), '0', '0', '0', '0%', ''],
          ['', 'Level AA', selectedCriteria.filter(c => c.level === 'AA').length.toString(), '0', '0', '0', '0%', ''],
          ['', 'Level AAA', selectedCriteria.filter(c => c.level === 'AAA').length.toString(), '0', '0', '0', '0%', ''],
          ['', '', '', '', '', '', '', ''],
          ['', '═══════════════════════════════════════════════════════════════', '', '', '', '', '', ''],
        ]

        const progressSheet = XLSX.utils.aoa_to_sheet(progressData)
        progressSheet['!cols'] = [
          { wch: 3 },
          { wch: 16 },
          { wch: 14 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 14 },
          { wch: 40 }
        ]
        progressSheet['!rows'] = [
          { hpt: 10 },
          { hpt: 28 },
          { hpt: 18 },
          ...Array(progressData.length - 3).fill({ hpt: 22 })
        ]

        XLSX.utils.book_append_sheet(workbook, progressSheet, 'Progress Tracking')
      }

      // ============================================
      // SHEET 4: DATA VALIDATION (Dropdown Options)
      // ============================================
      const validationData = [
        ['', '', ''],
        ['', 'DATA VALIDATION OPTIONS', '', ''],
        ['', 'Use these values for dropdown lists in Excel', '', ''],
        ['', '', '', ''],
        ['', '═══════════════════════════════════════════════════════════════════════', '', ''],
        ['', '', '', ''],
        ['', 'STATUS COLUMN OPTIONS', '', ''],
        ['', '─────────────────────────────────────────────────────────────────', '', ''],
        ['', '', '', ''],
        ['', 'Option', 'Description', ''],
        ['', 'NOT STARTED', 'Criterion has not been evaluated yet', ''],
        ['', 'IN PROGRESS', 'Currently being evaluated or remediated', ''],
        ['', 'COMPLETED', 'Evaluation finished (regardless of result)', ''],
        ['', '', '', ''],
        ['', '═══════════════════════════════════════════════════════════════════════', '', ''],
        ['', '', '', ''],
        ['', 'RESULT COLUMN OPTIONS', '', ''],
        ['', '─────────────────────────────────────────────────────────────────', '', ''],
        ['', '', '', ''],
        ['', 'Option', 'Description', ''],
        ['', 'PENDING', 'Not yet tested (default value)', ''],
        ['', 'PASS', 'Criterion fully met - no issues found', ''],
        ['', 'FAIL', 'Criterion not met - remediation required', ''],
        ['', 'N/A', 'Criterion does not apply to this content', ''],
        ['', '', '', ''],
        ['', '═══════════════════════════════════════════════════════════════════════', '', ''],
        ['', '', '', ''],
        ['', 'HOW TO ADD DATA VALIDATION IN EXCEL', '', ''],
        ['', '─────────────────────────────────────────────────────────────────', '', ''],
        ['', '', '', ''],
        ['', 'Step', 'Instructions', ''],
        ['', '1.', 'Select the Status column (column H) in the Checklist sheet', ''],
        ['', '2.', 'Go to Data > Data Validation', ''],
        ['', '3.', 'Allow: List', ''],
        ['', '4.', 'Source: NOT STARTED,IN PROGRESS,COMPLETED', ''],
        ['', '5.', 'Click OK', ''],
        ['', '', '', ''],
        ['', 'For Result column (column I):', '', ''],
        ['', '1.', 'Select the Result column (column I)', ''],
        ['', '2.', 'Go to Data > Data Validation', ''],
        ['', '3.', 'Allow: List', ''],
        ['', '4.', 'Source: PENDING,PASS,FAIL,N/A', ''],
        ['', '5.', 'Click OK', ''],
        ['', '', '', ''],
        ['', '═══════════════════════════════════════════════════════════════════════', '', ''],
        ['', '', '', ''],
        ['', 'FILTERING TIPS', '', ''],
        ['', '─────────────────────────────────────────────────────────────────', '', ''],
        ['', '', '', ''],
        ['', '• Use the filter dropdowns in the header row to filter by Status or Result', ''],
        ['', '• Filter by Level (A, AA, AAA) to focus on compliance requirements', ''],
        ['', '• Filter by Result = FAIL to see all criteria needing remediation', ''],
        ['', '• Filter by Result = PASS to see completed criteria', ''],
        ['', '• Combine filters (e.g., Level AA + Result FAIL) for targeted analysis', ''],
        ['', '', '', ''],
        ['', '═══════════════════════════════════════════════════════════════════════', '', ''],
      ]

      const validationSheet = XLSX.utils.aoa_to_sheet(validationData)
      validationSheet['!cols'] = [{ wch: 3 }, { wch: 35 }, { wch: 50 }, { wch: 5 }]
      validationSheet['!rows'] = [
        { hpt: 10 },
        { hpt: 28 },
        { hpt: 18 },
        ...Array(validationData.length - 3).fill({ hpt: 20 })
      ]

      XLSX.utils.book_append_sheet(workbook, validationSheet, 'Data Validation')

      // ============================================
      // SHEET 5: QUICK REFERENCE
      // ============================================
      const quickRefData = [
        ['', '', '', ''],
        ['', 'WCAG 2.2 QUICK REFERENCE GUIDE', '', ''],
        ['', '', '', ''],
        ['', '═══════════════════════════════════════════════════════════════════════', '', ''],
        ['', '', '', ''],
        ['', 'CONFORMANCE LEVELS', '', ''],
        ['', '─────────────────────────────────────────────────────────────────', '', ''],
        ['', '', '', ''],
        ['', 'Level', 'Type', 'Description'],
        ['', 'A', 'Minimum', 'Essential - Basic accessibility that must be met'],
        ['', 'AA', 'Standard', 'Required - Legal compliance standard (most common target)'],
        ['', 'AAA', 'Enhanced', 'Gold Standard - Highest level of accessibility'],
        ['', '', '', ''],
        ['', '═══════════════════════════════════════════════════════════════════════', '', ''],
        ['', '', '', ''],
        ['', 'THE FOUR PRINCIPLES (POUR)', '', ''],
        ['', '─────────────────────────────────────────────────────────────────', '', ''],
        ['', '', '', ''],
        ['', 'Principle', 'Focus', 'Description'],
        ['', '1. Perceivable', 'Senses', 'Content must be presentable in ways users can perceive'],
        ['', '2. Operable', 'Interaction', 'UI components and navigation must be operable'],
        ['', '3. Understandable', 'Comprehension', 'Information and UI operation must be understandable'],
        ['', '4. Robust', 'Compatibility', 'Content must work with current and future technologies'],
        ['', '', '', ''],
        ['', '═══════════════════════════════════════════════════════════════════════', '', ''],
        ['', '', '', ''],
        ['', 'TESTING TOOLS', '', ''],
        ['', '─────────────────────────────────────────────────────────────────', '', ''],
        ['', '', '', ''],
        ['', 'Tool', 'Type', 'URL'],
        ['', 'Accessibility.build', 'AI-Powered Auditing', 'accessibility.build'],
        ['', 'WAVE', 'Browser Extension', 'wave.webaim.org'],
        ['', 'axe DevTools', 'Automated Testing', 'deque.com/axe'],
        ['', 'NVDA', 'Screen Reader', 'nvaccess.org'],
        ['', 'VoiceOver', 'Screen Reader (Mac)', 'Built into macOS'],
        ['', 'Colour Contrast Analyser', 'Contrast Checker', 'tpgi.com/color-contrast-checker'],
        ['', 'Lighthouse', 'Performance & A11y', 'Built into Chrome DevTools'],
        ['', '', '', ''],
        ['', '═══════════════════════════════════════════════════════════════════════', '', ''],
        ['', '', '', ''],
        ['', 'LEGAL STANDARDS & REGULATIONS', '', ''],
        ['', '─────────────────────────────────────────────────────────────────', '', ''],
        ['', '', '', ''],
        ['', 'Standard', 'Region', 'Typical Requirement'],
        ['', 'ADA Title III', 'United States', 'WCAG 2.1 AA'],
        ['', 'Section 508', 'US Federal', 'WCAG 2.0 AA'],
        ['', 'EN 301 549', 'European Union', 'WCAG 2.1 AA'],
        ['', 'AODA', 'Ontario, Canada', 'WCAG 2.0 AA'],
        ['', 'EAA', 'European Union (2025)', 'WCAG 2.1 AA'],
        ['', 'DDA', 'United Kingdom', 'WCAG 2.1 AA'],
        ['', '', '', ''],
        ['', '═══════════════════════════════════════════════════════════════════════', '', ''],
        ['', '', '', ''],
        ['', 'COMMON ISSUES & SOLUTIONS', '', ''],
        ['', '─────────────────────────────────────────────────────────────────', '', ''],
        ['', '', '', ''],
        ['', 'Issue', 'WCAG Criterion', 'Solution'],
        ['', 'Missing alt text', '1.1.1 Non-text Content', 'Add descriptive alt attributes to images'],
        ['', 'Low color contrast', '1.4.3 Contrast (Minimum)', 'Ensure 4.5:1 ratio for normal text'],
        ['', 'No keyboard access', '2.1.1 Keyboard', 'Make all functionality keyboard accessible'],
        ['', 'Missing form labels', '1.3.1 Info and Relationships', 'Associate labels with form controls'],
        ['', 'No skip links', '2.4.1 Bypass Blocks', 'Add skip navigation links'],
        ['', 'Auto-playing media', '1.4.2 Audio Control', 'Provide pause/stop controls'],
        ['', 'Missing page titles', '2.4.2 Page Titled', 'Add descriptive, unique page titles'],
        ['', 'Focus not visible', '2.4.7 Focus Visible', 'Ensure visible focus indicators'],
        ['', '', '', ''],
        ['', '═══════════════════════════════════════════════════════════════════════', '', ''],
      ]

      const quickRefSheet = XLSX.utils.aoa_to_sheet(quickRefData)
      quickRefSheet['!cols'] = [{ wch: 3 }, { wch: 28 }, { wch: 25 }, { wch: 55 }]
      quickRefSheet['!rows'] = [
        { hpt: 10 },
        { hpt: 30 },
        { hpt: 10 },
        ...Array(quickRefData.length - 3).fill({ hpt: 20 })
      ]

      XLSX.utils.book_append_sheet(workbook, quickRefSheet, 'Quick Reference')

      // ============================================
      // SHEET 5: CRITERIA BY PRINCIPLE
      // ============================================
      const principles = ['1. Perceivable', '2. Operable', '3. Understandable', '4. Robust']
      const principleData: (string | number)[][] = [
        ['', '', '', '', ''],
        ['', 'CRITERIA ORGANIZED BY PRINCIPLE', '', '', ''],
        ['', '', '', '', ''],
        ['', '═══════════════════════════════════════════════════════════════════════════════', '', '', ''],
      ]

      principles.forEach(principle => {
        const criteriForPrinciple = selectedCriteria.filter(c => c.principle === principle)
        principleData.push(['', '', '', '', ''])
        principleData.push(['', principle.toUpperCase(), '', '', ''])
        principleData.push(['', '─────────────────────────────────────────────────────────────────────', '', '', ''])
        principleData.push(['', 'SC #', 'Criterion', 'Level', 'Status', 'Result'])
        
        criteriForPrinciple.forEach(c => {
          principleData.push(['', c.number, c.title, c.level, 'NOT STARTED', 'PENDING'])
        })
        
        principleData.push(['', '', '', '', ''])
        principleData.push(['', `Total: ${criteriForPrinciple.length} criteria`, '', '', ''])
        principleData.push(['', '═══════════════════════════════════════════════════════════════════════════════', '', '', ''])
      })

      const principleSheet = XLSX.utils.aoa_to_sheet(principleData)
      principleSheet['!cols'] = [{ wch: 3 }, { wch: 12 }, { wch: 50 }, { wch: 10 }, { wch: 12 }]

      XLSX.utils.book_append_sheet(workbook, principleSheet, 'By Principle')

      // Generate filename and save
      const projectSuffix = exportOptions.projectName ? `-${exportOptions.projectName.replace(/[^a-zA-Z0-9]/g, '-')}` : ''
      const fileName = `WCAG-2.2-Audit-Template${projectSuffix}-${new Date().toISOString().split('T')[0]}.xlsx`
      
      if (exportOptions.format === 'csv') {
        XLSX.writeFile(workbook, fileName.replace('.xlsx', '.csv'), { bookType: 'csv' })
      } else {
        XLSX.writeFile(workbook, fileName)
      }
    } catch (error) {
      console.error('Error generating Excel:', error)
      alert('Error generating Excel file. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const downloadQuickStart = () => {
    setIsDownloading(true)
    try {
      const aaCriteria = wcagCriteria.filter(c => c.level === 'A' || c.level === 'AA')
      const workbook = createStyledWorkbook()

      // Create professional AA-only checklist with Excel-native format
      const headers = ['#', 'SC #', 'Success Criterion', 'Level', 'Status', 'Result', 'Notes', 'Assigned To', 'Test Date']
      const rows = aaCriteria.map((criterion, index) => [
        index + 1,
        criterion.number,
        criterion.title,
        criterion.level,
        'NOT STARTED',  // Status: NOT STARTED, IN PROGRESS, COMPLETED
        'PENDING',      // Result: PENDING, PASS, FAIL, N/A (filterable)
        '',
        '',
        ''
      ])

      const wsData = [headers, ...rows]
      const worksheet = XLSX.utils.aoa_to_sheet(wsData)
      
      worksheet['!cols'] = [
        { wch: 5 },
        { wch: 10 },
        { wch: 50 },
        { wch: 8 },
        { wch: 15 },  // Status
        { wch: 12 },  // Result (filterable)
        { wch: 45 },
        { wch: 18 },
        { wch: 14 }   // Test Date
      ]
      
      worksheet['!rows'] = [
        { hpt: 32 },
        ...rows.map(() => ({ hpt: 28 }))
      ]

      // Add autofilter
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
      worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(range) }
      worksheet['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft', state: 'frozen' }

      XLSX.utils.book_append_sheet(workbook, worksheet, 'AA Compliance Checklist')

      // Add summary sheet
      const summaryData = [
        ['', ''],
        ['WCAG 2.1/2.2 AA COMPLIANCE CHECKLIST', ''],
        ['Quick Start Template', ''],
        ['', ''],
        ['═════════════════════════════════════════', ''],
        ['', ''],
        ['This template includes:', ''],
        ['─────────────────────────────────────────', ''],
        ['Level A Criteria:', aaCriteria.filter(c => c.level === 'A').length],
        ['Level AA Criteria:', aaCriteria.filter(c => c.level === 'AA').length],
        ['Total Criteria:', aaCriteria.length],
        ['', ''],
        ['═════════════════════════════════════════', ''],
        ['', ''],
        ['WHY LEVEL AA?', ''],
        ['─────────────────────────────────────────', ''],
        ['• Required for ADA compliance (US)', ''],
        ['• Required for Section 508 (US Federal)', ''],
        ['• Required for EN 301 549 (EU)', ''],
        ['• Industry standard for web accessibility', ''],
        ['• Balances accessibility with practicality', ''],
        ['', ''],
        ['═════════════════════════════════════════', ''],
        ['', ''],
        ['Generated by Accessibility.build', ''],
        ['Date:', new Date().toLocaleDateString()],
      ]

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
      summarySheet['!cols'] = [{ wch: 45 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'About This Template')

      XLSX.writeFile(workbook, `WCAG-AA-Quick-Checklist-${new Date().toISOString().split('T')[0]}.xlsx`)
    } catch (error) {
      console.error('Error generating quick start Excel:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-[#0a0f1a] dark:via-[#0d1321] dark:to-[#0a1a15]">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
      
      <div className="relative container-wide py-16">
        <div className="max-w-5xl mx-auto">
          {/* Back Link */}
          <div className="mb-8">
            <Link 
              href="/checklists/wcag-2-2"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Interactive Checklist
            </Link>
          </div>

          {/* Main Card */}
          <Card className="bg-white dark:bg-slate-800/90 backdrop-blur-xl border border-emerald-200 dark:border-emerald-700/50 shadow-2xl overflow-hidden">
            <CardHeader className="text-center pb-6 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 border-b border-emerald-100 dark:border-emerald-800/50">
              <div className="flex justify-center mb-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                  <div className="relative p-5 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-xl">
                    <FileSpreadsheet className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              <CardTitle className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Professional Excel Templates
                </span>
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Download professionally formatted Excel templates with all {stats.total} WCAG 2.2 success criteria.
                Clean layouts, organized sheets, and ready for your audit workflow.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8 space-y-8">
              {/* What's Included Banner */}
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50">
                <h3 className="text-sm font-bold text-blue-800 dark:text-blue-200 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Professional Excel Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Auto-filters', icon: Filter, color: 'text-blue-600 dark:text-blue-400' },
                    { name: 'Frozen headers', icon: Lock, color: 'text-indigo-600 dark:text-indigo-400' },
                    { name: 'Proper column widths', icon: Columns, color: 'text-purple-600 dark:text-purple-400' },
                    { name: 'Row heights for readability', icon: AlignJustify, color: 'text-emerald-600 dark:text-emerald-400' },
                    { name: '5 organized sheets', icon: Layers, color: 'text-amber-600 dark:text-amber-400' },
                    { name: 'Progress tracking', icon: TrendingUp, color: 'text-pink-600 dark:text-pink-400' },
                    { name: 'Quick reference guide', icon: BookOpen, color: 'text-teal-600 dark:text-teal-400' },
                    { name: 'By-principle view', icon: Target, color: 'text-rose-600 dark:text-rose-400' }
                  ].map((feature, i) => {
                    const IconComponent = feature.icon
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-blue-800/50 hover:border-blue-200 dark:hover:border-blue-700 transition-colors group">
                        <div className={`p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 group-hover:scale-110 transition-transform duration-200 ${feature.color}`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{feature.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick Download Buttons */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700/50">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Quick Start (AA)</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Level A + AA only — perfect for legal compliance audits</p>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-3">
                        ✓ 2 sheets • ✓ {wcagCriteria.filter(c => c.level === 'A' || c.level === 'AA').length} criteria • ✓ Filters & freeze
                      </div>
                      <Button 
                        onClick={downloadQuickStart}
                        disabled={isDownloading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-lg"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download AA Template
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl border border-purple-200 dark:border-purple-700/50">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Complete Template</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">All {stats.total} criteria including AAA — comprehensive audit</p>
                      <div className="text-xs text-purple-600 dark:text-purple-400 mb-3">
                        ✓ 5 sheets • ✓ All levels • ✓ Reference guides
                      </div>
                      <Button 
                        onClick={downloadExcelTemplate}
                        disabled={isDownloading}
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold shadow-lg"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Full Template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sheets Preview */}
              <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600/50">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Included Sheets (Full Template)
                </h3>
                <div className="grid md:grid-cols-5 gap-3">
                  {[
                    { name: 'WCAG 2.2 Checklist', desc: 'Main audit worksheet', icon: ClipboardList, color: 'text-blue-600 dark:text-blue-400' },
                    { name: 'Audit Summary', desc: 'Project info & stats', icon: BarChart3, color: 'text-emerald-600 dark:text-emerald-400' },
                    { name: 'Progress Tracking', desc: 'Track over time', icon: TrendingUp, color: 'text-purple-600 dark:text-purple-400' },
                    { name: 'Quick Reference', desc: 'Tools & standards', icon: BookOpen, color: 'text-amber-600 dark:text-amber-400' },
                    { name: 'By Principle', desc: 'Organized by POUR', icon: Target, color: 'text-indigo-600 dark:text-indigo-400' }
                  ].map((sheet, i) => {
                    const IconComponent = sheet.icon
                    return (
                      <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-200 hover:shadow-md text-center group">
                        <div className="flex justify-center mb-3">
                          <div className={`p-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 group-hover:scale-110 transition-transform duration-200 ${sheet.color}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                        </div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white mb-1">{sheet.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{sheet.desc}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Or customize your export
                  </span>
                </div>
              </div>

              {/* Custom Export Options */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Custom Export Options</h3>
                </div>

                {/* Project Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                      <Building2 className="w-4 h-4 inline mr-2" />
                      Project Name (Optional)
                    </label>
                    <Input
                      placeholder="Enter project name..."
                      value={exportOptions.projectName}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, projectName: e.target.value }))}
                      className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                      <Users className="w-4 h-4 inline mr-2" />
                      Auditor Name (Optional)
                    </label>
                    <Input
                      placeholder="Enter auditor name..."
                      value={exportOptions.auditorName}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, auditorName: e.target.value }))}
                      className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                    />
                  </div>
                </div>

                {/* Level Selection */}
                <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600/50">
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Include Conformance Levels
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-emerald-200 dark:border-emerald-700/50 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors">
                      <Checkbox
                        checked={exportOptions.includeLevelA}
                        onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeLevelA: checked === true }))}
                        className="border-emerald-400 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <div className="ml-3">
                        <Badge className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-600">Level A</Badge>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stats.byLevel.A} criteria • Essential</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-blue-700/50 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                      <Checkbox
                        checked={exportOptions.includeLevelAA}
                        onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeLevelAA: checked === true }))}
                        className="border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                      />
                      <div className="ml-3">
                        <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600">Level AA</Badge>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stats.byLevel.AA} criteria • Required</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-purple-200 dark:border-purple-700/50 cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
                      <Checkbox
                        checked={exportOptions.includeLevelAAA}
                        onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeLevelAAA: checked === true }))}
                        className="border-purple-400 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <div className="ml-3">
                        <Badge className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-600">Level AAA</Badge>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stats.byLevel.AAA} criteria • Enhanced</div>
                      </div>
                    </label>
                  </div>
                  <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                    <strong>{selectedCount}</strong> criteria selected for export
                  </div>
                </div>

                {/* Additional Options */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600/50">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Include Sheets</h4>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <Checkbox
                          checked={exportOptions.includeNotes}
                          onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeNotes: checked === true }))}
                        />
                        <span className="ml-3 text-sm text-slate-700 dark:text-slate-200">Notes & Findings column</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <Checkbox
                          checked={exportOptions.includeSummary}
                          onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeSummary: checked === true }))}
                        />
                        <span className="ml-3 text-sm text-slate-700 dark:text-slate-200">Audit Summary sheet</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <Checkbox
                          checked={exportOptions.includeProgressSheet}
                          onCheckedChange={(checked) => setExportOptions(prev => ({ ...prev, includeProgressSheet: checked === true }))}
                        />
                        <span className="ml-3 text-sm text-slate-700 dark:text-slate-200">Progress Tracking sheet</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600/50">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Export Format</h4>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="format"
                          checked={exportOptions.format === 'xlsx'}
                          onChange={() => setExportOptions(prev => ({ ...prev, format: 'xlsx' }))}
                          className="w-4 h-4 text-blue-600 border-slate-300"
                        />
                        <span className="ml-3 text-sm text-slate-700 dark:text-slate-200">
                          <FileSpreadsheet className="w-4 h-4 inline mr-1" />
                          Excel (.xlsx) — Full features & multiple sheets
                        </span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="format"
                          checked={exportOptions.format === 'csv'}
                          onChange={() => setExportOptions(prev => ({ ...prev, format: 'csv' }))}
                          className="w-4 h-4 text-blue-600 border-slate-300"
                        />
                        <span className="ml-3 text-sm text-slate-700 dark:text-slate-200">
                          <FileText className="w-4 h-4 inline mr-1" />
                          CSV — Simple format (main sheet only)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Custom Download Button */}
                <Button
                  onClick={downloadExcelTemplate}
                  disabled={isDownloading || selectedCount === 0}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-xl h-14 text-lg"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Generating Professional Template...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Custom Template ({selectedCount} criteria)
                    </>
                  )}
                </Button>
              </div>

              {/* Level Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-5 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700/50">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.byLevel.A}</div>
                  <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Level A</div>
                  <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">Essential</div>
                </div>
                <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.byLevel.AA}</div>
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Level AA</div>
                  <div className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">Required</div>
                </div>
                <div className="text-center p-5 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200 dark:border-purple-700/50">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.byLevel.AAA}</div>
                  <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Level AAA</div>
                  <div className="text-xs text-purple-600/80 dark:text-purple-400/80 mt-1">Enhanced</div>
                </div>
              </div>

              {/* Tip Box */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-700/50">
                <p className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-blue-900 dark:text-blue-100">Pro Tip:</strong> For real-time progress tracking and interactive features, use our{" "}
                    <Link href="/checklists/wcag-2-2" className="underline font-semibold hover:text-blue-600 dark:hover:text-blue-300">
                      Interactive WCAG 2.2 Checklist
                    </Link>{" "}
                    and export your progress when ready.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

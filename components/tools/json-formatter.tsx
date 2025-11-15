"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  FileJson, 
  Copy, 
  Download, 
  Check, 
  AlertCircle, 
  Minimize2, 
  Maximize2,
  GitBranch,
  FileText,
  Braces,
  Search,
  Plus,
  X,
  RefreshCw,
  GitCompare,
  Settings,
  Code2,
  Filter,
  SortAsc,
  Merge,
  Split,
  Eye,
  EyeOff,
  Clock,
  BarChart3,
  Zap,
  ArrowLeftRight
} from "lucide-react"

interface JsonError {
  message: string
  line?: number
  column?: number
}

interface JsonStats {
  size: number
  keys: number
  arrays: number
  depth: number
  objects: number
  primitives: number
  parseTime: number
}

interface JsonFile {
  id: string
  name: string
  content: string
  parsed?: any
  error?: JsonError
  stats?: JsonStats
}

interface DiffResult {
  added: string[]
  removed: string[]
  modified: string[]
  same: string[]
}

export default function JsonFormatter() {
  const [files, setFiles] = useState<JsonFile[]>([
    { id: '1', name: 'JSON 1', content: '' },
    { id: '2', name: 'JSON 2', content: '' }
  ])
  const [activeFileId, setActiveFileId] = useState('1')
  const [outputType, setOutputType] = useState('formatted')
  const [searchTerm, setSearchTerm] = useState('')
  const [settings, setSettings] = useState({
    indentation: '2',
    sortKeys: false,
    showLineNumbers: true,
    livePreview: true,
    highlightDiffs: true
  })
  const [diff, setDiff] = useState<DiffResult | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const activeFile = files.find(f => f.id === activeFileId) || files[0]

  // Process JSON with timing
  const processJson = useCallback((content: string): { parsed?: any, error?: JsonError, stats?: JsonStats } => {
    if (!content.trim()) return {}

    const startTime = performance.now()
    try {
      const parsed = JSON.parse(content)
      const endTime = performance.now()

      const stats = analyzeJson(content, parsed, endTime - startTime)
      return { parsed, stats }
    } catch (err) {
      const endTime = performance.now()
      const errorMessage = err instanceof Error ? err.message : "Invalid JSON"
      const lineMatch = errorMessage.match(/line (\d+)/i)
      const columnMatch = errorMessage.match(/column (\d+)/i)
      
      return {
        error: {
          message: errorMessage,
          line: lineMatch ? parseInt(lineMatch[1]) : undefined,
          column: columnMatch ? parseInt(columnMatch[1]) : undefined
        },
        stats: {
          size: new Blob([content]).size,
          parseTime: endTime - startTime,
          keys: 0,
          arrays: 0,
          depth: 0,
          objects: 0,
          primitives: 0
        }
      }
    }
  }, [])

  const analyzeJson = useCallback((jsonString: string, parsed: any, parseTime: number): JsonStats => {
    const countItems = (obj: any): { keys: number, arrays: number, objects: number, primitives: number } => {
      if (typeof obj !== 'object' || obj === null) {
        return { keys: 0, arrays: 0, objects: 0, primitives: 1 }
      }
      
      if (Array.isArray(obj)) {
        const childCounts = obj.reduce((acc, item) => {
          const counts = countItems(item)
          return {
            keys: acc.keys + counts.keys,
            arrays: acc.arrays + counts.arrays,
            objects: acc.objects + counts.objects,
            primitives: acc.primitives + counts.primitives
          }
        }, { keys: 0, arrays: 0, objects: 0, primitives: 0 })
        return { ...childCounts, arrays: childCounts.arrays + 1 }
      }
      
      const keys = Object.keys(obj)
      const childCounts = keys.reduce((acc, key) => {
        const counts = countItems(obj[key])
        return {
          keys: acc.keys + counts.keys,
          arrays: acc.arrays + counts.arrays,
          objects: acc.objects + counts.objects,
          primitives: acc.primitives + counts.primitives
        }
      }, { keys: 0, arrays: 0, objects: 0, primitives: 0 })
      
      return { 
        keys: childCounts.keys + keys.length, 
        arrays: childCounts.arrays,
        objects: childCounts.objects + 1,
        primitives: childCounts.primitives
      }
    }

    const getDepth = (obj: any): number => {
      if (typeof obj !== 'object' || obj === null) return 0
      if (Array.isArray(obj)) {
        return obj.length === 0 ? 1 : 1 + Math.max(...obj.map(getDepth))
      }
      const values = Object.values(obj)
      return values.length === 0 ? 1 : 1 + Math.max(...values.map(getDepth))
    }

    const counts = countItems(parsed)
    return {
      size: new Blob([jsonString]).size,
      parseTime,
      depth: getDepth(parsed),
      ...counts
    }
  }, [])

  // Generate tree view
  const generateTreeView = useCallback((obj: any, indent = 0, path = ''): string => {
    const spaces = "  ".repeat(indent)
    
    if (obj === null) return "null"
    if (typeof obj === "boolean") return obj.toString()
    if (typeof obj === "number") return obj.toString()
    if (typeof obj === "string") return `"${obj}"`
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return "[]"
      
      let result = "[\n"
      obj.forEach((item, index) => {
        const currentPath = path ? `${path}[${index}]` : `[${index}]`
        const highlighted = searchTerm && currentPath.includes(searchTerm) ? "🔍 " : ""
        result += `${spaces}  ├─ ${highlighted}[${index}] ${generateTreeView(item, indent + 1, currentPath)}\n`
      })
      result += `${spaces}]`
      return result
    }
    
    if (typeof obj === "object") {
      const keys = settings.sortKeys ? Object.keys(obj).sort() : Object.keys(obj)
      if (keys.length === 0) return "{}"
      
      let result = "{\n"
      keys.forEach((key, index) => {
        const isLast = index === keys.length - 1
        const prefix = isLast ? "└─" : "├─"
        const currentPath = path ? `${path}.${key}` : key
        const highlighted = searchTerm && (key.includes(searchTerm) || currentPath.includes(searchTerm)) ? "🔍 " : ""
        result += `${spaces}  ${prefix} ${highlighted}${key}: ${generateTreeView(obj[key], indent + 1, currentPath)}\n`
      })
      result += `${spaces}}`
      return result
    }
    
    return String(obj)
  }, [searchTerm, settings.sortKeys])

  // Compare JSONs for diff
  const compareJsons = useCallback((json1: any, json2: any, path = ''): DiffResult => {
    const result: DiffResult = { added: [], removed: [], modified: [], same: [] }
    
    const getAllPaths = (obj: any, currentPath = ''): string[] => {
      if (typeof obj !== 'object' || obj === null) return [currentPath]
      
      const paths: string[] = []
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          const itemPath = currentPath ? `${currentPath}[${index}]` : `[${index}]`
          paths.push(...getAllPaths(item, itemPath))
        })
      } else {
        Object.keys(obj).forEach(key => {
          const keyPath = currentPath ? `${currentPath}.${key}` : key
          paths.push(...getAllPaths(obj[key], keyPath))
        })
      }
      return paths
    }

    const paths1 = getAllPaths(json1)
    const paths2 = getAllPaths(json2)
    const allPaths = new Set([...paths1, ...paths2])

    allPaths.forEach(path => {
      const inFirst = paths1.includes(path)
      const inSecond = paths2.includes(path)
      
      if (inFirst && inSecond) {
        // Compare values at this path
        const val1 = getValueAtPath(json1, path)
        const val2 = getValueAtPath(json2, path)
        if (JSON.stringify(val1) === JSON.stringify(val2)) {
          result.same.push(path)
        } else {
          result.modified.push(path)
        }
      } else if (inFirst && !inSecond) {
        result.removed.push(path)
      } else if (!inFirst && inSecond) {
        result.added.push(path)
      }
    })

    return result
  }, [])

  const getValueAtPath = (obj: any, path: string): any => {
    return path.split(/[.\[\]]/).filter(Boolean).reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined
    }, obj)
  }

  // Update file content
  const updateFile = useCallback((id: string, content: string) => {
    setFiles(prev => prev.map(file => {
      if (file.id === id) {
        const result = processJson(content)
        return { ...file, content, ...result }
      }
      return file
    }))
  }, [processJson])

  // Live preview effect
  useEffect(() => {
    if (settings.livePreview && activeFile.content) {
      const timeoutId = setTimeout(() => {
        updateFile(activeFile.id, activeFile.content)
      }, 300)
      return () => clearTimeout(timeoutId)
    }
  }, [activeFile.content, settings.livePreview, updateFile, activeFile.id])

  // Calculate diff when files change
  useEffect(() => {
    const file1 = files.find(f => f.id === '1')
    const file2 = files.find(f => f.id === '2')
    
    if (file1?.parsed && file2?.parsed) {
      setDiff(compareJsons(file1.parsed, file2.parsed))
    } else {
      setDiff(null)
    }
  }, [files, compareJsons])

  const addFile = () => {
    const newId = (Math.max(...files.map(f => parseInt(f.id))) + 1).toString()
    setFiles(prev => [...prev, { id: newId, name: `JSON ${newId}`, content: '' }])
  }

  const removeFile = (id: string) => {
    if (files.length > 2) {
      setFiles(prev => prev.filter(f => f.id !== id))
      if (activeFileId === id) {
        setActiveFileId(files.find(f => f.id !== id)?.id || '1')
      }
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatOutput = useCallback((file: JsonFile) => {
    if (!file.parsed) return ''
    
    const spaces = parseInt(settings.indentation)
    let formatted = JSON.stringify(file.parsed, null, spaces)
    
    if (settings.sortKeys) {
      const sorted = JSON.stringify(file.parsed, Object.keys(file.parsed).sort(), spaces)
      formatted = sorted
    }
    
    return formatted
  }, [settings])

  const getOutputContent = () => {
    if (!activeFile.parsed) return ''
    
    switch (outputType) {
      case 'formatted':
        return formatOutput(activeFile)
      case 'minified':
        return JSON.stringify(activeFile.parsed)
      case 'tree':
        return generateTreeView(activeFile.parsed)
      case 'paths':
        return generatePaths(activeFile.parsed).join('\n')
      case 'diff':
        return diff ? generateDiffView(diff) : 'Select two valid JSON files to compare'
      default:
        return formatOutput(activeFile)
    }
  }

  const generatePaths = (obj: any, currentPath = ''): string[] => {
    const paths: string[] = []
    
    if (typeof obj !== 'object' || obj === null) {
      return [currentPath]
    }
    
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const path = currentPath ? `${currentPath}[${index}]` : `[${index}]`
        paths.push(...generatePaths(item, path))
      })
    } else {
      Object.keys(obj).forEach(key => {
        const path = currentPath ? `${currentPath}.${key}` : key
        paths.push(...generatePaths(obj[key], path))
      })
    }
    
    return paths
  }

  const generateDiffView = (diff: DiffResult): string => {
    let result = "=== JSON COMPARISON RESULTS ===\n\n"
    
    if (diff.added.length > 0) {
      result += "➕ ADDED:\n"
      diff.added.forEach(path => result += `  + ${path}\n`)
      result += "\n"
    }
    
    if (diff.removed.length > 0) {
      result += "➖ REMOVED:\n"
      diff.removed.forEach(path => result += `  - ${path}\n`)
      result += "\n"
    }
    
    if (diff.modified.length > 0) {
      result += "🔄 MODIFIED:\n"
      diff.modified.forEach(path => result += `  ~ ${path}\n`)
      result += "\n"
    }
    
    result += `📊 SUMMARY:\n`
    result += `  Added: ${diff.added.length}\n`
    result += `  Removed: ${diff.removed.length}\n`
    result += `  Modified: ${diff.modified.length}\n`
    result += `  Unchanged: ${diff.same.length}\n`
    
    return result
  }

  const mergeJsons = () => {
    const validFiles = files.filter(f => f.parsed)
    if (validFiles.length < 2) return
    
    const merged = validFiles.reduce((acc, file) => {
      return { ...acc, ...file.parsed }
    }, {})
    
    const newId = 'merged'
    const mergedContent = JSON.stringify(merged, null, 2)
    setFiles(prev => [...prev, { id: newId, name: 'Merged', content: mergedContent }])
  }

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              <CardTitle>Advanced JSON Workspace</CardTitle>
              <Badge variant="secondary">{files.length} files</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={addFile} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add File
              </Button>
              <Button onClick={mergeJsons} size="sm" variant="outline" disabled={files.filter(f => f.parsed).length < 2}>
                <Merge className="h-4 w-4 mr-1" />
                Merge
              </Button>
            </div>
          </div>
          <CardDescription>
            Professional JSON editor with comparison, validation, and advanced analysis tools
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
        {/* Left Panel - Input */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Input Files</CardTitle>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search in JSON..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-40 h-8"
                />
              </div>
            </div>
            
            {/* File Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {files.map(file => (
                <div key={file.id} className="flex items-center">
                  <Button
                    variant={activeFileId === file.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveFileId(file.id)}
                    className="min-w-0 max-w-32"
                  >
                    <span className="truncate">{file.name}</span>
                    {file.error && <AlertCircle className="h-3 w-3 ml-1 text-red-500" />}
                    {file.parsed && <Check className="h-3 w-3 ml-1 text-green-500" />}
                  </Button>
                  {files.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="w-6 h-6 p-0 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* File Name Input */}
            <div className="mb-3">
              <Input
                value={activeFile.name}
                onChange={(e) => setFiles(prev => prev.map(f => 
                  f.id === activeFileId ? { ...f, name: e.target.value } : f
                ))}
                className="h-8"
                placeholder="File name..."
              />
            </div>
            
            {/* JSON Input */}
            <div className="flex-1">
              <Textarea
                placeholder="Paste your JSON here..."
                value={activeFile.content}
                onChange={(e) => updateFile(activeFileId, e.target.value)}
                className="h-full min-h-[400px] font-mono text-sm resize-none"
              />
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                size="sm"
                onClick={() => updateFile(activeFileId, activeFile.content)}
                disabled={!activeFile.content}
              >
                <Braces className="h-4 w-4 mr-1" />
                Process
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFile(activeFileId, '')}
                disabled={!activeFile.content}
              >
                Clear
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFile(activeFileId, '{\n  "example": "data",\n  "array": [1, 2, 3],\n  "nested": {\n    "key": "value"\n  }\n}')}
              >
                Load Example
              </Button>
            </div>
            
            {/* Error Display */}
            {activeFile.error && (
              <Alert variant="destructive" className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong> {activeFile.error.message}
                  {activeFile.error.line && ` at line ${activeFile.error.line}`}
                  {activeFile.error.column && `, column ${activeFile.error.column}`}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Right Panel - Output */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Output & Analysis</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(getOutputContent(), outputType)}
                  disabled={!activeFile.parsed}
                >
                  {copied === outputType ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(getOutputContent(), `${activeFile.name}-${outputType}.${outputType === 'tree' || outputType === 'paths' || outputType === 'diff' ? 'txt' : 'json'}`)}
                  disabled={!activeFile.parsed}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Output Type Selector */}
            <Tabs value={outputType} onValueChange={setOutputType}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="formatted" className="flex items-center gap-1">
                  <Maximize2 className="h-3 w-3" />
                  Format
                </TabsTrigger>
                <TabsTrigger value="minified" className="flex items-center gap-1">
                  <Minimize2 className="h-3 w-3" />
                  Minify
                </TabsTrigger>
                <TabsTrigger value="tree" className="flex items-center gap-1">
                  <GitBranch className="h-3 w-3" />
                  Tree
                </TabsTrigger>
                <TabsTrigger value="paths" className="flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  Paths
                </TabsTrigger>
                                 <TabsTrigger value="diff" className="flex items-center gap-1">
                   <GitCompare className="h-3 w-3" />
                   Diff
                 </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Output Display */}
            <div className="flex-1">
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm font-mono h-full min-h-[400px] border">
                <code>{getOutputContent()}</code>
              </pre>
            </div>
            
            {/* Size Comparison */}
            {activeFile.parsed && outputType === 'minified' && (
              <div className="mt-3 text-sm text-muted-foreground text-center">
                Size reduction: {activeFile.stats ? Math.round(((activeFile.stats.size - getOutputContent().length) / activeFile.stats.size) * 100) : 0}% 
                ({activeFile.stats?.size || 0} → {getOutputContent().length} bytes)
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Statistics Panel */}
      {activeFile.stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analysis & Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{activeFile.stats.size}</div>
                <div className="text-sm text-muted-foreground">Bytes</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">{activeFile.stats.keys}</div>
                <div className="text-sm text-muted-foreground">Keys</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{activeFile.stats.arrays}</div>
                <div className="text-sm text-muted-foreground">Arrays</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{activeFile.stats.objects}</div>
                <div className="text-sm text-muted-foreground">Objects</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-red-600">{activeFile.stats.primitives}</div>
                <div className="text-sm text-muted-foreground">Primitives</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{activeFile.stats.depth}</div>
                <div className="text-sm text-muted-foreground">Depth</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-teal-600">{activeFile.stats.parseTime.toFixed(2)}ms</div>
                <div className="text-sm text-muted-foreground">Parse Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Workspace Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="indentation">Indentation</Label>
                <Select value={settings.indentation} onValueChange={(value) => setSettings(prev => ({ ...prev, indentation: value }))}>
                  <SelectTrigger id="indentation" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                    <SelectItem value="8">8 spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sort-keys">Sort Keys</Label>
                <Switch
                  id="sort-keys"
                  checked={settings.sortKeys}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, sortKeys: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="live-preview">Live Preview</Label>
                <Switch
                  id="live-preview"
                  checked={settings.livePreview}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, livePreview: checked }))}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="line-numbers">Line Numbers</Label>
                <Switch
                  id="line-numbers"
                  checked={settings.showLineNumbers}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showLineNumbers: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="highlight-diffs">Highlight Diffs</Label>
                <Switch
                  id="highlight-diffs"
                  checked={settings.highlightDiffs}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, highlightDiffs: checked }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diff Summary */}
      {diff && (
        <Card>
          <CardHeader>
                         <CardTitle className="flex items-center gap-2">
               <GitCompare className="h-5 w-5" />
               Comparison Summary
             </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-2xl font-bold text-green-600">{diff.added.length}</div>
                <div className="text-sm text-green-700 dark:text-green-300">Added</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-2xl font-bold text-red-600">{diff.removed.length}</div>
                <div className="text-sm text-red-700 dark:text-red-300">Removed</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="text-2xl font-bold text-yellow-600">{diff.modified.length}</div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">Modified</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600">{diff.same.length}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Unchanged</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
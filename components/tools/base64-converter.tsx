"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Copy, 
  RotateCcw, 
  ArrowUpDown,
  FileText,
  Lock,
  Unlock
} from 'lucide-react'

export default function Base64Converter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [inputType, setInputType] = useState<'text' | 'file'>('text')

  const handleConvert = () => {
    if (!input.trim()) {
      toast.error('Please enter some text to convert')
      return
    }

    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)))
        setOutput(encoded)
        toast.success('Text encoded to Base64')
      } else {
        const decoded = decodeURIComponent(escape(atob(input)))
        setOutput(decoded)
        toast.success('Base64 decoded to text')
      }
    } catch (error) {
      toast.error('Invalid input for Base64 conversion')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      const base64 = result.split(',')[1] // Remove data URL prefix
      setInput(base64)
      setMode('decode')
      toast.success('File loaded as Base64')
    }
    reader.readAsDataURL(file)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard')
    })
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    toast.success('All fields cleared')
  }

  const swapInputOutput = () => {
    if (output) {
      setInput(output)
      setOutput('')
      setMode(mode === 'encode' ? 'decode' : 'encode')
      toast.success('Input and output swapped')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Base64 Converter</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encode and decode text or files to/from Base64 format. Perfect for data transmission and storage.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {mode === 'encode' ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                    Base64 {mode === 'encode' ? 'Encoder' : 'Decoder'}
                  </CardTitle>
                  <CardDescription>
                    {mode === 'encode' ? 'Convert text to Base64 format' : 'Convert Base64 back to text'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={mode === 'encode' ? 'default' : 'secondary'}>
                    {mode === 'encode' ? 'Encoding' : 'Decoding'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}
                  >
                    <ArrowUpDown className="h-4 w-4 mr-1" />
                    Switch
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Input</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={inputType === 'text' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setInputType('text')}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Text
                      </Button>
                      <Button
                        variant={inputType === 'file' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setInputType('file')}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        File
                      </Button>
                    </div>
                  </div>

                  {inputType === 'text' ? (
                    <Textarea
                      placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Upload a file to convert to Base64</p>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button asChild>
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Choose File
                        </label>
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button onClick={handleConvert} className="flex-1">
                      {mode === 'encode' ? 'Encode' : 'Decode'}
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Output Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Output</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={swapInputOutput}
                        disabled={!output}
                      >
                        <ArrowUpDown className="h-4 w-4 mr-1" />
                        Swap
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(output)}
                        disabled={!output}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    placeholder={mode === 'encode' ? 'Base64 encoded result will appear here...' : 'Decoded text will appear here...'}
                    value={output}
                    readOnly
                    className="min-h-[200px] resize-none bg-gray-50"
                  />

                  {output && (
                    <div className="text-sm text-gray-600">
                      <p>Length: {output.length} characters</p>
                      {mode === 'encode' && (
                        <p>Size increase: {Math.round(((output.length - input.length) / input.length) * 100)}%</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Info Section */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-900">About Base64</h4>
                <p className="text-sm text-blue-800">
                  Base64 is a binary-to-text encoding scheme that represents binary data as ASCII text. 
                  It's commonly used for encoding data in email, web pages, and data URLs. 
                  The encoded data is about 33% larger than the original.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
 
 
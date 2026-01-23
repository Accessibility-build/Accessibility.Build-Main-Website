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
  Link,
  Unlock,
  Globe
} from 'lucide-react'

export default function URLEncoderDecoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const handleConvert = () => {
    if (!input.trim()) {
      toast.error('Please enter a URL to convert')
      return
    }

    try {
      if (mode === 'encode') {
        const encoded = encodeURIComponent(input)
        setOutput(encoded)
        toast.success('URL encoded successfully')
      } else {
        const decoded = decodeURIComponent(input)
        setOutput(decoded)
        toast.success('URL decoded successfully')
      }
    } catch (error) {
      toast.error('Invalid input for URL conversion')
    }
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

  const examples = [
    {
      title: 'Query Parameters',
      original: 'search?q=hello world&lang=en',
      encoded: 'search?q=hello%20world&lang=en'
    },
    {
      title: 'Special Characters',
      original: 'path/to/file with spaces & symbols!',
      encoded: 'path%2Fto%2Ffile%20with%20spaces%20%26%20symbols!'
    },
    {
      title: 'International Characters',
      original: 'café/résumé/naïve',
      encoded: 'caf%C3%A9%2Fr%C3%A9sum%C3%A9%2Fna%C3%AFve'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Globe className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">URL Encoder/Decoder</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encode and decode URLs for safe transmission. Perfect for handling special characters in URLs and query parameters.
            <span className="block mt-2 text-sm text-gray-500">by Alaikas</span>
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {mode === 'encode' ? <Link className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                    URL {mode === 'encode' ? 'Encoder' : 'Decoder'}
                  </CardTitle>
                  <CardDescription>
                    {mode === 'encode' ? 'Convert URLs to percent-encoded format' : 'Convert percent-encoded URLs back to readable format'}
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
                  <h3 className="text-lg font-semibold">Input</h3>
                  <Textarea
                    placeholder={mode === 'encode' ? 'Enter URL to encode...' : 'Enter encoded URL to decode...'}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <Button onClick={handleConvert} className="flex-1">
                      {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>

                {/* Output Section */}
                <div className="space-y-4">
                  <div className="flex flex-col xs2:!flex-row xs2:items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold">Output</h3>
                    <div className="flex items-center gap-2 w-full xs2:w-auto">
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
                    placeholder={mode === 'encode' ? 'Encoded URL will appear here...' : 'Decoded URL will appear here...'}
                    value={output}
                    readOnly
                    className="min-h-[200px] resize-none bg-gray-50"
                  />

                  {output && (
                    <div className="text-sm text-gray-600">
                      <p>Length: {output.length} characters</p>
                      {mode === 'encode' && input && (
                        <p>Size change: {output.length > input.length ? '+' : ''}{output.length - input.length} characters</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Examples</CardTitle>
              <CardDescription>
                Common URL encoding examples to help you understand the conversion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {examples.map((example, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{example.title}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Original:</p>
                        <code className="bg-gray-100 p-2 rounded block break-all">{example.original}</code>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Encoded:</p>
                        <code className="bg-gray-100 p-2 rounded block break-all">{example.encoded}</code>
                      </div>
                    </div>
                    <div className="flex flex-col xs2:!flex-row gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setInput(example.original)
                          setMode('encode')
                        }}
                      >
                        Try Original
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setInput(example.encoded)
                          setMode('decode')
                        }}
                      >
                        Try Encoded
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-900">About URL Encoding</h4>
                <p className="text-sm text-green-800 mb-2">
                  URL encoding (percent-encoding) converts characters into a format that can be transmitted over the Internet. 
                  Special characters are replaced with a percent sign (%) followed by two hexadecimal digits.
                </p>
                <p className="text-sm text-green-800">
                  This is essential for handling spaces, international characters, and reserved characters in URLs.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
 
 
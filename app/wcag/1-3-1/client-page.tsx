"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Volume2,
  VolumeX,
  Play,
  Pause,
  FileText,
  Eye,
  EyeOff,
  Info,
  Lightbulb,
  Code,
  TestTube,
  Download,
  Upload,
  Settings,
  Copy,
  ExternalLink,
  Clock,
  Headphones,
  Mic,
  Film,
  Users,
  PlayCircle,
  VideoIcon,
  AudioWaveform,
  ListOrdered,
  Hash,
  Table,
  FormInput,
  Layers,
  TreePine,
  Zap
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export default function WCAG131ClientPage() {
  const [showStructure, setShowStructure] = useState(true)
  const [selectedExample, setSelectedExample] = useState('headings')

  const analyzeHtmlStructure = (html: string) => {
    const issues = []
    const suggestions = []
    
    // Basic checks
    if (!html.includes('<h1')) issues.push('Missing main heading (h1)')
    if (html.includes('<h3') && !html.includes('<h2')) issues.push('Heading hierarchy skipped (h3 without h2)')
    if (!html.includes('alt=')) issues.push('Images might be missing alt text')
    if (html.includes('<div') && !html.includes('<main') && !html.includes('<section')) {
      suggestions.push('Consider using semantic elements instead of generic divs')
    }
    
    return { issues, suggestions }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-violet-950">
      <div className="container-wide py-12">
        {/* Back Navigation */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/checklists/wcag-2-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to WCAG Checklist
          </Link>
        </Button>

        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:!flex-row md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl">
                <Layers className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                    1.3.1 Info and Relationships
                  </h1>
                  <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
                    Level A
                  </Badge>
                </div>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Information, structure, and relationships conveyed through presentation can be programmatically determined
                </p>
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-violet-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">Principle</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">1. Perceivable</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-violet-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">Guideline</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">1.3 Adaptable</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">Since</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">WCAG 2.0</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Understanding Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-violet-600" />
              Understanding 1.3.1 Info and Relationships
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">What does this mean?</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                When content is structured using visual formatting (like headings, lists, or tables), that same 
                structure must be available to assistive technologies through proper markup. Screen readers and 
                other tools need to understand the relationships between different pieces of content to navigate 
                and interpret it correctly.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Key concepts covered:</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-violet-50 dark:bg-violet-950/20 rounded-lg">
                    <Hash className="h-5 w-5 text-violet-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-violet-800 dark:text-violet-200">Heading Structure</p>
                      <p className="text-sm text-violet-600 dark:text-violet-300">Logical hierarchy from h1 to h6</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <ListOrdered className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-purple-800 dark:text-purple-200">Lists and Groups</p>
                      <p className="text-sm text-purple-600 dark:text-purple-300">Proper ul, ol, dl elements</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Table className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-200">Table Structure</p>
                      <p className="text-sm text-blue-600 dark:text-blue-300">Headers, captions, and data relationships</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <FormInput className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Form Relationships</p>
                      <p className="text-sm text-green-600 dark:text-green-300">Labels, fieldsets, and form structure</p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Foundation for Accessibility</AlertTitle>
                <AlertDescription>
                  This success criterion is fundamental - many other accessibility features depend on proper 
                  semantic structure. Screen readers use this structure to navigate and understand content.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Structure Examples */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreePine className="h-6 w-6 text-violet-600" />
              Interactive Structure Examples
            </CardTitle>
            <CardDescription>
              Explore different types of semantic structure with live examples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Example Selector */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'headings', label: 'Heading Structure', icon: Hash },
                  { key: 'lists', label: 'Lists & Groups', icon: ListOrdered },
                  { key: 'tables', label: 'Table Structure', icon: Table },
                  { key: 'forms', label: 'Form Relationships', icon: FormInput }
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={selectedExample === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedExample(key)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>

              {/* Heading Structure Example */}
              {selectedExample === 'headings' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Good Example */}
                  <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      ✅ Good Heading Structure
                    </h4>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border space-y-2">
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Main Page Title</h1>
                      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Section Heading</h2>
                      <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">Subsection</h3>
                      <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">Another Subsection</h3>
                      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Another Section</h2>
                      <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">Subsection</h3>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-3"
                      onClick={() => {
                        const text = "Screen reader navigation: Main Page Title, heading level 1. Section Heading, heading level 2. Subsection, heading level 3. Another Subsection, heading level 3. Another Section, heading level 2. Subsection, heading level 3.";
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          const utterance = new SpeechSynthesisUtterance(text);
                          utterance.rate = 0.9;
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Hear Screen Reader
                    </Button>
                  </div>

                  {/* Bad Example */}
                  <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      ❌ Poor Heading Structure
                    </h4>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border space-y-2">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">Main Page Title</div>
                      <div className="text-xl font-semibold text-slate-700 dark:text-slate-300">Section Heading</div>
                      <div className="text-lg font-medium text-slate-600 dark:text-slate-400">Subsection</div>
                      <h5 className="text-md font-medium text-slate-600 dark:text-slate-400">Skipped to H5</h5>
                      <div className="text-xl font-semibold text-slate-700 dark:text-slate-300">Another Section</div>
                      <div className="text-lg font-medium text-slate-600 dark:text-slate-400">Subsection</div>
                    </div>
                    <div className="mt-3 p-3 bg-red-100 dark:bg-red-950/30 rounded border border-red-300 dark:border-red-600">
                      <p className="text-sm text-red-700 dark:text-red-300 font-medium">❌ Problems:</p>
                      <ul className="text-sm text-red-600 dark:text-red-400 mt-1 space-y-1">
                        <li>• Uses divs instead of heading elements</li>
                        <li>• Skips heading levels (h5 after h3)</li>
                        <li>• Screen readers can't navigate by headings</li>
                        <li>• No semantic structure for assistive technology</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Lists Example */}
              {selectedExample === 'lists' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      ✅ Proper List Structure
                    </h4>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">Navigation Menu</h5>
                        <ul className="space-y-1">
                          <li><a href="#" className="text-blue-600 hover:underline">Home</a></li>
                          <li><a href="#" className="text-blue-600 hover:underline">About</a></li>
                          <li><a href="#" className="text-blue-600 hover:underline">Services</a></li>
                          <li><a href="#" className="text-blue-600 hover:underline">Contact</a></li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Steps to Follow</h5>
                        <ol className="space-y-1">
                          <li>1. Create account</li>
                          <li>2. Verify email</li>
                          <li>3. Complete profile</li>
                          <li>4. Start using the service</li>
                        </ol>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-3"
                      onClick={() => {
                        const text = "Screen reader announces: Navigation Menu, list with 4 items. Link Home, link About, link Services, link Contact. Steps to Follow, ordered list with 4 items. 1. Create account, 2. Verify email, 3. Complete profile, 4. Start using the service.";
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          const utterance = new SpeechSynthesisUtterance(text);
                          utterance.rate = 0.9;
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Hear Screen Reader
                    </Button>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      ❌ Poor List Structure
                    </h4>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">Navigation Menu</h5>
                        <div className="space-y-1">
                          <div><a href="#" className="text-blue-600 hover:underline">Home</a></div>
                          <div><a href="#" className="text-blue-600 hover:underline">About</a></div>
                          <div><a href="#" className="text-blue-600 hover:underline">Services</a></div>
                          <div><a href="#" className="text-blue-600 hover:underline">Contact</a></div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Steps to Follow</h5>
                        <div className="space-y-1">
                          <div>1. Create account</div>
                          <div>2. Verify email</div>
                          <div>3. Complete profile</div>
                          <div>4. Start using the service</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-red-100 dark:bg-red-950/30 rounded border border-red-300 dark:border-red-600">
                      <p className="text-sm text-red-700 dark:text-red-300 font-medium">❌ Problems:</p>
                      <ul className="text-sm text-red-600 dark:text-red-400 mt-1 space-y-1">
                        <li>• Uses divs instead of list elements</li>
                        <li>• Screen readers can't identify lists</li>
                        <li>• No way to skip through list items</li>
                        <li>• Missing semantic relationships</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Table Example */}
              {selectedExample === 'tables' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      ✅ Proper Table Structure
                    </h4>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                      <table className="w-full border-collapse">
                        <caption className="text-sm font-medium mb-2">Monthly Sales Report</caption>
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 font-medium">Month</th>
                            <th className="text-left p-2 font-medium">Revenue</th>
                            <th className="text-left p-2 font-medium">Units Sold</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2">January</td>
                            <td className="p-2">$15,000</td>
                            <td className="p-2">150</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">February</td>
                            <td className="p-2">$18,000</td>
                            <td className="p-2">180</td>
                          </tr>
                          <tr>
                            <td className="p-2">March</td>
                            <td className="p-2">$22,000</td>
                            <td className="p-2">220</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-3"
                      onClick={() => {
                        const text = "Screen reader announces: Monthly Sales Report, table with 3 columns and 4 rows. Column headers: Month, Revenue, Units Sold. Row 1: January, $15,000, 150. Row 2: February, $18,000, 180. Row 3: March, $22,000, 220.";
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          const utterance = new SpeechSynthesisUtterance(text);
                          utterance.rate = 0.9;
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Hear Screen Reader
                    </Button>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      ❌ Poor Table Structure
                    </h4>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                      <div className="text-sm font-medium mb-2">Monthly Sales Report</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="font-medium p-2 bg-slate-100 dark:bg-slate-700">Month</div>
                        <div className="font-medium p-2 bg-slate-100 dark:bg-slate-700">Revenue</div>
                        <div className="font-medium p-2 bg-slate-100 dark:bg-slate-700">Units Sold</div>
                        <div className="p-2">January</div>
                        <div className="p-2">$15,000</div>
                        <div className="p-2">150</div>
                        <div className="p-2">February</div>
                        <div className="p-2">$18,000</div>
                        <div className="p-2">180</div>
                        <div className="p-2">March</div>
                        <div className="p-2">$22,000</div>
                        <div className="p-2">220</div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-red-100 dark:bg-red-950/30 rounded border border-red-300 dark:border-red-600">
                      <p className="text-sm text-red-700 dark:text-red-300 font-medium">❌ Problems:</p>
                      <ul className="text-sm text-red-600 dark:text-red-400 mt-1 space-y-1">
                        <li>• Uses divs instead of table elements</li>
                        <li>• No header/data relationships</li>
                        <li>• Screen readers can't navigate by columns</li>
                        <li>• No caption or table structure</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Example */}
              {selectedExample === 'forms' && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      ✅ Proper Form Structure
                    </h4>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                      <form className="space-y-4">
                        <fieldset className="border border-slate-300 dark:border-slate-600 rounded p-4">
                          <legend className="font-medium px-2">Personal Information</legend>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                              <input 
                                type="text" 
                                id="name" 
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded" 
                                required
                              />
                            </div>
                            <div>
                              <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                              <input 
                                type="email" 
                                id="email" 
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded" 
                                required
                              />
                            </div>
                          </div>
                        </fieldset>
                        <fieldset className="border border-slate-300 dark:border-slate-600 rounded p-4">
                          <legend className="font-medium px-2">Contact Preferences</legend>
                          <div className="space-y-2">
                            <div>
                              <input type="radio" id="email-pref" name="contact" value="email" className="mr-2" />
                              <label htmlFor="email-pref">Email</label>
                            </div>
                            <div>
                              <input type="radio" id="phone-pref" name="contact" value="phone" className="mr-2" />
                              <label htmlFor="phone-pref">Phone</label>
                            </div>
                          </div>
                        </fieldset>
                      </form>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-3"
                      onClick={() => {
                        const text = "Screen reader announces: Personal Information, fieldset. Full Name, required edit field. Email Address, required edit field. Contact Preferences, fieldset. Email, radio button. Phone, radio button.";
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          const utterance = new SpeechSynthesisUtterance(text);
                          utterance.rate = 0.9;
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Hear Screen Reader
                    </Button>
                  </div>

                  <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      ❌ Poor Form Structure
                    </h4>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                      <div className="space-y-4">
                        <div className="border border-slate-300 dark:border-slate-600 rounded p-4">
                          <div className="font-medium mb-3">Personal Information</div>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium mb-1">Full Name</div>
                              <input 
                                type="text" 
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded" 
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-1">Email Address</div>
                              <input 
                                type="email" 
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded" 
                              />
                            </div>
                          </div>
                        </div>
                        <div className="border border-slate-300 dark:border-slate-600 rounded p-4">
                          <div className="font-medium mb-3">Contact Preferences</div>
                          <div className="space-y-2">
                            <div>
                              <input type="radio" name="contact" value="email" className="mr-2" />
                              <span>Email</span>
                            </div>
                            <div>
                              <input type="radio" name="contact" value="phone" className="mr-2" />
                              <span>Phone</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-red-100 dark:bg-red-950/30 rounded border border-red-300 dark:border-red-600">
                      <p className="text-sm text-red-700 dark:text-red-300 font-medium">❌ Problems:</p>
                      <ul className="text-sm text-red-600 dark:text-red-400 mt-1 space-y-1">
                        <li>• No fieldset/legend grouping</li>
                        <li>• Labels not associated with inputs</li>
                        <li>• Missing form structure</li>
                        <li>• No programmatic relationships</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interactive HTML Structure Analyzer */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-indigo-600" />
              Interactive HTML Structure Analyzer
            </CardTitle>
            <CardDescription>
              Paste your HTML code and get real-time semantic structure feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">
                    HTML Code:
                  </label>
                  <Textarea 
                    placeholder="Paste your HTML here...
Example:
<h1>Main Title</h1>
<h2>Section</h2>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>"
                    className="h-48 font-mono text-sm mb-4"
                    onChange={(e) => {
                      const html = e.target.value;
                      const analysis = analyzeHtmlStructure(html);
                      const feedback = document.getElementById('structure-feedback');
                      
                      if (feedback) {
                        let feedbackHtml = '';
                        
                        if (analysis.issues.length > 0) {
                          feedbackHtml += '<div class="mb-3"><span class="text-red-600 font-medium">❌ Issues Found:</span><ul class="text-sm text-red-600 mt-1 space-y-1">';
                          analysis.issues.forEach(issue => {
                            feedbackHtml += `<li>• ${issue}</li>`;
                          });
                          feedbackHtml += '</ul></div>';
                        }
                        
                        if (analysis.suggestions.length > 0) {
                          feedbackHtml += '<div class="mb-3"><span class="text-blue-600 font-medium">💡 Suggestions:</span><ul class="text-sm text-blue-600 mt-1 space-y-1">';
                          analysis.suggestions.forEach(suggestion => {
                            feedbackHtml += `<li>• ${suggestion}</li>`;
                          });
                          feedbackHtml += '</ul></div>';
                        }
                        
                        if (analysis.issues.length === 0 && html.length > 0) {
                          feedbackHtml = '<span class="text-green-600">✅ Good semantic structure detected!</span>';
                        }
                        
                        if (html.length === 0) {
                          feedbackHtml = '<span class="text-slate-500">Paste HTML code to analyze structure...</span>';
                        }
                        
                        feedback.innerHTML = feedbackHtml;
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900 dark:text-white mb-2 block">
                    Structure Analysis:
                  </label>
                  <div id="structure-feedback" className="h-48 p-4 bg-slate-50 dark:bg-slate-800 rounded border overflow-y-auto">
                    <span className="text-slate-500">Paste HTML code to analyze structure...</span>
                  </div>
                  <Button 
                    onClick={() => {
                      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                      const html = textarea?.value || '';
                      if (html && 'speechSynthesis' in window) {
                        const analysis = analyzeHtmlStructure(html);
                        let text = "HTML Structure Analysis: ";
                        if (analysis.issues.length > 0) {
                          text += `Found ${analysis.issues.length} issues: ${analysis.issues.join(', ')}. `;
                        }
                        if (analysis.suggestions.length > 0) {
                          text += `Suggestions: ${analysis.suggestions.join(', ')}.`;
                        }
                        if (analysis.issues.length === 0) {
                          text += "Good semantic structure detected!";
                        }
                        
                        window.speechSynthesis.cancel();
                        const utterance = new SpeechSynthesisUtterance(text);
                        utterance.rate = 0.9;
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                    className="w-full mt-4"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Speak Analysis Results
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testing Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-6 w-6 text-violet-600" />
              Testing Methods for 1.3.1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Manual Testing</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Navigate with screen reader by headings</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Test list navigation (L key in NVDA/JAWS)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Check table navigation (T key, Ctrl+Alt+arrows)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Verify form field relationships</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Automated Testing</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">axe DevTools structure analysis</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">HTML5 validator for semantic markup</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Lighthouse accessibility audit</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">WAVE structural analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-6 w-6 text-indigo-600" />
              Implementation Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* HTML Examples */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">HTML Implementation</h4>
                <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">HTML</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-slate-400 hover:text-white"
                      onClick={() => {
                        const code = `<!-- Proper heading structure -->
<h1>Main Page Title</h1>
<h2>Section Heading</h2>
<h3>Subsection</h3>
<h3>Another Subsection</h3>
<h2>Another Section</h2>

<!-- Proper list structure -->
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>

<!-- Proper table structure -->
<table>
  <caption>Monthly Sales Data</caption>
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">Revenue</th>
      <th scope="col">Units</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>January</td>
      <td>$15,000</td>
      <td>150</td>
    </tr>
  </tbody>
</table>

<!-- Proper form structure -->
<form>
  <fieldset>
    <legend>Personal Information</legend>
    <label for="name">Name:</label>
    <input type="text" id="name" required>
    
    <label for="email">Email:</label>
    <input type="email" id="email" required>
  </fieldset>
</form>`;
                        navigator.clipboard.writeText(code);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    <code>{`<!-- Proper heading structure -->
<h1>Main Page Title</h1>
<h2>Section Heading</h2>
<h3>Subsection</h3>
<h3>Another Subsection</h3>
<h2>Another Section</h2>

<!-- Proper list structure -->
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>

<!-- Proper table structure -->
<table>
  <caption>Monthly Sales Data</caption>
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">Revenue</th>
      <th scope="col">Units</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>January</td>
      <td>$15,000</td>
      <td>150</td>
    </tr>
  </tbody>
</table>

<!-- Proper form structure -->
<form>
  <fieldset>
    <legend>Personal Information</legend>
    <label for="name">Name:</label>
    <input type="text" id="name" required>
    
    <label for="email">Email:</label>
    <input type="email" id="email" required>
  </fieldset>
</form>`}</code>
                  </pre>
                </div>
              </div>

              {/* React Examples */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">React Implementation</h4>
                <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">React/JSX</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-slate-400 hover:text-white"
                      onClick={() => {
                        const code = `// Semantic structure component
function ArticleLayout({ title, sections }) {
  return (
    <article>
      <h1>{title}</h1>
      {sections.map((section, index) => (
        <section key={index}>
          <h2>{section.title}</h2>
          {section.subsections?.map((subsection, subIndex) => (
            <div key={subIndex}>
              <h3>{subsection.title}</h3>
              <p>{subsection.content}</p>
            </div>
          ))}
        </section>
      ))}
    </article>
  );
}

// Accessible form component
function ContactForm() {
  return (
    <form>
      <fieldset>
        <legend>Contact Information</legend>
        <div>
          <label htmlFor="name">Full Name:</label>
          <input 
            type="text" 
            id="name" 
            required 
            aria-describedby="name-help"
          />
          <div id="name-help">Enter your first and last name</div>
        </div>
        
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            required 
            aria-describedby="email-help"
          />
          <div id="email-help">We'll never share your email</div>
        </div>
      </fieldset>
      
      <fieldset>
        <legend>Preferences</legend>
        <div role="group" aria-labelledby="contact-method">
          <span id="contact-method">Preferred contact method:</span>
          <label>
            <input type="radio" name="contact" value="email" />
            Email
          </label>
          <label>
            <input type="radio" name="contact" value="phone" />
            Phone
          </label>
        </div>
      </fieldset>
    </form>
  );
}

// Accessible data table
function DataTable({ data, columns }) {
  return (
    <table>
      <caption>Sales Data for Q1 2024</caption>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} scope="col">{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map(col => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`;
                        navigator.clipboard.writeText(code);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    <code>{`// Semantic structure component
function ArticleLayout({ title, sections }) {
  return (
    <article>
      <h1>{title}</h1>
      {sections.map((section, index) => (
        <section key={index}>
          <h2>{section.title}</h2>
          {section.subsections?.map((subsection, subIndex) => (
            <div key={subIndex}>
              <h3>{subsection.title}</h3>
              <p>{subsection.content}</p>
            </div>
          ))}
        </section>
      ))}
    </article>
  );
}

// Accessible form component
function ContactForm() {
  return (
    <form>
      <fieldset>
        <legend>Contact Information</legend>
        <div>
          <label htmlFor="name">Full Name:</label>
          <input 
            type="text" 
            id="name" 
            required 
            aria-describedby="name-help"
          />
          <div id="name-help">Enter your first and last name</div>
        </div>
        
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            required 
            aria-describedby="email-help"
          />
          <div id="email-help">We'll never share your email</div>
        </div>
      </fieldset>
      
      <fieldset>
        <legend>Preferences</legend>
        <div role="group" aria-labelledby="contact-method">
          <span id="contact-method">Preferred contact method:</span>
          <label>
            <input type="radio" name="contact" value="email" />
            Email
          </label>
          <label>
            <input type="radio" name="contact" value="phone" />
            Phone
          </label>
        </div>
      </fieldset>
    </form>
  );
}

// Accessible data table
function DataTable({ data, columns }) {
  return (
    <table>
      <caption>Sales Data for Q1 2024</caption>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} scope="col">{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map(col => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`}</code>
                  </pre>
                </div>
              </div>

              {/* CSS Examples */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">CSS Implementation</h4>
                <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">CSS</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-slate-400 hover:text-white"
                      onClick={() => {
                        const code = `/* Enhance semantic structure with CSS */
/* Heading hierarchy */
h1 { font-size: 2rem; margin-bottom: 1rem; }
h2 { font-size: 1.5rem; margin-bottom: 0.75rem; }
h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }

/* List styling */
ul, ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

li {
  margin-bottom: 0.25rem;
}

/* Table structure */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

caption {
  font-weight: bold;
  margin-bottom: 0.5rem;
  caption-side: top;
}

th, td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background-color: #f8fafc;
  font-weight: 600;
}

/* Form structure */
fieldset {
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

legend {
  font-weight: 600;
  padding: 0 0.5rem;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

input, select, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

/* Focus indicators for keyboard navigation */
:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}`;
                        navigator.clipboard.writeText(code);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    <code>{`/* Enhance semantic structure with CSS */
/* Heading hierarchy */
h1 { font-size: 2rem; margin-bottom: 1rem; }
h2 { font-size: 1.5rem; margin-bottom: 0.75rem; }
h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }

/* List styling */
ul, ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

li {
  margin-bottom: 0.25rem;
}

/* Table structure */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

caption {
  font-weight: bold;
  margin-bottom: 0.5rem;
  caption-side: top;
}

th, td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

th {
  background-color: #f8fafc;
  font-weight: 600;
}

/* Form structure */
fieldset {
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

legend {
  font-weight: 600;
  padding: 0 0.5rem;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

input, select, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

/* Focus indicators for keyboard navigation */
:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
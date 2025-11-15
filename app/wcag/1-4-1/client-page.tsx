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
  FileText,
  Info,
  Lightbulb,
  Code,
  TestTube,
  Copy,
  Eye,
  EyeOff,
  Palette,
  AlertTriangle,
  Check,
  X
} from "lucide-react"
import { useState } from "react"

export default function WCAG141ClientPage() {
  const [colorBlindMode, setColorBlindMode] = useState(false)

  // Simulate different types of color blindness
  const applyColorBlindFilter = (originalColor: string, type: 'deuteranopia' | 'protanopia' | 'tritanopia' = 'deuteranopia') => {
    if (!colorBlindMode) return originalColor
    
    // Simplified color blindness simulation
    const colorMap: Record<string, Record<string, string>> = {
      deuteranopia: {
        'bg-red-600': 'bg-yellow-700',
        'bg-green-600': 'bg-yellow-600', 
        'text-red-600': 'text-yellow-700',
        'text-green-600': 'text-yellow-600',
        'border-red-500': 'border-yellow-700',
        'border-green-500': 'border-yellow-600'
      }
    }
    
    return colorMap[type]?.[originalColor] || originalColor
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-red-950">
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
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                    1.4.1 Use of Color
                  </h1>
                  <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
                    Level A
                  </Badge>
                </div>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Color is not used as the only visual means of conveying information
                </p>
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">Principle</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">1. Perceivable</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">Guideline</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">1.4 Distinguishable</p>
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
              <Lightbulb className="h-6 w-6 text-red-600" />
              Understanding 1.4.1 Use of Color
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">What does this mean?</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Information, actions, prompts, and visual elements must be identifiable without relying solely on color. 
                About 8% of men and 0.5% of women have some form of color vision deficiency, making color-only 
                communication inaccessible to millions of users.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Problematic Uses</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Form errors shown only in red</li>
                    <li>• Required fields marked only with red asterisks</li>
                    <li>• Chart data differentiated only by color</li>
                    <li>• Links identified only by color change</li>
                    <li>• Status indicators using only color</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Better Approaches</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Color + icons + text labels</li>
                    <li>• Color + patterns or textures</li>
                    <li>• Color + underlines or borders</li>
                    <li>• Color + shape differences</li>
                    <li>• Color + position or size cues</li>
                  </ul>
                </div>
              </div>

              <Alert className="mb-6">
                <Eye className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  This doesn't mean you can't use color - it means color cannot be the ONLY way to convey information. 
                  Always provide additional visual cues alongside color.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Color Blindness Simulator */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-red-600" />
              Interactive Color Blindness Simulator
            </CardTitle>
            <CardDescription>
              See how color-only information appears to users with color vision deficiencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant={colorBlindMode ? "default" : "outline"}
                  onClick={() => setColorBlindMode(!colorBlindMode)}
                >
                  {colorBlindMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {colorBlindMode ? 'Normal Vision' : 'Simulate Color Blindness'}
                </Button>
                {colorBlindMode && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Viewing as someone with deuteranopia (most common form of color blindness)
                  </p>
                )}
              </div>

              {/* Form Validation Example */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    ❌ Color Only Validation
                  </h4>
                  
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email Address</label>
                      <input 
                        type="email" 
                        className={`w-full p-2 border-2 rounded ${applyColorBlindFilter('border-red-500')} ${applyColorBlindFilter('bg-red-50')}`}
                        defaultValue="invalid-email"
                      />
                      <p className={`text-sm mt-1 ${applyColorBlindFilter('text-red-600')}`}>
                        Please enter a valid email address
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <input 
                        type="password" 
                        className={`w-full p-2 border-2 rounded ${applyColorBlindFilter('border-green-500')} ${applyColorBlindFilter('bg-green-50')}`}
                        defaultValue="validpassword"
                      />
                      <p className={`text-sm mt-1 ${applyColorBlindFilter('text-green-600')}`}>
                        Password is valid
                      </p>
                    </div>
                    
                    {colorBlindMode && (
                      <div className="mt-3 p-3 bg-red-100 dark:bg-red-950/30 rounded">
                        <p className="text-sm text-red-700 dark:text-red-300">
                          ❌ In color blind view: Cannot distinguish between error and success states!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    ✅ Color + Icons + Text
                  </h4>
                  
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email Address</label>
                      <input 
                        type="email" 
                        className={`w-full p-2 border-2 rounded ${applyColorBlindFilter('border-red-500')} ${applyColorBlindFilter('bg-red-50')}`}
                        defaultValue="invalid-email"
                      />
                      <p className={`text-sm mt-1 flex items-center gap-2 ${applyColorBlindFilter('text-red-600')}`}>
                        <X className="h-4 w-4" />
                        Error: Please enter a valid email address
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <input 
                        type="password" 
                        className={`w-full p-2 border-2 rounded ${applyColorBlindFilter('border-green-500')} ${applyColorBlindFilter('bg-green-50')}`}
                        defaultValue="validpassword"
                      />
                      <p className={`text-sm mt-1 flex items-center gap-2 ${applyColorBlindFilter('text-green-600')}`}>
                        <Check className="h-4 w-4" />
                        Success: Password is valid
                      </p>
                    </div>
                    
                    <div className="mt-3 p-3 bg-green-100 dark:bg-green-950/30 rounded">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        ✅ Icons and text make the status clear regardless of color perception!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Example */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4">❌ Color Only Chart</h4>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 ${applyColorBlindFilter('bg-red-600')} rounded`}></div>
                        <span className="text-sm">Product A: 45%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 ${applyColorBlindFilter('bg-green-600')} rounded`}></div>
                        <span className="text-sm">Product B: 35%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-600 rounded"></div>
                        <span className="text-sm">Product C: 20%</span>
                      </div>
                    </div>
                    {colorBlindMode && (
                      <p className="text-xs text-red-600 mt-2">❌ Red and green appear very similar!</p>
                    )}
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4">✅ Color + Patterns</h4>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 ${applyColorBlindFilter('bg-red-600')} rounded`} style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, white 2px, white 4px)'}}></div>
                        <span className="text-sm">Product A (Striped): 45%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 ${applyColorBlindFilter('bg-green-600')} rounded`}></div>
                        <span className="text-sm">Product B (Solid): 35%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-600 rounded" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '4px 4px'}}></div>
                        <span className="text-sm">Product C (Dotted): 20%</span>
                      </div>
                    </div>
                    <p className="text-xs text-green-600 mt-2">✅ Patterns and labels make data clear!</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Testing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-6 w-6 text-red-600" />
              Quick Testing Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Manual Testing</h4>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p>• Print page in grayscale</p>
                  <p>• Use browser color blindness simulators</p>
                  <p>• Cover color elements and check if meaning is clear</p>
                  <p>• Ask color blind users to test</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Automated Tools</h4>
                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <p>• WAVE color dependency checker</p>
                  <p>• axe DevTools color analysis</p>
                  <p>• Stark browser extension</p>
                  <p>• Colour Contrast Analyser</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-6 w-6 text-indigo-600" />
              Implementation Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Accessible Form Validation</h4>
                <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">HTML/CSS</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-slate-400 hover:text-white"
                      onClick={() => {
                        const code = `<!-- Accessible error styling -->
<div class="form-field error">
  <label for="email">Email Address *</label>
  <input type="email" id="email" aria-describedby="email-error" 
         class="input-error" value="invalid">
  <div id="email-error" class="error-message" role="alert">
    <svg aria-hidden="true" class="error-icon">
      <use href="#error-icon"></use>
    </svg>
    Error: Please enter a valid email address
  </div>
</div>

<style>
  .form-field.error input {
    border: 2px solid #dc2626;
    background-color: #fef2f2;
    /* Don't rely only on color */
  }
  
  .error-message {
    color: #dc2626;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .error-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
  
  /* Success state */
  .form-field.success input {
    border: 2px solid #16a34a;
    background-color: #f0fdf4;
  }
  
  .success-message {
    color: #16a34a;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>`;
                        navigator.clipboard.writeText(code);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    <code>{`<!-- Accessible error styling -->
<div class="form-field error">
  <label for="email">Email Address *</label>
  <input type="email" id="email" aria-describedby="email-error" 
         class="input-error" value="invalid">
  <div id="email-error" class="error-message" role="alert">
    <svg aria-hidden="true" class="error-icon">
      <use href="#error-icon"></use>
    </svg>
    Error: Please enter a valid email address
  </div>
</div>

<style>
  .form-field.error input {
    border: 2px solid #dc2626;
    background-color: #fef2f2;
    /* Don't rely only on color */
  }
  
  .error-message {
    color: #dc2626;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .error-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
  
  /* Success state */
  .form-field.success input {
    border: 2px solid #16a34a;
    background-color: #f0fdf4;
  }
  
  .success-message {
    color: #16a34a;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>`}</code>
                  </pre>
                </div>
              </div>

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
                        const code = `// Accessible status indicator component
function StatusIndicator({ status, message }) {
  const statusConfig = {
    error: {
      icon: <XIcon className="w-4 h-4" />,
      colorClass: 'text-red-600 bg-red-50 border-red-200',
      prefix: 'Error: '
    },
    success: {
      icon: <CheckIcon className="w-4 h-4" />,
      colorClass: 'text-green-600 bg-green-50 border-green-200',
      prefix: 'Success: '
    },
    warning: {
      icon: <AlertTriangleIcon className="w-4 h-4" />,
      colorClass: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      prefix: 'Warning: '
    }
  };

  const config = statusConfig[status];

  return (
    <div 
      className={\`flex items-center gap-2 p-3 border rounded \${config.colorClass}\`}
      role="alert"
      aria-live="polite"
    >
      {config.icon}
      <span className="font-medium">{config.prefix}</span>
      {message}
    </div>
  );
}

// Accessible link component
function AccessibleLink({ href, children, isExternal }) {
  return (
    <a 
      href={href}
      className="text-blue-600 underline hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...(isExternal && { 
        target: "_blank", 
        rel: "noopener noreferrer",
        'aria-label': \`\${children} (opens in new tab)\`
      })}
    >
      {children}
      {isExternal && (
        <ExternalLinkIcon className="w-4 h-4 inline ml-1" aria-hidden="true" />
      )}
    </a>
  );
}`;
                        navigator.clipboard.writeText(code);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    <code>{`// Accessible status indicator component
function StatusIndicator({ status, message }) {
  const statusConfig = {
    error: {
      icon: <XIcon className="w-4 h-4" />,
      colorClass: 'text-red-600 bg-red-50 border-red-200',
      prefix: 'Error: '
    },
    success: {
      icon: <CheckIcon className="w-4 h-4" />,
      colorClass: 'text-green-600 bg-green-50 border-green-200',
      prefix: 'Success: '
    },
    warning: {
      icon: <AlertTriangleIcon className="w-4 h-4" />,
      colorClass: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      prefix: 'Warning: '
    }
  };

  const config = statusConfig[status];

  return (
    <div 
      className={\`flex items-center gap-2 p-3 border rounded \${config.colorClass}\`}
      role="alert"
      aria-live="polite"
    >
      {config.icon}
      <span className="font-medium">{config.prefix}</span>
      {message}
    </div>
  );
}

// Accessible link component
function AccessibleLink({ href, children, isExternal }) {
  return (
    <a 
      href={href}
      className="text-blue-600 underline hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...(isExternal && { 
        target: "_blank", 
        rel: "noopener noreferrer",
        'aria-label': \`\${children} (opens in new tab)\`
      })}
    >
      {children}
      {isExternal && (
        <ExternalLinkIcon className="w-4 h-4 inline ml-1" aria-hidden="true" />
      )}
    </a>
  );
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
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
  FileText,
  Info,
  Lightbulb,
  Code,
  TestTube,
  Copy,
  ArrowRight,
  ArrowDown,
  RotateCcw,
  Shuffle,
  Navigation,
  Eye,
  EyeOff
} from "lucide-react"
import { useState } from "react"

export default function WCAG132ClientPage() {
  const [showDomOrder, setShowDomOrder] = useState(false)
  const [selectedLayout, setSelectedLayout] = useState('good')

  const simulateScreenReader = (elements: string[]) => {
    const text = `Screen reader reading order: ${elements.join(', ')}`
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950">
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
              <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
                <Navigation className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                    1.3.2 Meaningful Sequence
                  </h1>
                  <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700">
                    Level A
                  </Badge>
                </div>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  When the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined
                </p>
              </div>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-slate-900 dark:text-white">Principle</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">1. Perceivable</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
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
              <Lightbulb className="h-6 w-6 text-blue-600" />
              Understanding 1.3.2 Meaningful Sequence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">What does this mean?</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Content must be presented in a logical order that makes sense when read sequentially. Screen readers 
                and other assistive technologies read content in the order it appears in the DOM (HTML source), not 
                in the visual order created by CSS. When CSS changes the visual layout, the logical reading order 
                must still make sense.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Good Reading Order</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Follows logical progression</li>
                    <li>• DOM order matches visual order</li>
                    <li>• Makes sense when read linearly</li>
                    <li>• Preserves relationships between content</li>
                  </ul>
                </div>
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Poor Reading Order</h4>
                  <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                    <li>• Confusing or illogical sequence</li>
                    <li>• DOM order differs from visual order</li>
                    <li>• Breaks content relationships</li>
                    <li>• Creates confusion for assistive tech</li>
                  </ul>
                </div>
              </div>

              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Key Concept</AlertTitle>
                <AlertDescription>
                  Screen readers follow the DOM order, not the visual order. Always ensure your HTML structure 
                  makes logical sense even without CSS styling.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Reading Order Demo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-6 w-6 text-blue-600" />
              Interactive Reading Order Demo
            </CardTitle>
            <CardDescription>
              Compare how visual layout can affect reading order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Layout Selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={selectedLayout === 'good' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLayout('good')}
                >
                  Good Reading Order
                </Button>
                <Button
                  variant={selectedLayout === 'bad' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLayout('bad')}
                >
                  Poor Reading Order
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDomOrder(!showDomOrder)}
                >
                  {showDomOrder ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                  {showDomOrder ? 'Hide' : 'Show'} DOM Order
                </Button>
              </div>

              {/* Good Reading Order Example */}
              {selectedLayout === 'good' && (
                <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    ✅ Good Reading Order
                  </h4>
                  
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border relative">
                    {/* DOM Order Indicators */}
                    {showDomOrder && (
                      <div className="absolute top-2 right-2 bg-green-100 dark:bg-green-900/20 p-2 rounded text-xs">
                        DOM Order: 1→2→3→4
                      </div>
                    )}
                    
                    {/* Article Layout */}
                    <article className="space-y-4">
                      <header className={`p-4 bg-blue-100 dark:bg-blue-900/20 rounded ${showDomOrder ? 'border-2 border-green-500' : ''}`}>
                        {showDomOrder && <span className="text-green-600 font-bold text-sm">1. </span>}
                        <h2 className="text-xl font-bold">Breaking News: New Accessibility Guidelines Released</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Published today by the W3C</p>
                      </header>
                      
                      <section className={`p-4 bg-slate-50 dark:bg-slate-700 rounded ${showDomOrder ? 'border-2 border-green-500' : ''}`}>
                        {showDomOrder && <span className="text-green-600 font-bold text-sm">2. </span>}
                        <p>The World Wide Web Consortium (W3C) has announced new accessibility guidelines that will help make the web more inclusive for everyone.</p>
                      </section>
                      
                      <section className={`p-4 bg-slate-50 dark:bg-slate-700 rounded ${showDomOrder ? 'border-2 border-green-500' : ''}`}>
                        {showDomOrder && <span className="text-green-600 font-bold text-sm">3. </span>}
                        <p>These guidelines focus on improving screen reader compatibility, keyboard navigation, and visual accessibility features.</p>
                      </section>
                      
                      <footer className={`p-4 bg-gray-100 dark:bg-gray-800 rounded ${showDomOrder ? 'border-2 border-green-500' : ''}`}>
                        {showDomOrder && <span className="text-green-600 font-bold text-sm">4. </span>}
                        <p className="text-sm">Read more about these updates on the W3C website.</p>
                      </footer>
                    </article>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => simulateScreenReader(['Breaking News: New Accessibility Guidelines Released', 'Published today by the W3C', 'The World Wide Web Consortium has announced new accessibility guidelines', 'These guidelines focus on improving screen reader compatibility', 'Read more about these updates on the W3C website'])}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Hear Reading Order
                    </Button>
                  </div>
                  
                  <div className="mt-3 p-3 bg-green-100 dark:bg-green-950/30 rounded">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      ✅ This layout reads logically: headline → metadata → main content → related links. 
                      The DOM order matches the visual order and makes sense when read sequentially.
                    </p>
                  </div>
                </div>
              )}

              {/* Poor Reading Order Example */}
              {selectedLayout === 'bad' && (
                <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-xl border border-red-200 dark:border-red-700">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    ❌ Poor Reading Order
                  </h4>
                  
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border relative">
                    {/* DOM Order Indicators */}
                    {showDomOrder && (
                      <div className="absolute top-2 right-2 bg-red-100 dark:bg-red-900/20 p-2 rounded text-xs">
                        DOM Order: 1→2→3→4
                      </div>
                    )}
                    
                    {/* Confusing Layout with CSS positioning */}
                    <article className="relative">
                      {/* Visually this appears first but is last in DOM */}
                      <div className={`absolute top-0 left-0 right-0 p-4 bg-blue-100 dark:bg-blue-900/20 rounded ${showDomOrder ? 'border-2 border-red-500' : ''}`} style={{ order: 4 }}>
                        {showDomOrder && <span className="text-red-600 font-bold text-sm">4. </span>}
                        <h2 className="text-xl font-bold">Breaking News: New Accessibility Guidelines Released</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Published today by the W3C</p>
                      </div>
                      
                      {/* Content sections with confusing order */}
                      <div className="mt-24 space-y-4">
                        <section className={`p-4 bg-gray-100 dark:bg-gray-800 rounded ${showDomOrder ? 'border-2 border-red-500' : ''}`}>
                          {showDomOrder && <span className="text-red-600 font-bold text-sm">1. </span>}
                          <p className="text-sm">Read more about these updates on the W3C website.</p>
                        </section>
                        
                        <section className={`p-4 bg-slate-50 dark:bg-slate-700 rounded ${showDomOrder ? 'border-2 border-red-500' : ''}`}>
                          {showDomOrder && <span className="text-red-600 font-bold text-sm">2. </span>}
                          <p>These guidelines focus on improving screen reader compatibility, keyboard navigation, and visual accessibility features.</p>
                        </section>
                        
                        <section className={`p-4 bg-slate-50 dark:bg-slate-700 rounded ${showDomOrder ? 'border-2 border-red-500' : ''}`}>
                          {showDomOrder && <span className="text-red-600 font-bold text-sm">3. </span>}
                          <p>The World Wide Web Consortium (W3C) has announced new accessibility guidelines that will help make the web more inclusive for everyone.</p>
                        </section>
                      </div>
                    </article>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => simulateScreenReader(['Read more about these updates on the W3C website', 'These guidelines focus on improving screen reader compatibility', 'The World Wide Web Consortium has announced new accessibility guidelines', 'Breaking News: New Accessibility Guidelines Released', 'Published today by the W3C'])}
                    >
                      <VolumeX className="h-4 w-4 mr-2" />
                      Hear Confusing Order
                    </Button>
                  </div>
                  
                  <div className="mt-3 p-3 bg-red-100 dark:bg-red-950/30 rounded">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      ❌ This layout is confusing: screen readers read footer → content → more content → headline. 
                      The DOM order doesn't match the visual order, making it hard to understand.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CSS Layout Impact */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-6 w-6 text-cyan-600" />
              CSS Layout Impact on Reading Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">✅ Safe CSS Properties</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• <code>margin</code> and <code>padding</code></li>
                    <li>• <code>float</code> (with logical order)</li>
                    <li>• <code>display: block/inline</code></li>
                    <li>• <code>text-align</code></li>
                  </ul>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-3">⚠️ Potentially Problematic</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• <code>position: absolute/fixed</code></li>
                    <li>• <code>flexbox</code> with <code>order</code></li>
                    <li>• <code>grid</code> with positioning</li>
                    <li>• <code>transform</code> positioning</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">💡 Best Practices</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                  <li>• Structure your HTML in logical reading order first</li>
                  <li>• Use CSS only for visual presentation, not content order</li>
                  <li>• Test with screen readers or tab navigation</li>
                  <li>• Consider using CSS Grid's <code>grid-template-areas</code> for complex layouts</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testing Methods */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-6 w-6 text-blue-600" />
              Testing Methods for 1.3.2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Manual Testing</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Turn off CSS and read content linearly</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Navigate with Tab key only</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Use screen reader to test reading order</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Check mobile layout behavior</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Automated Testing</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">axe DevTools reading order analysis</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">WAVE reading order checker</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Lighthouse accessibility audit</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Browser dev tools DOM inspection</span>
                  </div>
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
              {/* HTML Structure Example */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">HTML Structure Best Practices</h4>
                <div className="bg-slate-900 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-300">HTML</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-slate-400 hover:text-white"
                      onClick={() => {
                        const code = `<!-- Good: Logical HTML structure -->
<article>
  <header>
    <h1>Article Title</h1>
    <p>Published date and author</p>
  </header>
  
  <section>
    <h2>Introduction</h2>
    <p>Article introduction...</p>
  </section>
  
  <section>
    <h2>Main Content</h2>
    <p>Main article content...</p>
  </section>
  
  <footer>
    <p>Related links and metadata</p>
  </footer>
</article>

<!-- Bad: Illogical structure -->
<div>
  <div id="footer">Related links</div>
  <div id="content">Main content</div>
  <div id="intro">Introduction</div>
  <div id="header">Title</div>
</div>

<!-- Use CSS to position visually -->
<style>
  /* Good: CSS for presentation only */
  .article-layout {
    display: grid;
    grid-template-areas: 
      "header header"
      "intro  sidebar"
      "content sidebar"
      "footer footer";
  }
</style>`;
                        navigator.clipboard.writeText(code);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    <code>{`<!-- Good: Logical HTML structure -->
<article>
  <header>
    <h1>Article Title</h1>
    <p>Published date and author</p>
  </header>
  
  <section>
    <h2>Introduction</h2>
    <p>Article introduction...</p>
  </section>
  
  <section>
    <h2>Main Content</h2>
    <p>Main article content...</p>
  </section>
  
  <footer>
    <p>Related links and metadata</p>
  </footer>
</article>

<!-- Bad: Illogical structure -->
<div>
  <div id="footer">Related links</div>
  <div id="content">Main content</div>
  <div id="intro">Introduction</div>
  <div id="header">Title</div>
</div>

<!-- Use CSS to position visually -->
<style>
  /* Good: CSS for presentation only */
  .article-layout {
    display: grid;
    grid-template-areas: 
      "header header"
      "intro  sidebar"
      "content sidebar"
      "footer footer";
  }
</style>`}</code>
                  </pre>
                </div>
              </div>

              {/* React Example */}
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
                        const code = `// Good: Logical component structure
function ArticleLayout({ title, content, sidebar }) {
  return (
    <div className="article-grid">
      {/* Header first in DOM */}
      <header className="article-header">
        <h1>{title}</h1>
        <ArticleMetadata />
      </header>
      
      {/* Main content second */}
      <main className="article-content">
        {content.map((section, index) => (
          <section key={index}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
      </main>
      
      {/* Sidebar third (will be positioned by CSS) */}
      <aside className="article-sidebar">
        {sidebar}
      </aside>
      
      {/* Footer last */}
      <footer className="article-footer">
        <RelatedArticles />
      </footer>
    </div>
  );
}

// CSS for visual layout
const styles = \`
  .article-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-areas:
      "header header"
      "content sidebar"
      "footer footer";
    gap: 1rem;
  }
  
  .article-header { grid-area: header; }
  .article-content { grid-area: content; }
  .article-sidebar { grid-area: sidebar; }
  .article-footer { grid-area: footer; }
\`;`;
                        navigator.clipboard.writeText(code);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
                    <code>{`// Good: Logical component structure
function ArticleLayout({ title, content, sidebar }) {
  return (
    <div className="article-grid">
      {/* Header first in DOM */}
      <header className="article-header">
        <h1>{title}</h1>
        <ArticleMetadata />
      </header>
      
      {/* Main content second */}
      <main className="article-content">
        {content.map((section, index) => (
          <section key={index}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
      </main>
      
      {/* Sidebar third (will be positioned by CSS) */}
      <aside className="article-sidebar">
        {sidebar}
      </aside>
      
      {/* Footer last */}
      <footer className="article-footer">
        <RelatedArticles />
      </footer>
    </div>
  );
}

// CSS for visual layout
const styles = \`
  .article-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-areas:
      "header header"
      "content sidebar"
      "footer footer";
    gap: 1rem;
  }
  
  .article-header { grid-area: header; }
  .article-content { grid-area: content; }
  .article-sidebar { grid-area: sidebar; }
  .article-footer { grid-area: footer; }
\`;`}</code>
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
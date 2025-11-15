import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ShareDialog } from "@/components/blog/share-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ARIA Labels and Attributes: Complete Developer Guide | Accessibility.build",
  description: "Master ARIA labels, attributes, and roles for web accessibility. Learn aria-label, aria-labelledby, aria-describedby, and more with practical examples.",
  keywords: ["ARIA labels", "aria-label", "aria-labelledby", "aria-describedby", "ARIA attributes", "web accessibility", "screen reader accessibility"],
}

export default function AriaLabelsPost() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" />Back to Blog</Link>
          </Button>
          
          <div className="flex gap-2 mb-4">
            <Badge variant="secondary">ARIA</Badge>
            <Badge variant="secondary">Development</Badge>
            <Badge variant="secondary">Accessibility</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            ARIA Labels and Attributes: Complete Developer Guide
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Master ARIA labels, attributes, and roles for web accessibility. Learn aria-label, aria-labelledby, aria-describedby, and more with practical examples.
          </p>
        </div>
      </header>

      <div className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="w-full lg:w-3/4">
              <article className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="relative aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/5 rounded-t-lg overflow-hidden flex items-center justify-center">
                  <div className="text-6xl font-bold text-purple-500/30">ARIA</div>
                </div>

                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h2>What are ARIA Labels?</h2>
                    <p>ARIA (Accessible Rich Internet Applications) labels provide additional semantic information to assistive technologies when HTML alone isn't sufficient. They're essential for complex interactive components and dynamic content.</p>

                    <h2>Core ARIA Labeling Attributes</h2>
                    
                    <h3>aria-label</h3>
                    <p>Provides an accessible name when no visible text is available.</p>
                    <pre><code>{`<button aria-label="Close dialog">
  <svg>...</svg>
</button>`}</code></pre>

                    <h3>aria-labelledby</h3>
                    <p>References other elements that serve as the label.</p>
                    <pre><code>{`<h2 id="billing">Billing Address</h2>
<div role="group" aria-labelledby="billing">
  <input type="text" placeholder="Street">
</div>`}</code></pre>

                    <h3>aria-describedby</h3>
                    <p>References elements that provide additional description.</p>
                    <pre><code>{`<input type="password" aria-describedby="pwd-help">
<div id="pwd-help">
  Must be 8+ characters with one uppercase letter
</div>`}</code></pre>

                    <h2>Common ARIA Patterns</h2>
                    
                    <h3>Form Enhancement</h3>
                    <pre><code>{`<label for="email">Email</label>
<input type="email" id="email" 
       aria-describedby="email-error"
       aria-invalid="true">
<div id="email-error" role="alert">
  Please enter a valid email address
</div>`}</code></pre>

                    <h3>Interactive Components</h3>
                    <pre><code>{`<button aria-haspopup="listbox" 
        aria-expanded="false"
        aria-labelledby="dropdown-label">
  Choose option
</button>`}</code></pre>

                    <h2>Live Regions</h2>
                    <p>Announce dynamic content changes:</p>
                    <pre><code>{`<div aria-live="polite" id="status">
  <!-- Status updates -->
</div>

<div aria-live="assertive" role="alert">
  <!-- Critical alerts -->
</div>`}</code></pre>

                    <h2>Best Practices</h2>
                    <ul>
                      <li>Use semantic HTML first, enhance with ARIA</li>
                      <li>Don't change semantic meaning with ARIA roles</li>
                      <li>Test with real screen readers</li>
                      <li>Keep ARIA labels concise and descriptive</li>
                      <li>Ensure all interactive elements are properly labeled</li>
                    </ul>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg my-8">
                      <h3 className="text-lg font-semibold mb-4">🛠️ Test Your ARIA Implementation</h3>
                      <p>Use our <Link href="/tools/accessibility-audit-helper" className="text-purple-600 dark:text-purple-400 hover:underline font-semibold">Accessibility Audit Helper</Link> to check your ARIA implementation and get specific recommendations for improvement.</p>
                    </div>

                    <h2>Common Mistakes</h2>
                    <ul>
                      <li>Overusing ARIA when HTML is sufficient</li>
                      <li>Using invalid ARIA attribute values</li>
                      <li>Breaking semantic meaning with inappropriate roles</li>
                      <li>Not testing with assistive technologies</li>
                    </ul>

                    <h2>Conclusion</h2>
                    <p>ARIA labels are powerful tools for accessibility when used correctly. Remember: semantic HTML first, then enhance with ARIA only when necessary. Always test with real assistive technologies.</p>
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    <ShareDialog url="https://accessibility.build/blog/aria-labels-guide" title="ARIA Labels and Attributes: Complete Developer Guide" description="Master ARIA labels, attributes, and roles for web accessibility." />
                  </div>
                </div>
              </article>
            </div>

            <div className="w-full lg:w-1/4 mt-8 lg:mt-0">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border p-4">
                <h3 className="font-semibold mb-3 text-sm">ARIA Quick Reference</h3>
                <div className="space-y-2 text-xs">
                  <div><strong>Labels:</strong> aria-label, aria-labelledby</div>
                  <div><strong>Descriptions:</strong> aria-describedby</div>
                  <div><strong>States:</strong> aria-expanded, aria-selected</div>
                  <div><strong>Live Regions:</strong> aria-live, role="alert"</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ShareDialog } from "@/components/blog/share-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Screen Reader Testing: Complete Guide for Developers | Accessibility.build",
  description: "Learn how to test your website with screen readers like NVDA, JAWS, and VoiceOver. Comprehensive guide with practical tips and testing strategies.",
  keywords: ["screen reader testing", "NVDA testing", "JAWS testing", "VoiceOver testing", "accessibility testing", "assistive technology testing"],
}

export default function ScreenReaderTestingPost() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="w-full max-w-6xl mx-auto px-4 py-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" />Back to Blog</Link>
          </Button>
          
          <div className="flex gap-2 mb-4">
            <Badge variant="secondary">Testing</Badge>
            <Badge variant="secondary">Screen Readers</Badge>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Screen Reader Testing: Complete Guide for Developers
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Learn how to test your website with screen readers like NVDA, JAWS, and VoiceOver. Comprehensive guide with practical tips and testing strategies.
          </p>
        </div>
      </header>

      <div className="w-full">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="w-full lg:w-3/4">
              <article className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border">
                <div className="relative aspect-video bg-gradient-to-br from-green-500/20 to-blue-500/5 rounded-t-lg flex items-center justify-center">
                  <div className="text-6xl font-bold text-green-500/30">🔊</div>
                </div>

                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h2>Why Screen Reader Testing Matters</h2>
                    <p>Screen reader testing is essential for identifying accessibility barriers. Over 1.3 billion people worldwide have vision impairments, with millions relying on screen readers for web access.</p>

                    <h2>Popular Screen Readers</h2>
                    
                    <h3>NVDA (Windows) - 41% market share</h3>
                    <ul>
                      <li><strong>Cost:</strong> Free</li>
                      <li><strong>Best with:</strong> Firefox, Chrome</li>
                      <li><strong>Great for:</strong> Testing and development</li>
                    </ul>

                    <h3>JAWS (Windows) - 43% market share</h3>
                    <ul>
                      <li><strong>Cost:</strong> $95/year</li>
                      <li><strong>Best with:</strong> Chrome, Edge</li>
                      <li><strong>Industry standard:</strong> Advanced features</li>
                    </ul>

                    <h3>VoiceOver (Mac) - 10% market share</h3>
                    <ul>
                      <li><strong>Cost:</strong> Free (built-in)</li>
                      <li><strong>Best with:</strong> Safari</li>
                      <li><strong>Mobile testing:</strong> iOS integration</li>
                    </ul>

                    <h2>Essential Commands</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Action</th>
                            <th className="text-left p-2">NVDA</th>
                            <th className="text-left p-2">JAWS</th>
                            <th className="text-left p-2">VoiceOver</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2">Start/Stop</td>
                            <td className="p-2">Ctrl+Alt+N</td>
                            <td className="p-2">Ctrl+Alt+J</td>
                            <td className="p-2">Cmd+F5</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Next Heading</td>
                            <td className="p-2">H</td>
                            <td className="p-2">H</td>
                            <td className="p-2">VO+Cmd+H</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2">Elements List</td>
                            <td className="p-2">NVDA+F7</td>
                            <td className="p-2">Insert+F3</td>
                            <td className="p-2">VO+U</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h2>Testing Checklist</h2>
                    <h3>Navigation Testing</h3>
                    <ul>
                      <li>✓ Navigate by headings (H1-H6)</li>
                      <li>✓ Jump between landmarks</li>
                      <li>✓ Tab through interactive elements</li>
                      <li>✓ Test skip links functionality</li>
                    </ul>

                    <h3>Content Testing</h3>
                    <ul>
                      <li>✓ All content is announced</li>
                      <li>✓ Images have meaningful alt text</li>
                      <li>✓ Form labels are clear</li>
                      <li>✓ Error messages are associated</li>
                    </ul>

                    <h2>Getting Started Tips</h2>
                    <ol>
                      <li><strong>Start with NVDA:</strong> It's free and excellent for testing</li>
                      <li><strong>Use headphones:</strong> Focus on audio without disturbing others</li>
                      <li><strong>Turn off monitor:</strong> Experience the true screen reader experience</li>
                      <li><strong>Test key journeys:</strong> Focus on critical user paths</li>
                      <li><strong>Take notes:</strong> Document issues as you find them</li>
                    </ol>

                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg my-8">
                      <h3 className="text-lg font-semibold mb-4">🎯 Quick Start</h3>
                      <p>Download NVDA, enable browse mode, and navigate to your website. Use H to jump between headings and Tab to move through interactive elements. Listen to how your content is announced.</p>
                    </div>

                    <h2>Common Issues Found</h2>
                    <ul>
                      <li>Missing or poor alt text</li>
                      <li>Unlabeled form fields</li>
                      <li>Poor heading structure</li>
                      <li>Inaccessible custom components</li>
                      <li>Missing focus management</li>
                    </ul>

                    <h2>Best Practices</h2>
                    <ul>
                      <li>Test regularly during development</li>
                      <li>Learn common browsing patterns</li>
                      <li>Test with real content</li>
                      <li>Focus on form interactions</li>
                      <li>Get feedback from actual users</li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    <ShareDialog url="https://accessibility.build/blog/screen-reader-testing" title="Screen Reader Testing: Complete Guide for Developers" description="Learn screen reader testing with NVDA, JAWS, and VoiceOver." />
                  </div>
                </div>
              </article>
            </div>

            <div className="w-full lg:w-1/4 mt-8 lg:mt-0">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border p-4">
                <h3 className="font-semibold mb-3 text-sm">Testing Tools</h3>
                <div className="space-y-2 text-xs">
                  <Link href="/tools/accessibility-audit-helper" className="block text-blue-600 hover:underline">Accessibility Audit Helper</Link>
                  <div><strong>Free Screen Readers:</strong></div>
                  <div>• NVDA (Windows)</div>
                  <div>• VoiceOver (Mac)</div>
                  <div>• TalkBack (Android)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

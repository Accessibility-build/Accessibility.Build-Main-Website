import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, MessageCircle, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShareDialog } from "@/components/blog/share-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Website Accessibility Audit Checklist: Complete Guide for 2024 | Accessibility.build",
  description: "Complete accessibility audit checklist covering WCAG 2.2 compliance, automated testing, manual testing, and remediation strategies. Free downloadable checklist included.",
  keywords: ["accessibility audit checklist", "WCAG audit", "accessibility testing", "website accessibility audit", "accessibility compliance", "WCAG 2.2 checklist", "accessibility evaluation"],
}

export default function AccessibilityAuditChecklistPost() {
  const post = {
    title: "Website Accessibility Audit Checklist: Complete Guide for 2024",
    description: "Complete accessibility audit checklist covering WCAG 2.2 compliance, automated testing, manual testing, and remediation strategies.",
    date: "2024-01-15",
    author: "Maya Rodriguez",
    authorRole: "Accessibility Consultant",
    tags: ["Audit", "Checklist", "WCAG"],
    readingTime: "12 min read",
  }

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Button asChild variant="ghost" size="sm" className="mb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            
            <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">Home</Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-300">Blog</Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span className="text-gray-900 dark:text-white font-medium">Accessibility Audit Checklist</span>
            </nav>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-medium">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              {post.title}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {post.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-full flex-shrink-0">
                  <div className="h-full w-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-medium text-xs">
                    {post.author.split(" ").map((name) => name[0]).join("")}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">{post.author}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{post.authorRole}</div>
                </div>
              </div>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.date} className="text-sm">
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{post.readingTime}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="w-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:gap-8">
              <div className="w-full lg:w-3/4 lg:pr-4">
                <article className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                  <div className="relative aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/5 rounded-t-lg overflow-hidden flex items-center justify-center">
                    <div className="text-6xl font-bold text-blue-500/30">✓</div>
                  </div>

                  <div className="p-6 sm:p-8 lg:p-10">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <h2>Why You Need an Accessibility Audit Checklist</h2>
                      <p>An accessibility audit checklist ensures consistent, thorough evaluation of your website's accessibility. It helps identify barriers for users with disabilities and ensures WCAG 2.2 compliance while providing a systematic approach to accessibility testing.</p>

                      <h2>Pre-Audit Preparation</h2>
                      <ul>
                        <li><strong>Define audit scope:</strong> Identify key pages and user journeys to test</li>
                        <li><strong>Set up testing environment:</strong> Install necessary tools and browsers</li>
                        <li><strong>Determine WCAG level:</strong> Choose target conformance level (A, AA, AAA)</li>
                        <li><strong>Gather stakeholder requirements:</strong> Understand business and legal requirements</li>
                        <li><strong>Document baseline:</strong> Record current accessibility status</li>
                      </ul>

                      <h2>Automated Testing Checklist</h2>
                      <h3>Essential Automated Testing Tools</h3>
                      <ul>
                        <li><strong>axe DevTools:</strong> Browser extension for comprehensive automated testing</li>
                        <li><strong>WAVE:</strong> Web Accessibility Evaluation Tool</li>
                        <li><strong>Lighthouse:</strong> Built into Chrome DevTools for accessibility audits</li>
                        <li><strong>Pa11y:</strong> Command line accessibility testing tool</li>
                        <li><strong>axe-core:</strong> Programmatic accessibility testing</li>
                      </ul>

                      <h3>Automated Testing Checklist Items</h3>
                      <ul>
                        <li>✓ Missing alternative text for images</li>
                        <li>✓ Insufficient color contrast ratios</li>
                        <li>✓ Form fields without associated labels</li>
                        <li>✓ Missing or improper heading structure</li>
                        <li>✓ Missing page titles and meta descriptions</li>
                        <li>✓ Keyboard navigation and focus issues</li>
                        <li>✓ Missing ARIA labels and descriptions</li>
                        <li>✓ Invalid HTML markup</li>
                        <li>✓ Missing language attributes</li>
                        <li>✓ Duplicate or missing IDs</li>
                      </ul>

                      <h2>Manual Testing Checklist</h2>
                      <h3>Keyboard Navigation Testing</h3>
                      <ul>
                        <li>✓ All interactive elements are keyboard accessible</li>
                        <li>✓ Focus indicators are clearly visible</li>
                        <li>✓ Tab order follows logical sequence</li>
                        <li>✓ No keyboard traps exist</li>
                        <li>✓ Skip links function properly</li>
                        <li>✓ Dropdown menus work with keyboard</li>
                        <li>✓ Modal dialogs trap focus appropriately</li>
                        <li>✓ Custom widgets respond to keyboard input</li>
                        <li>✓ Form submission works with keyboard</li>
                        <li>✓ Video controls are keyboard accessible</li>
                      </ul>

                      <h3>Screen Reader Testing</h3>
                      <ul>
                        <li>✓ Test with NVDA (Windows) and VoiceOver (Mac)</li>
                        <li>✓ All content is announced appropriately</li>
                        <li>✓ Form labels and instructions are clear</li>
                        <li>✓ Error messages are associated with form fields</li>
                        <li>✓ Landmark regions are properly identified</li>
                        <li>✓ Tables have proper headers and captions</li>
                        <li>✓ Links have descriptive text</li>
                        <li>✓ Images have meaningful alt text</li>
                        <li>✓ Dynamic content updates are announced</li>
                        <li>✓ Page structure is logical when linearized</li>
                      </ul>

                      <h2>WCAG 2.2 Success Criteria Checklist</h2>
                      <h3>Level A Requirements</h3>
                      <ul>
                        <li>✓ 1.1.1 Non-text Content - Alt text for images</li>
                        <li>✓ 1.2.1 Audio-only and Video-only (Prerecorded)</li>
                        <li>✓ 1.3.1 Info and Relationships - Semantic markup</li>
                        <li>✓ 1.4.1 Use of Color - Don't rely solely on color</li>
                        <li>✓ 2.1.1 Keyboard - All functionality keyboard accessible</li>
                        <li>✓ 2.4.1 Bypass Blocks - Skip navigation links</li>
                        <li>✓ 3.2.6 Consistent Help (NEW in WCAG 2.2)</li>
                        <li>✓ 3.3.7 Redundant Entry (NEW in WCAG 2.2)</li>
                      </ul>

                      <h3>Level AA Requirements</h3>
                      <ul>
                        <li>✓ 1.4.3 Contrast (Minimum) - 4.5:1 for normal text</li>
                        <li>✓ 1.4.4 Resize text - 200% zoom without horizontal scroll</li>
                        <li>✓ 2.4.11 Focus Appearance (NEW in WCAG 2.2)</li>
                        <li>✓ 2.5.7 Dragging Movements (NEW in WCAG 2.2)</li>
                        <li>✓ 2.5.8 Target Size (NEW in WCAG 2.2)</li>
                        <li>✓ 3.3.8 Accessible Authentication (NEW in WCAG 2.2)</li>
                        <li>✓ 4.1.3 Status Messages - Live regions for updates</li>
                      </ul>

                      <h2>Content-Specific Audit Items</h2>
                      <h3>Images and Media</h3>
                      <ul>
                        <li>✓ Meaningful images have descriptive alt text</li>
                        <li>✓ Decorative images have empty alt attributes (alt="")</li>
                        <li>✓ Complex images have extended descriptions</li>
                        <li>✓ Videos have captions and transcripts</li>
                        <li>✓ Audio content has transcripts</li>
                        <li>✓ Image maps have accessible alternatives</li>
                        <li>✓ SVGs have appropriate titles and descriptions</li>
                      </ul>

                      <h3>Forms and Interactive Elements</h3>
                      <ul>
                        <li>✓ All form fields have associated labels</li>
                        <li>✓ Required fields are clearly indicated</li>
                        <li>✓ Error messages are descriptive and helpful</li>
                        <li>✓ Form instructions are provided when needed</li>
                        <li>✓ Field validation is accessible</li>
                        <li>✓ Custom form controls have proper ARIA</li>
                        <li>✓ Form submission confirmation is provided</li>
                      </ul>

                      <h3>Navigation and Structure</h3>
                      <ul>
                        <li>✓ Page has descriptive title</li>
                        <li>✓ Heading structure is logical (H1-H6)</li>
                        <li>✓ Navigation is consistent across pages</li>
                        <li>✓ Breadcrumbs are available and accessible</li>
                        <li>✓ Search functionality is accessible</li>
                        <li>✓ Site map is available</li>
                      </ul>

                      <h2>Mobile and Touch Device Testing</h2>
                      <ul>
                        <li>✓ Touch targets are at least 44px by 44px</li>
                        <li>✓ Content reflows properly on mobile</li>
                        <li>✓ Zoom up to 400% without horizontal scroll</li>
                        <li>✓ Orientation changes work properly</li>
                        <li>✓ Mobile-specific accessibility features work</li>
                      </ul>

                      <h2>Documentation and Reporting</h2>
                      <ul>
                        <li>✓ Document all identified issues with severity levels</li>
                        <li>✓ Provide specific remediation guidance</li>
                        <li>✓ Include screenshots and code examples</li>
                        <li>✓ Prioritize fixes based on impact and effort</li>
                        <li>✓ Create timeline for remediation</li>
                        <li>✓ Assign responsibility for each issue</li>
                        <li>✓ Track progress and re-test fixes</li>
                      </ul>

                      <h2>Post-Audit Follow-up Checklist</h2>
                      <ul>
                        <li>✓ Re-test fixed issues to ensure proper implementation</li>
                        <li>✓ Conduct user testing with people with disabilities</li>
                        <li>✓ Update internal processes and guidelines</li>
                        <li>✓ Schedule regular accessibility audits</li>
                        <li>✓ Train team members on accessibility best practices</li>
                        <li>✓ Implement accessibility testing in CI/CD pipeline</li>
                        <li>✓ Create accessibility statement for website</li>
                        <li>✓ Set up monitoring for ongoing compliance</li>
                      </ul>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg my-8">
                        <h3 className="text-lg font-semibold mb-4">🎯 Get Automated Help</h3>
                        <p>
                          Use our <Link href="/tools/accessibility-audit-helper" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                          AI Accessibility Audit Helper</Link> to get automated analysis and specific remediation recommendations 
                          for your website's accessibility issues. Get started with a comprehensive audit in minutes.
                        </p>
                      </div>

                      <h2>Common Audit Findings and Quick Fixes</h2>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Missing Alt Text</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Found in 70% of audits</p>
                          <p><strong>Fix:</strong> Add descriptive alt attributes to all informative images, empty alt="" for decorative images.</p>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Low Color Contrast</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Found in 83% of audits</p>
                          <p><strong>Fix:</strong> Ensure 4.5:1 ratio for normal text, 3:1 for large text. Use our contrast checker tool.</p>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Missing Form Labels</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Found in 59% of audits</p>
                          <p><strong>Fix:</strong> Associate every form input with a label using for/id or aria-labelledby.</p>
                        </div>
                      </div>

                      <h2>Conclusion</h2>
                      <p>
                        This comprehensive accessibility audit checklist ensures you don't miss critical accessibility barriers. 
                        Regular audits using this systematic approach will help maintain WCAG 2.2 compliance and create truly 
                        inclusive digital experiences.
                      </p>
                      <p>
                        Remember: accessibility is an ongoing process, not a one-time task. Use this checklist regularly 
                        and integrate accessibility testing into your development workflow for the best results.
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Share this checklist</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Help others improve their website accessibility</p>
                      </div>
                      <div className="flex gap-2">
                        <ShareDialog url="https://accessibility.build/blog/accessibility-audit-checklist" title={post.title} description={post.description} />
                      </div>
                    </div>
                  </div>
                </article>
              </div>

              <div className="w-full lg:w-1/4 mt-8 lg:mt-0">
                <div className="lg:sticky lg:top-8 space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center text-sm">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></span>
                      Quick Audit Tools
                    </h3>
                    <div className="space-y-2 text-xs">
                      <Link href="/tools/accessibility-audit-helper" className="block text-blue-600 dark:text-blue-400 hover:underline">
                        AI Accessibility Audit Helper
                      </Link>
                      <Link href="/tools/contrast-checker" className="block text-blue-600 dark:text-blue-400 hover:underline">
                        Color Contrast Checker
                      </Link>
                      <Link href="/tools/heading-analyzer" className="block text-blue-600 dark:text-blue-400 hover:underline">
                        Heading Structure Analyzer
                      </Link>
                      <Link href="/tools/alt-text-generator" className="block text-blue-600 dark:text-blue-400 hover:underline">
                        AI Alt Text Generator
                      </Link>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Related Articles</h3>
                    <div className="space-y-3">
                      <Link href="/blog/understanding-wcag-2-2" className="block group transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 -m-2">
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1 leading-tight text-xs">
                          Understanding WCAG 2.2
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          Complete guide to the latest accessibility guidelines
                        </p>
                      </Link>
                      <Link href="/blog/keyboard-navigation" className="block group transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 -m-2">
                        <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1 leading-tight text-xs">
                          Keyboard Navigation Guide
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          Master keyboard accessibility testing and implementation
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, MessageCircle, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ShareDialog } from "@/components/blog/share-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Web Accessibility for Beginners: Your Complete Getting Started Guide | Accessibility.build",
  description: "Learn web accessibility fundamentals, WCAG basics, and practical implementation tips. Perfect step-by-step guide for developers, designers, and content creators new to accessibility.",
  keywords: ["web accessibility for beginners", "accessibility basics", "WCAG for beginners", "accessible web design", "accessibility fundamentals", "inclusive design basics", "accessibility tutorial"],
}

export default function WebAccessibilityBeginnersPost() {
  const post = {
    title: "Web Accessibility for Beginners: Your Complete Getting Started Guide",
    description: "Learn web accessibility fundamentals, WCAG basics, and practical implementation tips. Perfect for developers, designers, and content creators new to accessibility.",
    date: "2024-01-12",
    author: "Alex Johnson",
    authorRole: "Accessibility Educator",
    tags: ["Beginners", "Fundamentals", "Guide"],
    readingTime: "8 min read",
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" />Back to Blog</Link>
          </Button>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-medium">{tag}</Badge>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            {post.description}
          </p>
        </div>
      </header>

      <div className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="w-full lg:w-3/4">
              <article className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="relative aspect-video bg-gradient-to-br from-green-500/20 to-blue-500/5 rounded-t-lg overflow-hidden flex items-center justify-center">
                  <div className="text-6xl font-bold text-green-500/30">♿</div>
                </div>

                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h2>What is Web Accessibility?</h2>
                    <p>Web accessibility means designing and developing websites that can be used by everyone, including people with disabilities. It ensures that all users can perceive, understand, navigate, and interact with web content effectively, regardless of their abilities or the technologies they use.</p>

                    <p>Think of web accessibility as building ramps alongside stairs - it provides alternative ways for everyone to access the same destination.</p>

                    <h2>Why Does Accessibility Matter?</h2>
                    <ul>
                      <li><strong>Inclusion:</strong> 1 in 4 adults in the US has a disability, representing 61 million people</li>
                      <li><strong>Legal compliance:</strong> Required by laws like ADA, Section 508, and international accessibility legislation</li>
                      <li><strong>Better user experience:</strong> Accessible design benefits everyone, not just people with disabilities</li>
                      <li><strong>SEO benefits:</strong> Many accessibility practices improve search engine rankings</li>
                      <li><strong>Market reach:</strong> Expands your potential audience and customer base</li>
                      <li><strong>Ethical responsibility:</strong> Creating inclusive digital experiences is the right thing to do</li>
                    </ul>

                    <h2>Understanding Different Types of Disabilities</h2>
                    <p>To create accessible websites, it's important to understand the different types of disabilities and how they affect web usage:</p>

                    <h3>Visual Disabilities</h3>
                    <ul>
                      <li><strong>Blindness:</strong> Cannot see content, relies on screen readers</li>
                      <li><strong>Low vision:</strong> Partial sight, may use magnification or high contrast</li>
                      <li><strong>Color blindness:</strong> Difficulty distinguishing certain colors</li>
                      <li><strong>Light sensitivity:</strong> Discomfort with bright lights or certain color combinations</li>
                    </ul>

                    <h3>Hearing Disabilities</h3>
                    <ul>
                      <li><strong>Deafness:</strong> Cannot hear audio content, needs captions or transcripts</li>
                      <li><strong>Hard of hearing:</strong> Partial hearing loss, benefits from captions and clear audio</li>
                      <li><strong>Auditory processing disorders:</strong> Difficulty processing audio information</li>
                    </ul>

                    <h3>Motor/Mobility Disabilities</h3>
                    <ul>
                      <li><strong>Limited fine motor control:</strong> Difficulty with precise mouse movements</li>
                      <li><strong>Inability to use a mouse:</strong> Relies on keyboard or alternative input devices</li>
                      <li><strong>Tremors or muscle weakness:</strong> May accidentally trigger interface elements</li>
                      <li><strong>Paralysis:</strong> May use specialized input devices or voice control</li>
                    </ul>

                    <h3>Cognitive Disabilities</h3>
                    <ul>
                      <li><strong>Learning disabilities:</strong> Difficulty processing or understanding information</li>
                      <li><strong>Memory issues:</strong> Trouble remembering information or steps in a process</li>
                      <li><strong>Attention disorders:</strong> Difficulty focusing or easily distracted by moving elements</li>
                      <li><strong>Executive function disorders:</strong> Challenges with planning and decision-making</li>
                    </ul>

                    <h2>Introduction to WCAG (Web Content Accessibility Guidelines)</h2>
                    <p>The Web Content Accessibility Guidelines (WCAG) provide the international standard for making web content accessible. WCAG 2.2 is the current version, organized around four fundamental principles:</p>

                    <h3>1. Perceivable</h3>
                    <p>Information and user interface components must be presentable to users in ways they can perceive.</p>
                    <ul>
                      <li><strong>Provide alternative text for images:</strong> Describe the content and function of images</li>
                      <li><strong>Ensure sufficient color contrast:</strong> Text must be readable against background colors</li>
                      <li><strong>Make content adaptable:</strong> Information should be available in different presentations</li>
                      <li><strong>Provide captions for videos:</strong> Include captions and transcripts for multimedia</li>
                    </ul>

                    <h3>2. Operable</h3>
                    <p>User interface components and navigation must be operable by all users.</p>
                    <ul>
                      <li><strong>Make all functionality keyboard accessible:</strong> Don't require a mouse</li>
                      <li><strong>Give users enough time:</strong> Don't use time limits unless necessary</li>
                      <li><strong>Don't cause seizures:</strong> Avoid flashing content that could trigger seizures</li>
                      <li><strong>Help users navigate:</strong> Provide clear navigation and ways to find content</li>
                    </ul>

                    <h3>3. Understandable</h3>
                    <p>Information and the operation of the user interface must be understandable.</p>
                    <ul>
                      <li><strong>Make text readable:</strong> Use clear language and define unusual words</li>
                      <li><strong>Make content predictable:</strong> Pages should behave consistently</li>
                      <li><strong>Help users avoid mistakes:</strong> Provide clear instructions and error messages</li>
                      <li><strong>Provide input assistance:</strong> Help users complete forms successfully</li>
                    </ul>

                    <h3>4. Robust</h3>
                    <p>Content must be robust enough to work with various assistive technologies.</p>
                    <ul>
                      <li><strong>Use valid, semantic HTML:</strong> Write clean, standards-compliant code</li>
                      <li><strong>Ensure compatibility:</strong> Test with different browsers and assistive technologies</li>
                      <li><strong>Future-proof your code:</strong> Use technologies that will remain accessible as they advance</li>
                    </ul>

                    <h2>WCAG Conformance Levels</h2>
                    <p>WCAG has three levels of conformance:</p>
                    <ul>
                      <li><strong>Level A:</strong> Basic accessibility features (minimum level)</li>
                      <li><strong>Level AA:</strong> Standard accessibility features (recommended for most websites)</li>
                      <li><strong>Level AAA:</strong> Enhanced accessibility features (required for specialized content)</li>
                    </ul>
                    <p>Most organizations aim for WCAG 2.2 Level AA compliance as it provides a good balance of accessibility and practical implementation.</p>

                    <h2>Getting Started: 10 Easy Accessibility Wins</h2>
                    <p>Here are 10 simple changes you can make today to improve your website's accessibility:</p>

                    <ol>
                      <li>
                        <strong>Add alt text to images:</strong><br/>
                        <code>&lt;img src="photo.jpg" alt="Team of five developers working together at a conference table"&gt;</code>
                      </li>
                      <li>
                        <strong>Use proper heading structure:</strong><br/>
                        Structure content with H1-H6 tags in hierarchical order (only one H1 per page)
                      </li>
                      <li>
                        <strong>Ensure color contrast:</strong><br/>
                        Use 4.5:1 ratio for normal text, 3:1 for large text (18pt+ or 14pt+ bold)
                      </li>
                      <li>
                        <strong>Label form fields properly:</strong><br/>
                        <code>&lt;label for="email"&gt;Email Address&lt;/label&gt;<br/>&lt;input type="email" id="email" required&gt;</code>
                      </li>
                      <li>
                        <strong>Make links descriptive:</strong><br/>
                        Instead of "click here," use "Download the 2024 accessibility report (PDF, 2MB)"
                      </li>
                      <li>
                        <strong>Add focus indicators:</strong><br/>
                        Show visual indication when elements receive keyboard focus
                      </li>
                      <li>
                        <strong>Test keyboard navigation:</strong><br/>
                        Use Tab, Shift+Tab, Enter, and arrow keys to navigate your site
                      </li>
                      <li>
                        <strong>Provide video captions:</strong><br/>
                        Include captions and transcripts for all video content
                      </li>
                      <li>
                        <strong>Use semantic HTML:</strong><br/>
                        Choose elements based on meaning (button, nav, main, article) not appearance
                      </li>
                      <li>
                        <strong>Test with screen readers:</strong><br/>
                        Try NVDA (free for Windows) or VoiceOver (built into Mac)
                      </li>
                    </ol>

                    <h2>Essential Tools for Beginners</h2>
                    <h3>Free Accessibility Testing Tools</h3>
                    <ul>
                      <li><strong>axe DevTools:</strong> Browser extension for automated accessibility testing</li>
                      <li><strong>WAVE:</strong> Web accessibility evaluation tool by WebAIM</li>
                      <li><strong>Lighthouse:</strong> Built into Chrome DevTools, includes accessibility audit</li>
                      <li><strong>Color Oracle:</strong> Color blindness simulator</li>
                      <li><strong>Contrast ratio checkers:</strong> Various online tools to test color contrast</li>
                    </ul>

                    <h3>Screen Reader Software</h3>
                    <ul>
                      <li><strong>NVDA (Windows):</strong> Free and powerful screen reader</li>
                      <li><strong>VoiceOver (Mac):</strong> Built into macOS and iOS</li>
                      <li><strong>JAWS (Windows):</strong> Professional screen reader (paid)</li>
                      <li><strong>TalkBack (Android):</strong> Built into Android devices</li>
                    </ul>

                    <h2>Common Accessibility Mistakes to Avoid</h2>
                    <ul>
                      <li><strong>Using placeholder text as labels:</strong> Placeholders disappear when users start typing</li>
                      <li><strong>Relying only on color:</strong> Don't use color alone to convey important information</li>
                      <li><strong>Creating keyboard traps:</strong> Ensure users can navigate away from all elements</li>
                      <li><strong>Using generic link text:</strong> "Click here" and "Read more" don't provide context</li>
                      <li><strong>Ignoring focus management:</strong> Properly manage focus when content changes dynamically</li>
                      <li><strong>Assuming automated testing is enough:</strong> Combine automated tools with manual testing</li>
                      <li><strong>Making custom components inaccessible:</strong> Ensure custom elements work with assistive technology</li>
                    </ul>

                    <h2>Building Your Accessibility Knowledge</h2>
                    <h3>Recommended Learning Resources</h3>
                    <ul>
                      <li><strong>Web Accessibility Initiative (WAI):</strong> Official WCAG documentation and tutorials</li>
                      <li><strong>The A11Y Project:</strong> Community-driven accessibility checklist and resources</li>
                      <li><strong>WebAIM:</strong> Practical accessibility guidance and training materials</li>
                      <li><strong>Deque University:</strong> Comprehensive accessibility training courses</li>
                      <li><strong>Accessibility.build:</strong> Practical tools and guides for implementing accessibility</li>
                    </ul>

                    <h3>Hands-On Practice Exercises</h3>
                    <ol>
                      <li><strong>Audit a website:</strong> Use axe DevTools to audit an existing website and identify issues</li>
                      <li><strong>Navigate with keyboard only:</strong> Try using a website using only Tab, Enter, and arrow keys</li>
                      <li><strong>Experience a screen reader:</strong> Browse with NVDA or VoiceOver for 10-15 minutes</li>
                      <li><strong>Check color contrast:</strong> Use our contrast checker tool on your current project</li>
                      <li><strong>Review form accessibility:</strong> Analyze the accessibility of forms on sites you use regularly</li>
                      <li><strong>Test mobile accessibility:</strong> Check how your site works with mobile screen readers</li>
                    </ol>

                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg my-8">
                      <h3 className="text-lg font-semibold mb-4">🚀 Start Your Accessibility Journey Today</h3>
                      <p>Ready to put these concepts into practice? Try our <Link href="/tools/accessibility-audit-helper" className="text-green-600 dark:text-green-400 hover:underline font-semibold">AI Accessibility Audit Helper</Link> to get personalized recommendations for improving your website's accessibility. It's perfect for beginners and provides step-by-step guidance.</p>
                    </div>

                    <h2>Creating an Accessibility Mindset</h2>
                    <p>True accessibility starts with changing how you think about design and development:</p>
                    <ul>
                      <li><strong>Consider accessibility from the start:</strong> Don't treat it as an afterthought</li>
                      <li><strong>Think about diverse users:</strong> Consider how different people might use your site</li>
                      <li><strong>Test early and often:</strong> Build accessibility testing into your workflow</li>
                      <li><strong>Learn from the community:</strong> Connect with disabled users and accessibility advocates</li>
                      <li><strong>Stay curious:</strong> Accessibility is an evolving field with ongoing innovations</li>
                    </ul>

                    <h2>Your Next Steps</h2>
                    <p>Now that you understand the basics, here's how to continue your accessibility journey:</p>
                    <ol>
                      <li><strong>Start with automated testing:</strong> Install axe DevTools and run it on your current projects</li>
                      <li><strong>Learn to use a screen reader:</strong> Spend time each week practicing with NVDA or VoiceOver</li>
                      <li><strong>Practice keyboard navigation:</strong> Make it a habit to test keyboard access on all projects</li>
                      <li><strong>Join accessibility communities:</strong> Follow accessibility experts and participate in discussions</li>
                      <li><strong>Make accessibility part of your process:</strong> Include accessibility considerations in planning and design</li>
                      <li><strong>Keep learning:</strong> Accessibility standards and best practices continue to evolve</li>
                    </ol>

                    <h2>Remember: Progress Over Perfection</h2>
                    <p>Accessibility is a journey, not a destination. You don't need to learn everything at once or achieve perfect accessibility immediately. Start with the basics, be consistent in your efforts, and gradually build your expertise.</p>

                    <p>Every small improvement makes a difference. By implementing even basic accessibility features, you're helping create a more inclusive web for everyone.</p>

                    <blockquote>
                      <p><strong>"The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect."</strong> - Tim Berners-Lee, W3C Director and inventor of the World Wide Web</p>
                    </blockquote>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Share this guide</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Help others get started with web accessibility</p>
                    </div>
                    <ShareDialog url="https://accessibility.build/blog/web-accessibility-for-beginners" title={post.title} description={post.description} />
                  </div>
                </div>
              </article>
            </div>

            <div className="w-full lg:w-1/4 mt-8 lg:mt-0">
              <div className="lg:sticky lg:top-8 space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border p-4">
                  <h3 className="font-semibold mb-3 text-sm">Beginner-Friendly Tools</h3>
                  <div className="space-y-2 text-xs">
                    <Link href="/tools/contrast-checker" className="block text-blue-600 hover:underline">🎨 Color Contrast Checker</Link>
                    <Link href="/tools/heading-analyzer" className="block text-blue-600 hover:underline">📋 Heading Structure Analyzer</Link>
                    <Link href="/tools/accessibility-audit-helper" className="block text-blue-600 hover:underline">🤖 AI Accessibility Audit</Link>
                    <Link href="/tools/alt-text-generator" className="block text-blue-600 hover:underline">🖼️ Alt Text Generator</Link>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border p-4">
                  <h3 className="font-semibold mb-3 text-sm">Quick Reference</h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong>WCAG Levels:</strong><br/>
                      A (Basic) → AA (Standard) → AAA (Enhanced)
                    </div>
                    <div>
                      <strong>Contrast Ratios:</strong><br/>
                      Normal text: 4.5:1<br/>
                      Large text: 3:1
                    </div>
                    <div>
                      <strong>Essential Testing:</strong><br/>
                      • Keyboard navigation<br/>
                      • Screen reader<br/>
                      • Color contrast<br/>
                      • Automated scan
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ShareDialog } from "@/components/blog/share-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mobile Accessibility Testing: Complete Guide for iOS and Android | Accessibility.build",
  description: "Learn mobile accessibility testing with TalkBack, VoiceOver, and Switch Control. Essential guide for mobile app and responsive web accessibility.",
  keywords: ["mobile accessibility testing", "TalkBack testing", "VoiceOver mobile", "mobile app accessibility", "responsive accessibility", "mobile WCAG"],
}

export default function MobileAccessibilityTestingPost() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/blog"><ArrowLeft className="mr-2 h-4 w-4" />Back to Blog</Link>
          </Button>
          
          <div className="flex gap-2 mb-4">
            <Badge variant="secondary">Mobile</Badge>
            <Badge variant="secondary">Testing</Badge>
            <Badge variant="secondary">TalkBack</Badge>
          </div>

          <h1 className="text-3xl font-bold mb-4">Mobile Accessibility Testing: Complete Guide for iOS and Android</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Learn mobile accessibility testing with TalkBack, VoiceOver, and Switch Control for mobile apps and responsive websites.</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <article className="bg-white dark:bg-gray-900 rounded-lg border p-8">
              <div className="prose prose-lg max-w-none">
                <h2>Why Mobile Accessibility Testing Matters</h2>
                <p>Over 60% of web traffic comes from mobile devices. Mobile accessibility testing ensures your apps and responsive websites work for users with disabilities on smartphones and tablets.</p>

                <h2>Mobile Accessibility Tools</h2>
                
                <h3>Android: TalkBack</h3>
                <ul>
                  <li><strong>Activation:</strong> Settings &gt; Accessibility &gt; TalkBack</li>
                  <li><strong>Navigation:</strong> Swipe right/left to move between elements</li>
                  <li><strong>Activation:</strong> Double-tap to activate</li>
                  <li><strong>Gestures:</strong> Two-finger scroll, explore by touch</li>
                </ul>

                <h3>iOS: VoiceOver</h3>
                <ul>
                  <li><strong>Activation:</strong> Settings &gt; Accessibility &gt; VoiceOver</li>
                  <li><strong>Quick toggle:</strong> Triple-click home button/side button</li>
                  <li><strong>Navigation:</strong> Swipe right/left between elements</li>
                  <li><strong>Rotor control:</strong> Two-finger rotation for navigation modes</li>
                </ul>

                <h3>Switch Control</h3>
                <ul>
                  <li>External switches or touch gestures</li>
                  <li>Automatic scanning or manual navigation</li>
                  <li>Essential for users with motor disabilities</li>
                </ul>

                <h2>Mobile-Specific Testing Areas</h2>
                
                <h3>Touch Targets</h3>
                <ul>
                  <li><strong>Minimum size:</strong> 44px x 44px (iOS), 48dp x 48dp (Android)</li>
                  <li><strong>Spacing:</strong> Adequate space between targets</li>
                  <li><strong>Testing:</strong> Try activating with thumb or assistive devices</li>
                </ul>

                <h3>Orientation and Zoom</h3>
                <ul>
                  <li><strong>Portrait/landscape:</strong> Content must work in both orientations</li>
                  <li><strong>Zoom support:</strong> Up to 200% without horizontal scrolling</li>
                  <li><strong>Reflow:</strong> Content adapts to different screen sizes</li>
                </ul>

                <h3>Gestures and Motion</h3>
                <ul>
                  <li><strong>Alternative access:</strong> Provide buttons for swipe gestures</li>
                  <li><strong>Motion sensitivity:</strong> Allow users to disable motion-triggered actions</li>
                  <li><strong>Drag and drop:</strong> Provide alternative interaction methods</li>
                </ul>

                <h2>Testing Checklist</h2>
                
                <h3>Screen Reader Testing</h3>
                <ul>
                  <li>✓ All content is announced clearly</li>
                  <li>✓ Navigation order is logical</li>
                  <li>✓ Custom components have proper labels</li>
                  <li>✓ State changes are announced</li>
                  <li>✓ Form errors are clearly communicated</li>
                </ul>

                <h3>Touch and Gesture Testing</h3>
                <ul>
                  <li>✓ All interactive elements are large enough</li>
                  <li>✓ Touch targets don't overlap</li>
                  <li>✓ Gestures have alternative access methods</li>
                  <li>✓ Drag operations can be completed with simple taps</li>
                </ul>

                <h3>Visual and Motor Testing</h3>
                <ul>
                  <li>✓ Content remains usable at 200% zoom</li>
                  <li>✓ Color contrast meets WCAG standards</li>
                  <li>✓ Focus indicators are visible</li>
                  <li>✓ Motion can be paused or disabled</li>
                </ul>

                <h2>Common Mobile Accessibility Issues</h2>
                <ul>
                  <li><strong>Tiny touch targets:</strong> Links and buttons too small</li>
                  <li><strong>Missing labels:</strong> Icons without accessible names</li>
                  <li><strong>Poor focus management:</strong> Focus lost during navigation</li>
                  <li><strong>Gesture-only interactions:</strong> No alternative access</li>
                  <li><strong>Auto-rotating content:</strong> Causes motion sickness</li>
                </ul>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg my-8">
                  <h3 className="text-lg font-semibold mb-4">📱 Test Your Mobile Site</h3>
                  <p>Use our <Link href="/tools/mobile-accessibility-checker" className="text-green-600 hover:underline font-semibold">Mobile Accessibility Checker</Link> to identify touch target sizes, gesture accessibility, and mobile-specific issues.</p>
                </div>

                <h2>Testing Best Practices</h2>
                <ol>
                  <li><strong>Test on real devices:</strong> Emulators don't fully replicate the experience</li>
                  <li><strong>Use actual assistive technology:</strong> Don't rely on keyboard-only testing</li>
                  <li><strong>Test different screen sizes:</strong> From small phones to large tablets</li>
                  <li><strong>Check both orientations:</strong> Portrait and landscape modes</li>
                  <li><strong>Involve real users:</strong> Get feedback from people who use assistive technology daily</li>
                </ol>

                <h2>Mobile-First Accessibility</h2>
                <ul>
                  <li>Design for touch interaction from the start</li>
                  <li>Consider one-handed use patterns</li>
                  <li>Plan for limited screen real estate</li>
                  <li>Optimize for slower networks and older devices</li>
                  <li>Test with assistive technology throughout development</li>
                </ul>

                <h2>Platform-Specific Guidelines</h2>
                
                <h3>iOS Accessibility</h3>
                <ul>
                  <li>Follow Apple's Human Interface Guidelines</li>
                  <li>Use semantic UI elements</li>
                  <li>Provide accessibility labels and hints</li>
                  <li>Support Dynamic Type for text scaling</li>
                </ul>

                <h3>Android Accessibility</h3>
                <ul>
                  <li>Follow Material Design accessibility principles</li>
                  <li>Use content descriptions for images</li>
                  <li>Ensure minimum touch target sizes</li>
                  <li>Support system accessibility settings</li>
                </ul>

                <h2>Conclusion</h2>
                <p>Mobile accessibility testing requires understanding touch interfaces, screen readers, and mobile-specific user needs. Regular testing with real devices and assistive technology ensures your mobile experiences are truly accessible.</p>
              </div>

              <div className="mt-8 pt-6 border-t">
                <ShareDialog url="https://accessibility.build/blog/mobile-accessibility-testing" title="Mobile Accessibility Testing: Complete Guide for iOS and Android" description="Learn mobile accessibility testing with TalkBack, VoiceOver, and Switch Control." />
              </div>
            </article>
          </div>

          <div className="lg:w-1/4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border p-4">
              <h3 className="font-semibold mb-3 text-sm">Mobile Testing Tools</h3>
              <div className="space-y-2 text-xs">
                <Link href="/tools/mobile-accessibility-checker" className="block text-blue-600 hover:underline">Mobile Accessibility Checker</Link>
                <div className="mt-4">
                  <strong>Quick Reference:</strong><br/>
                  • TalkBack: Android screen reader<br/>
                  • VoiceOver: iOS screen reader<br/>
                  • Min touch target: 44px x 44px<br/>
                  • Max zoom: 200% without h-scroll
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, MessageCircle, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ShareDialog } from "@/components/blog/share-dialog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Accessible Images and Alt Text: Complete Guide for Web Developers | Accessibility.build",
  description: "Master alt text writing, image accessibility, and WCAG compliance. Learn when to use alt text, how to write effective descriptions, and handle complex images with practical examples.",
  keywords: ["alt text", "image accessibility", "accessible images", "alt text best practices", "WCAG image compliance", "screen reader images", "image descriptions", "alt attribute"],
}

export default function AccessibleImagesPost() {
  const post = {
    title: "Accessible Images and Alt Text: Complete Guide for Web Developers",
    description: "Master alt text writing, image accessibility, and WCAG compliance. Learn when to use alt text, how to write effective descriptions, and handle complex images.",
    date: "2024-01-08",
    author: "Maya Rodriguez",
    authorRole: "UX Accessibility Specialist",
    tags: ["Images", "Alt Text", "WCAG"],
    readingTime: "10 min read",
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
                <div className="relative aspect-video bg-gradient-to-br from-orange-500/20 to-red-500/5 rounded-t-lg overflow-hidden flex items-center justify-center">
                  <div className="text-6xl font-bold text-orange-500/30">🖼️</div>
                </div>

                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h2>Why Image Accessibility Matters</h2>
                    <p>Images are everywhere on the web, but they can create significant barriers for users who are blind, have low vision, or use screen readers. Proper image accessibility ensures that visual content is available to everyone through alternative text descriptions.</p>

                    <p>According to WebAIM's screen reader survey, images without proper alt text are one of the most frustrating accessibility barriers for blind users. With over 1 billion images uploaded to the web daily, getting image accessibility right is crucial for an inclusive web.</p>

                    <h2>Understanding Different Types of Images</h2>
                    <p>Not all images require the same accessibility treatment. Understanding the different types helps you choose the right approach:</p>
                    
                    <h3>1. Informative Images</h3>
                    <p>Images that convey important information need descriptive alt text that captures the essential meaning.</p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
                      <pre className="text-sm"><code>{`<!-- Good: Descriptive alt text -->
<img src="sales-chart.png" 
     alt="Sales increased 25% from Q1 to Q2, reaching $50,000 in June">

<!-- Bad: Generic alt text -->
<img src="sales-chart.png" alt="Chart">`}</code></pre>
                    </div>

                    <h3>2. Decorative Images</h3>
                    <p>Purely decorative images should have empty alt attributes to hide them from screen readers.</p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
                      <pre className="text-sm"><code>{`<!-- Decorative image -->
<img src="decorative-border.png" alt="" role="presentation">

<!-- Using CSS for decorative images is even better -->
<div class="decorative-border"></div>`}</code></pre>
                    </div>

                    <h3>3. Functional Images</h3>
                    <p>Images that serve as links or buttons should describe their function, not their appearance.</p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
                      <pre className="text-sm"><code>{`<!-- Image button -->
<button>
  <img src="search-icon.svg" alt="Search">
</button>

<!-- Image link -->
<a href="/contact">
  <img src="phone-icon.svg" alt="Contact us">
</a>`}</code></pre>
                    </div>

                    <h3>4. Complex Images</h3>
                    <p>Charts, graphs, and diagrams need both concise alt text and detailed descriptions.</p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
                      <pre className="text-sm"><code>{`<!-- Complex image with description -->
<img src="quarterly-sales.png" 
     alt="Quarterly sales data showing steady growth"
     aria-describedby="chart-description">

<div id="chart-description">
  <h3>Quarterly Sales Data</h3>
  <p>Sales performance over four quarters:</p>
  <ul>
    <li>Q1 2023: $30,000 (20% increase from previous year)</li>
    <li>Q2 2023: $45,000 (50% increase from Q1)</li>
    <li>Q3 2023: $52,000 (15% increase from Q2)</li>
    <li>Q4 2023: $58,000 (12% increase from Q3)</li>
  </ul>
</div>`}</code></pre>
                    </div>

                    <h2>Writing Effective Alt Text</h2>
                    <p>Good alt text is an art that balances brevity with descriptiveness. Here's how to master it:</p>
                    
                    <h3>Alt Text Best Practices</h3>
                    <ul>
                      <li><strong>Be concise:</strong> Aim for 125 characters or less when possible</li>
                      <li><strong>Be specific:</strong> Describe what's actually in the image, not what you think it represents</li>
                      <li><strong>Consider context:</strong> Alt text should complement surrounding content, not repeat it</li>
                      <li><strong>Don't say "image of":</strong> Screen readers already announce it's an image</li>
                      <li><strong>Include text in images:</strong> If the image contains important text, include it in alt text</li>
                      <li><strong>Describe the mood when relevant:</strong> For artistic images, mood and style can be important</li>
                    </ul>

                    <h3>Alt Text Examples: Good vs Bad</h3>
                    <div className="space-y-4 my-6">
                      <div className="border rounded-lg p-4 bg-red-50 dark:bg-red-900/10">
                        <p><strong>Image:</strong> A golden retriever playing fetch in a sunny park</p>
                        <p className="text-red-600 dark:text-red-400"><strong>❌ Poor:</strong> "Dog"</p>
                        <p className="text-red-600 dark:text-red-400"><strong>❌ Too generic:</strong> "Image of a dog playing"</p>
                        <p className="text-green-600 dark:text-green-400"><strong>✅ Good:</strong> "Golden retriever catching a tennis ball in a sunny park"</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/10">
                        <p><strong>Image:</strong> Screenshot of a login form</p>
                        <p className="text-red-600 dark:text-red-400"><strong>❌ Poor:</strong> "Login screen"</p>
                        <p className="text-green-600 dark:text-green-400"><strong>✅ Good:</strong> "Login form with email and password fields and blue 'Sign In' button"</p>
                      </div>

                      <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/10">
                        <p><strong>Image:</strong> Company team photo</p>
                        <p className="text-red-600 dark:text-red-400"><strong>❌ Poor:</strong> "Team photo"</p>
                        <p className="text-green-600 dark:text-green-400"><strong>✅ Good:</strong> "Five team members smiling at camera in modern office conference room"</p>
                      </div>
                    </div>

                    <h2>Technical Implementation</h2>
                    
                    <h3>Basic HTML Implementation</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
                      <pre className="text-sm"><code>{`<!-- Standard image with alt text -->
<img src="product.jpg" 
     alt="Blue wireless headphones with adjustable headband and noise cancellation"
     width="300" 
     height="200">

<!-- Image with caption -->
<figure>
  <img src="team-retreat.jpg" 
       alt="Five team members hiking together on mountain trail">
  <figcaption>Our development team at the 2023 annual retreat</figcaption>
</figure>`}</code></pre>
                    </div>

                    <h3>Responsive Images</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
                      <pre className="text-sm"><code>{`<!-- Responsive image with alt text -->
<picture>
  <source media="(min-width: 800px)" srcset="large-hero.jpg">
  <source media="(min-width: 400px)" srcset="medium-hero.jpg">
  <img src="small-hero.jpg" 
       alt="Mountain landscape at sunrise with orange and purple sky reflecting in calm lake">
</picture>`}</code></pre>
                    </div>

                    <h3>CSS Background Images</h3>
                    <p>CSS background images are invisible to screen readers. If the image conveys important information, use HTML images instead or provide alternative content.</p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
                      <pre className="text-sm"><code>{`<!-- CSS background image with accessible alternative -->
<div class="hero-banner" 
     role="img" 
     aria-label="Snow-capped mountain peaks at sunset with village lights below">
  <h1>Welcome to Alpine Adventures</h1>
  <p>Discover breathtaking mountain experiences</p>
</div>

<style>
.hero-banner {
  background-image: url('mountain-sunset.jpg');
  background-size: cover;
  background-position: center;
}
</style>`}</code></pre>
                    </div>

                    <h2>Handling Special Cases</h2>
                    
                    <h3>Images with Text Overlays</h3>
                    <p>When images contain text, include that text in the alt attribute along with relevant visual context.</p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
                      <pre className="text-sm"><code>{`<!-- Image with text overlay -->
<img src="sale-banner.jpg" 
     alt="50% OFF SALE - Limited Time Offer - Shop Now - Bright red background with white text">`}</code></pre>
                    </div>

                    <h3>Image Galleries</h3>
                    <p>For image galleries, provide meaningful alt text for each image while avoiding repetition.</p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
                      <pre className="text-sm"><code>{`<!-- Image gallery with descriptive alt text -->
<div class="gallery" aria-label="Nature photography collection">
  <img src="sunset-lake.jpg" 
       alt="Golden sunset reflecting on calm lake with silhouetted pine trees">
  <img src="morning-dew.jpg" 
       alt="Close-up of water droplets on red tulip petals in morning light">
  <img src="mountain-peak.jpg" 
       alt="Snow-covered mountain peak against deep blue sky with wispy clouds">
</div>`}</code></pre>
                    </div>

                    <h3>Loading States and Error Handling</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
                      <pre className="text-sm"><code>{`<!-- Image with loading state and error handling -->
<img src="large-infographic.jpg" 
     alt="Complete guide to web accessibility - infographic showing 10 key principles"
     loading="lazy"
     onerror="this.alt='Image unavailable: Accessibility guide infographic'">`}</code></pre>
                    </div>

                    <h2>Testing Image Accessibility</h2>
                    
                    <h3>Automated Testing Tools</h3>
                    <ul>
                      <li><strong>axe DevTools:</strong> Identifies missing alt text and empty images</li>
                      <li><strong>WAVE:</strong> Shows alt text content and identifies accessibility issues</li>
                      <li><strong>Lighthouse:</strong> Audits image accessibility as part of overall accessibility score</li>
                      <li><strong>Alt Text Tester:</strong> Browser bookmarklet to display all alt text</li>
                    </ul>

                    <h3>Manual Testing Methods</h3>
                    <ul>
                      <li><strong>Turn off images:</strong> Disable images in your browser to see if content still makes sense</li>
                      <li><strong>Use a screen reader:</strong> Navigate with NVDA or VoiceOver to hear how images are announced</li>
                      <li><strong>Review in context:</strong> Check that alt text provides equivalent information to the visual</li>
                      <li><strong>Test with users:</strong> Get feedback from actual screen reader users when possible</li>
                    </ul>

                    <h2>Common Alt Text Mistakes</h2>
                    <ul>
                      <li><strong>Redundant descriptions:</strong> Don't repeat information already in surrounding text</li>
                      <li><strong>Keyword stuffing:</strong> Don't stuff keywords into alt text for SEO purposes</li>
                      <li><strong>Overly long descriptions:</strong> Keep alt text focused on essential information</li>
                      <li><strong>Missing alt attributes:</strong> Every img tag should have an alt attribute (empty if decorative)</li>
                      <li><strong>Filename as alt text:</strong> "IMG_1234.jpg" or "screenshot.png" are not helpful</li>
                      <li><strong>Generic descriptions:</strong> "Photo" or "Image" don't provide useful information</li>
                    </ul>

                    <h2>Advanced Techniques</h2>
                    
                    <h3>Using ARIA for Complex Images</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
                      <pre className="text-sm"><code>{`<!-- Complex infographic with detailed description -->
<img src="carbon-footprint-infographic.png" 
     alt="5 steps to reduce carbon footprint infographic"
     aria-describedby="infographic-details"
     role="img">

<div id="infographic-details">
  <h3>5 Steps to Reduce Your Carbon Footprint</h3>
  <ol>
    <li><strong>Transportation (45% reduction):</strong> Use public transit, bike, or walk instead of driving</li>
    <li><strong>Energy (30% reduction):</strong> Switch to renewable energy sources</li>
    <li><strong>Diet (15% reduction):</strong> Reduce meat consumption, especially beef</li>
    <li><strong>Shopping (8% reduction):</strong> Buy local, seasonal products</li>
    <li><strong>Waste (5% reduction):</strong> Recycle properly and reduce single-use items</li>
  </ol>
</div>`}</code></pre>
                    </div>

                    <h3>SVG Accessibility</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
                      <pre className="text-sm"><code>{`<!-- Accessible SVG with title and description -->
<svg role="img" aria-labelledby="chart-title" aria-describedby="chart-desc" width="400" height="300">
  <title id="chart-title">Monthly Website Traffic Trends</title>
  <desc id="chart-desc">
    Bar chart showing website traffic growth from 1,000 visitors in January 
    to 5,000 visitors in June, with steady monthly increases
  </desc>
  <!-- SVG chart content -->
  <rect x="0" y="250" width="50" height="50" fill="#3b82f6"/>
  <rect x="60" y="200" width="50" height="100" fill="#3b82f6"/>
  <!-- More chart elements -->
</svg>`}</code></pre>
                    </div>

                    <h3>Interactive Images</h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-4">
                      <pre className="text-sm"><code>{`<!-- Image map with accessible alternatives -->
<img src="office-floor-plan.jpg" 
     alt="Office floor plan with clickable room areas"
     usemap="#floor-plan">

<map name="floor-plan">
  <area shape="rect" coords="10,10,100,50" 
        href="/rooms/conference" 
        alt="Conference Room A - Seats 12 people">
  <area shape="rect" coords="10,60,100,100" 
        href="/rooms/kitchen" 
        alt="Kitchen and break area">
  <area shape="rect" coords="110,10,200,100" 
        href="/rooms/open-office" 
        alt="Open office workspace - 20 desks">
</map>`}</code></pre>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg my-8">
                      <h3 className="text-lg font-semibold mb-4">🎨 Need Help with Alt Text?</h3>
                      <p>Use our <Link href="/tools/alt-text-generator" className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">AI Alt Text Generator</Link> to create descriptive, accessible alt text for your images. Upload an image and get AI-powered suggestions that follow accessibility best practices and WCAG guidelines.</p>
                    </div>

                    <h2>Image Accessibility in Different Contexts</h2>
                    
                    <h3>E-commerce Product Images</h3>
                    <ul>
                      <li>Describe the product, color, style, and key features</li>
                      <li>Include size, material, or other relevant attributes</li>
                      <li>For multiple views, specify the angle or perspective</li>
                      <li>Example: "Black leather messenger bag with silver buckles and adjustable shoulder strap, front view"</li>
                    </ul>

                    <h3>Social Media and Marketing</h3>
                    <ul>
                      <li>Focus on the message or call-to-action</li>
                      <li>Include important text from the image</li>
                      <li>Describe the emotional tone when relevant</li>
                      <li>Keep brand voice in mind while maintaining accessibility</li>
                    </ul>

                    <h3>Educational Content</h3>
                    <ul>
                      <li>Focus on the learning objective</li>
                      <li>Describe relationships and processes shown</li>
                      <li>Include all text and labels</li>
                      <li>Consider providing detailed descriptions for complex diagrams</li>
                    </ul>

                    <h2>Alt Text and SEO</h2>
                    <p>While alt text is primarily for accessibility, it also benefits SEO:</p>
                    <ul>
                      <li><strong>Image search:</strong> Alt text helps images appear in relevant searches</li>
                      <li><strong>Context for crawlers:</strong> Search engines use alt text to understand image content</li>
                      <li><strong>User experience:</strong> Better accessibility leads to better user engagement</li>
                      <li><strong>Best practice:</strong> Write alt text for users first, SEO benefits will follow naturally</li>
                    </ul>

                    <h2>Conclusion</h2>
                    <p>Image accessibility is fundamental to creating an inclusive web. By understanding different types of images, writing effective alt text, and implementing proper HTML techniques, you ensure that visual content is available to all users.</p>

                    <p>Remember these key principles:</p>
                    <ul>
                      <li>Every image needs an alt attribute (even if empty)</li>
                      <li>Alt text should convey the same information as the image</li>
                      <li>Context matters - consider the surrounding content</li>
                      <li>Test with real users and assistive technologies</li>
                      <li>Accessibility and good SEO go hand in hand</li>
                    </ul>

                    <p>Good image accessibility isn't just about compliance—it's about creating equivalent experiences for all users and making the web more inclusive for everyone.</p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <ShareDialog url="https://accessibility.build/blog/accessible-images-alt-text" title={post.title} description={post.description} />
                  </div>
                </div>
              </article>
            </div>

            <div className="w-full lg:w-1/4 mt-8 lg:mt-0">
              <div className="lg:sticky lg:top-8 space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border p-4">
                  <h3 className="font-semibold mb-3 text-sm">Image Tools</h3>
                  <div className="space-y-2 text-xs">
                    <Link href="/tools/alt-text-generator" className="block text-blue-600 hover:underline">🤖 AI Alt Text Generator</Link>
                    <Link href="/tools/contrast-checker" className="block text-blue-600 hover:underline">🎨 Color Contrast Checker</Link>
                    <Link href="/tools/accessibility-audit-helper" className="block text-blue-600 hover:underline">🔍 Accessibility Audit Tool</Link>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border p-4">
                  <h3 className="font-semibold mb-3 text-sm">Quick Reference</h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong>Alt Text Length:</strong><br/>
                      Aim for 125 characters or less
                    </div>
                    <div>
                      <strong>Image Types:</strong><br/>
                      • Informative: Descriptive alt text<br/>
                      • Decorative: Empty alt=""<br/>
                      • Functional: Describe function<br/>
                      • Complex: Alt + description
                    </div>
                    <div>
                      <strong>Don't Include:</strong><br/>
                      • "Image of" or "Picture of"<br/>
                      • File names or extensions<br/>
                      • Redundant information
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

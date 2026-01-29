"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Keyboard,
  Link,
  Menu,
  SkipForward,
  Navigation,
  Code,
  ChevronRight,
  Hash,
  List,
  Check,
  X,
} from "lucide-react";
import WCAGBreadcrumb from "@/components/wcag/breadcrumb";
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements";
import WCAGRelatedContent from "@/components/wcag/related-content";

interface FocusEvent {
  element: string;
  timestamp: number;
  action: "focus" | "skip";
}

export default function WCAG241ClientPage() {
  const [showSkipLink, setShowSkipLink] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<string | null>(null);
  const [focusHistory, setFocusHistory] = useState<FocusEvent[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showBadExample, setShowBadExample] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [skipLinkVisible, setSkipLinkVisible] = useState(false);

  const skipLinkRef = useRef<HTMLAnchorElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);
  const navigationRef = useRef<HTMLElement>(null);

  const trackFocus = (element: string, action: "focus" | "skip" = "focus") => {
    const event: FocusEvent = {
      element,
      timestamp: Date.now(),
      action,
    };
    setFocusHistory((prev) => [...prev.slice(-9), event]);
    setCurrentFocus(element);
  };

  const handleSkipToContent = (e: React.MouseEvent) => {
    e.preventDefault();
    if (mainContentRef.current) {
      mainContentRef.current.focus();
      mainContentRef.current.scrollIntoView({ behavior: "smooth" });
      trackFocus("Main Content", "skip");
      setSkipLinkVisible(false);
    }
  };

  const handleSkipToNav = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigationRef.current) {
      navigationRef.current.focus();
      navigationRef.current.scrollIntoView({ behavior: "smooth" });
      trackFocus("Navigation", "skip");
      setSkipLinkVisible(false);
    }
  };

  const simulateKeyboardNavigation = () => {
    setIsNavigating(true);
    setFocusHistory([]);

    // Simulate tabbing through elements
    const elements = [
      "Skip to Content Link",
      "Logo",
      "Home Link",
      "About Link",
      "Services Link",
      "Contact Link",
      "Search Button",
      "Main Content",
      "Article Title",
      "Article Content",
      "Footer",
    ];

    elements.forEach((element, index) => {
      setTimeout(
        () => {
          trackFocus(element);
          if (index === elements.length - 1) {
            setIsNavigating(false);
          }
        },
        (index + 1) * 1000
      );
    });
  };

  const simulateSkipNavigation = () => {
    setIsNavigating(true);
    setFocusHistory([]);

    // Simulate using skip link
    const skipElements = [
      "Skip to Content Link",
      "Main Content",
      "Article Title",
      "Article Content",
      "Footer",
    ];

    skipElements.forEach((element, index) => {
      setTimeout(
        () => {
          trackFocus(element, index === 1 ? "skip" : "focus");
          if (index === skipElements.length - 1) {
            setIsNavigating(false);
          }
        },
        (index + 1) * 800
      );
    });
  };

  const clearFocusHistory = () => {
    setFocusHistory([]);
    setCurrentFocus(null);
  };

  const copyCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page with Skip Links</title>
    <style>
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        }
        .skip-link:focus {
            top: 6px;
        }
    </style>
</head>
<body>
    <!-- Skip Links -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <a href="#navigation" class="skip-link">Skip to navigation</a>
    
    <!-- Header -->
    <header>
        <h1>Website Title</h1>
        <nav id="navigation">
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <!-- Main Content -->
    <main id="main-content" tabindex="-1">
        <h2>Main Content Heading</h2>
        <p>This is the main content of the page...</p>
    </main>
    
    <!-- Footer -->
    <footer>
        <p>&copy; 2024 Company Name</p>
    </footer>
</body>
</html>`;

  const cssCode = `/* Skip Link Styles */
.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000000;
    color: #ffffff;
    padding: 8px 12px;
    text-decoration: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    z-index: 1000;
    transition: top 0.3s ease;
    border: 2px solid transparent;
}

.skip-link:focus {
    top: 6px;
    outline: 2px solid #ffffff;
    outline-offset: 2px;
}

.skip-link:hover {
    background: #333333;
    text-decoration: underline;
}

/* Multiple Skip Links */
.skip-links {
    position: absolute;
    top: -40px;
    left: 6px;
    z-index: 1000;
}

.skip-links a {
    display: block;
    margin-bottom: 4px;
    background: #000000;
    color: #ffffff;
    padding: 8px 12px;
    text-decoration: none;
    border-radius: 4px;
    font-size: 14px;
    transition: top 0.3s ease;
}

.skip-links a:focus {
    position: relative;
    top: 46px;
}

/* Ensure main content can receive focus */
main[tabindex="-1"] {
    outline: none;
}

main[tabindex="-1"]:focus {
    outline: 2px solid #0066cc;
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
}

/* Navigation styling */
nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 1rem;
}

nav a {
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #333;
    border-radius: 4px;
    transition: background-color 0.2s;
}

nav a:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
    background-color: #f0f0f0;
}`;

  const jsCode = `// Skip link functionality
document.addEventListener('DOMContentLoaded', function() {
    const skipLinks = document.querySelectorAll('[href^="#"]');
    
    skipLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Focus the target element
                targetElement.focus();
                
                // Scroll to the target element
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add to browser history
                history.pushState(null, null, this.getAttribute('href'));
                
                // Announce to screen readers
                const announcement = \`Skipped to \${targetElement.textContent || targetElement.getAttribute('aria-label') || 'content'}\`;
                announceToScreenReader(announcement);
            }
        });
    });
    
    // Make skip links visible on focus
    const skipLinkElements = document.querySelectorAll('.skip-link');
    skipLinkElements.forEach(link => {
        link.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        link.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
    });
});

// Screen reader announcement function
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Dynamic skip link creation
function createSkipLink(targetId, linkText) {
    const skipLink = document.createElement('a');
    skipLink.href = \`#\${targetId}\`;
    skipLink.className = 'skip-link';
    skipLink.textContent = linkText;
    
    // Insert at the beginning of the document
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    return skipLink;
}

// Example usage
// createSkipLink('main-content', 'Skip to main content');
// createSkipLink('navigation', 'Skip to navigation');`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <WCAGSEOEnhancements
        title="WCAG 2.4.1: Bypass Blocks"
        description="A mechanism is available to bypass blocks of content that are repeated on multiple Web pages."
        criteria="2.4.1"
        level="A"
        principle="Operable"
        guideline="2.4 Navigable"
        url="https://accessibility.build/wcag/2-4-1"
        category="Navigation"
      />
      <div className="max-w-6xl mx-auto">
        <div className="hidden sm:block">
          <WCAGBreadcrumb
            items={[
              { label: "Principle 2: Operable", href: "/wcag?filter=operable" },
              { label: "Guideline 2.4: Navigable" },
            ]}
            current="2.4.1 Bypass Blocks"
          />
        </div>
        <div className="hidden sm:block">
          {/* Skip Links Demo */}
          <div className="relative mb-8">
            <a
              ref={skipLinkRef}
              href="#main-content"
              className={`absolute left-4 bg-black text-white px-4 py-2 rounded-md font-medium z-50 transition-all duration-300 ${
                skipLinkVisible ? "top-4" : "-top-10"
              }`}
              onFocus={() => setSkipLinkVisible(true)}
              onBlur={() => setSkipLinkVisible(false)}
              onClick={handleSkipToContent}
            >
              Skip to main content
            </a>
            <a
              href="#navigation"
              className={`absolute left-4 bg-black text-white px-4 py-2 rounded-md font-medium z-50 transition-all duration-300 ${
                skipLinkVisible ? "top-16" : "-top-10"
              }`}
              onFocus={() => setSkipLinkVisible(true)}
              onBlur={() => setSkipLinkVisible(false)}
              onClick={handleSkipToNav}
            >
              Skip to navigation
            </a>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WCAG 2.4.1: Bypass Blocks
          </h1>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 font-semibold mb-4">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
            Level A
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A mechanism is available to bypass blocks of content that are
            repeated on multiple Web pages.
          </p>
        </div>

        {/* Interactive Skip Link Demo */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <SkipForward className="w-6 h-6 mr-2 text-blue-600" />
            Interactive Skip Link Demo
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Try the Skip Links Above
              </h3>
              <p className="text-gray-600 mb-4">
                Click in this area, then press Tab to see the skip links appear.
                Use Tab to navigate and Enter to activate the skip links.
              </p>

              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Instructions:
                </h4>
                <ol className="text-sm text-gray-700 space-y-1">
                  <li>1. Click anywhere in this section to focus</li>
                  <li>2. Press Tab to reveal the skip links</li>
                  <li>3. Use Enter to activate a skip link</li>
                  <li>4. Notice how you bypass repetitive content</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={simulateKeyboardNavigation}
                  disabled={isNavigating}
                  className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Keyboard className="w-4 h-4 mr-2" />
                  Simulate Without Skip Links
                </button>
                <button
                  onClick={simulateSkipNavigation}
                  disabled={isNavigating}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Simulate With Skip Links
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Focus Tracking
              </h3>
              <div className="border rounded-lg p-4 h-64 overflow-y-auto bg-gray-50">
                {focusHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No focus events yet. Try the simulation buttons!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {focusHistory.map((event, index) => (
                      <div
                        key={index}
                        className={`flex items-center text-sm p-2 rounded ${
                          event.action === "skip"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {event.action === "skip" ? (
                          <SkipForward className="w-4 h-4 mr-2" />
                        ) : (
                          <ArrowRight className="w-4 h-4 mr-2" />
                        )}
                        <span className="font-medium">{event.element}</span>
                        <span className="ml-auto text-xs opacity-70">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={clearFocusHistory}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                >
                  Clear History
                </button>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Skip action
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Regular focus
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Page Layout */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Navigation className="w-6 h-6 mr-2 text-blue-600" />
            Sample Page Layout
          </h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {/* Mock Header */}
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Website Header
                </h3>
                <div className="text-sm text-gray-600">Logo Area</div>
              </div>
            </div>

            {/* Mock Navigation */}
            <nav
              ref={navigationRef}
              tabIndex={-1}
              className="bg-blue-100 p-4 rounded-lg mb-4 focus:outline-2 focus:outline-blue-600"
              onFocus={() => trackFocus("Navigation")}
            >
              <h4 className="font-semibold text-blue-800 mb-2">
                Navigation Menu
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Home",
                  "About",
                  "Services",
                  "Products",
                  "Blog",
                  "Contact",
                ].map((item) => (
                  <button
                    key={item}
                    className="px-3 py-1 bg-blue-200 text-blue-800 rounded text-sm hover:bg-blue-300 focus:outline-2 focus:outline-blue-600"
                    onFocus={() => trackFocus(`${item} Link`)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </nav>

            {/* Mock Sidebar */}
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-yellow-100 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Sidebar</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Quick Links</li>
                  <li>• Recent Posts</li>
                  <li>• Categories</li>
                  <li>• Archives</li>
                </ul>
              </div>

              {/* Mock Main Content */}
              <main
                ref={mainContentRef}
                tabIndex={-1}
                className="md:col-span-3 bg-green-100 p-4 rounded-lg focus:outline-2 focus:outline-green-600"
                onFocus={() => trackFocus("Main Content")}
              >
                <h4 className="font-semibold text-green-800 mb-2">
                  Main Content Area
                </h4>
                <p className="text-sm text-green-700 mb-2">
                  This is where the main content of the page would be displayed.
                  Users can skip directly here using the skip link.
                </p>
                <div className="space-y-2">
                  <button
                    className="block w-full text-left px-2 py-1 bg-green-200 text-green-800 rounded text-sm hover:bg-green-300 focus:outline-2 focus:outline-green-600"
                    onFocus={() => trackFocus("Article Title")}
                  >
                    Article Title
                  </button>
                  <button
                    className="block w-full text-left px-2 py-1 bg-green-200 text-green-800 rounded text-sm hover:bg-green-300 focus:outline-2 focus:outline-green-600"
                    onFocus={() => trackFocus("Article Content")}
                  >
                    Article Content
                  </button>
                </div>
              </main>
            </div>

            {/* Mock Footer */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">Footer</h4>
                <button
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 focus:outline-2 focus:outline-gray-600"
                  onFocus={() => trackFocus("Footer")}
                >
                  Footer Links
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Good vs Bad Examples */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Good vs Bad Examples
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <Check className="w-5 h-5 mr-2" />✅ Good Example
              </h3>
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Link className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-green-800">Skip to main content</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Menu className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-green-800">Skip to navigation</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Hash className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-green-800">Skip to search</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-100 rounded text-sm">
                  <p className="font-medium text-green-900 mb-2">
                    Why this works:
                  </p>
                  <ul className="text-green-800 space-y-1">
                    <li>• Multiple skip options available</li>
                    <li>• Links are focusable and visible on focus</li>
                    <li>• Targets have proper focus management</li>
                    <li>• Reduces navigation burden</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                <X className="w-5 h-5 mr-2" />❌ Bad Example
              </h3>
              <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-red-600">
                    <span className="text-red-800">No skip links provided</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Menu className="w-4 h-4 mr-2 text-red-600" />
                    <span className="text-red-800">
                      Must tab through 20+ nav items
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <List className="w-4 h-4 mr-2 text-red-600" />
                    <span className="text-red-800">
                      Must navigate repeated content
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-red-100 rounded text-sm">
                  <p className="font-medium text-red-900 mb-2">
                    Why this fails:
                  </p>
                  <ul className="text-red-800 space-y-1">
                    <li>• No bypass mechanism provided</li>
                    <li>• Forces users to tab through repetitive content</li>
                    <li>• Frustrating for keyboard users</li>
                    <li>• Slows down navigation significantly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Examples */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-2 text-blue-600" />
            Implementation Examples
          </h2>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {showCode ? "Hide" : "Show"} Code Examples
            </button>
          </div>

          {showCode && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    HTML Structure
                  </h3>
                  <button
                    onClick={() => copyCode(htmlCode, "html")}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                  >
                    {copiedCode === "html" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{htmlCode}</code>
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    CSS Styles
                  </h3>
                  <button
                    onClick={() => copyCode(cssCode, "css")}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                  >
                    {copiedCode === "css" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{cssCode}</code>
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    JavaScript Enhancement
                  </h3>
                  <button
                    onClick={() => copyCode(jsCode, "js")}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                  >
                    {copiedCode === "js" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{jsCode}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Testing Methods */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Testing Methods
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Manual Testing
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Keyboard Navigation
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Tab through the page from the beginning</li>
                    <li>• Check if skip links appear on focus</li>
                    <li>• Verify skip links work correctly</li>
                    <li>• Test with screen readers</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Focus Management
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Verify target elements receive focus</li>
                    <li>• Check focus indicators are visible</li>
                    <li>• Test with different browsers</li>
                    <li>• Validate ARIA announcements</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Automated Testing
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    Accessibility Tools
                  </h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• axe-core DevTools extension</li>
                    <li>• WAVE Web Accessibility Evaluator</li>
                    <li>• Pa11y command line tool</li>
                    <li>• Lighthouse accessibility audit</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    Code Review
                  </h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Check for skip link implementation</li>
                    <li>• Verify proper href targets</li>
                    <li>• Validate tabindex usage</li>
                    <li>• Review CSS focus styles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Content */}
        <WCAGRelatedContent
          currentCriteria="2.4.1"
          title="Related WCAG Success Criteria & Resources"
        />
      </div>
    </div>
  );
}

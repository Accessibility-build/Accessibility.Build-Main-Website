"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Eye,
  Globe,
  Target,
  Code,
  Lightbulb,
  Star,
  TrendingUp,
} from "lucide-react";
import WCAGBreadcrumb from "@/components/wcag/breadcrumb";
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements";
import WCAGRelatedContent from "@/components/wcag/related-content";

interface TitleAnalysis {
  length: number;
  hasKeywords: boolean;
  isDescriptive: boolean;
  seoScore: number;
  issues: string[];
  suggestions: string[];
}

interface TitleExample {
  title: string;
  context: string;
  rating: "good" | "bad" | "ok";
  explanation: string;
}

export default function WCAG242ClientPage() {
  const [currentTitle, setCurrentTitle] = useState("");
  const [analysis, setAnalysis] = useState<TitleAnalysis | null>(null);
  const [showExamples, setShowExamples] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedExample, setSelectedExample] = useState<TitleExample | null>(
    null
  );
  const [liveDemo, setLiveDemo] = useState(false);
  const [originalTitle, setOriginalTitle] = useState("");

  useEffect(() => {
    // Store original title
    if (typeof window !== "undefined") {
      setOriginalTitle(document.title);
    }
  }, []);

  const analyzeTitle = (title: string): TitleAnalysis => {
    const length = title.length;
    const words = title.toLowerCase().split(/\s+/);

    // Check for keywords
    const commonKeywords = [
      "home",
      "about",
      "contact",
      "services",
      "products",
      "blog",
      "news",
      "help",
      "support",
    ];
    const hasKeywords = words.some((word) => commonKeywords.includes(word));

    // Check if descriptive
    const isDescriptive = length > 10 && words.length > 2;

    // Calculate SEO score
    let seoScore = 0;
    if (length >= 30 && length <= 60) seoScore += 30;
    else if (length >= 20 && length <= 70) seoScore += 20;
    else if (length >= 10 && length <= 80) seoScore += 10;

    if (isDescriptive) seoScore += 25;
    if (hasKeywords) seoScore += 20;
    if (words.length >= 3 && words.length <= 8) seoScore += 15;
    if (!title.includes("undefined") && !title.includes("null")) seoScore += 10;

    const issues: string[] = [];
    const suggestions: string[] = [];

    if (length < 10) {
      issues.push("Title is too short");
      suggestions.push(
        "Add more descriptive words to explain the page purpose"
      );
    }
    if (length > 60) {
      issues.push("Title may be too long for search results");
      suggestions.push(
        "Consider shortening to 30-60 characters for better SEO"
      );
    }
    if (!isDescriptive) {
      issues.push("Title is not descriptive enough");
      suggestions.push("Include specific information about the page content");
    }
    if (words.length < 2) {
      issues.push("Title should contain multiple words");
      suggestions.push("Use 3-8 words to create a meaningful title");
    }
    if (
      title.toLowerCase().includes("untitled") ||
      title.toLowerCase().includes("page")
    ) {
      issues.push("Generic title detected");
      suggestions.push("Replace generic terms with specific page description");
    }

    return {
      length,
      hasKeywords,
      isDescriptive,
      seoScore,
      issues,
      suggestions,
    };
  };

  const handleTitleChange = (title: string) => {
    setCurrentTitle(title);
    if (title.trim()) {
      setAnalysis(analyzeTitle(title));
    } else {
      setAnalysis(null);
    }
  };

  const applyLiveDemo = () => {
    if (typeof window !== "undefined" && currentTitle) {
      document.title = currentTitle;
      setLiveDemo(true);
      setTimeout(() => {
        document.title = originalTitle;
        setLiveDemo(false);
      }, 5000);
    }
  };

  const copyCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const titleExamples: TitleExample[] = [
    {
      title: "Contact Us - ABC Company Customer Support",
      context: "Contact page for a company",
      rating: "good",
      explanation:
        "Clearly identifies the page purpose and company name. Includes relevant keywords for search engines.",
    },
    {
      title: "Shopping Cart (3 items) - Online Store",
      context: "E-commerce cart page",
      rating: "good",
      explanation:
        "Descriptive title that includes current state (item count) and context. Very helpful for users.",
    },
    {
      title: "Article: How to Create Accessible Forms - Web Development Blog",
      context: "Blog post page",
      rating: "good",
      explanation:
        "Includes content type, specific topic, and site context. Perfect for both users and search engines.",
    },
    {
      title: "Error 404 - Page Not Found - Help Center",
      context: "Error page",
      rating: "good",
      explanation:
        "Clear error description with helpful context. Users immediately understand what happened.",
    },
    {
      title: "Page",
      context: "Any page",
      rating: "bad",
      explanation:
        "Generic title provides no information about page content or purpose. Completely unhelpful.",
    },
    {
      title: "Untitled Document",
      context: "Any page",
      rating: "bad",
      explanation:
        "Default title that hasn't been customized. Indicates lack of attention to accessibility.",
    },
    {
      title: "Welcome",
      context: "Homepage",
      rating: "bad",
      explanation:
        "Too vague and doesn't identify the website or company. Users won't know where they are.",
    },
    {
      title: "Form",
      context: "Registration form",
      rating: "bad",
      explanation:
        "Generic title doesn't specify what kind of form or its purpose. Not helpful for navigation.",
    },
    {
      title: "Home - Company Name",
      context: "Homepage",
      rating: "ok",
      explanation:
        "Identifies the page and company but could be more descriptive about what the company does.",
    },
    {
      title: "Products",
      context: "Product listing",
      rating: "ok",
      explanation:
        "Functional but could include company name and be more specific about the product category.",
    },
  ];

  const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Good page title examples -->
    <title>Contact Us - ABC Company Customer Support</title>
    <!-- OR -->
    <title>Shopping Cart (3 items) - Online Store</title>
    <!-- OR -->
    <title>Privacy Policy - Last Updated March 2024 - Company Name</title>
    
    <!-- Additional SEO meta tags -->
    <meta name="description" content="Page description that complements the title">
    <meta name="keywords" content="relevant, keywords, here">
    
    <!-- Open Graph for social media -->
    <meta property="og:title" content="Contact Us - ABC Company Customer Support">
    <meta property="og:description" content="Get in touch with our customer support team">
    
    <!-- Twitter Cards -->
    <meta name="twitter:title" content="Contact Us - ABC Company Customer Support">
    <meta name="twitter:description" content="Get in touch with our customer support team">
</head>
<body>
    <h1>Contact Us</h1>
    <p>This page title clearly identifies the purpose and company.</p>
</body>
</html>`;

  const jsCode = `// Dynamic title updates
function updatePageTitle(newTitle) {
    // Update the document title
    document.title = newTitle;
    
    // Also update Open Graph meta tags if present
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute('content', newTitle);
    }
    
    // Update Twitter meta tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
        twitterTitle.setAttribute('content', newTitle);
    }
}

// Update title based on page state
function updateCartTitle(itemCount) {
    const baseTitle = 'Shopping Cart';
    const siteName = 'Online Store';
    
    if (itemCount === 0) {
        updatePageTitle(\`\${baseTitle} (Empty) - \${siteName}\`);
    } else {
        updatePageTitle(\`\${baseTitle} (\${itemCount} items) - \${siteName}\`);
    }
}

// Update title for search results
function updateSearchTitle(query, resultCount) {
    const siteName = 'My Website';
    updatePageTitle(\`Search Results for "\${query}" (\${resultCount} results) - \${siteName}\`);
}

// Update title for form validation
function updateFormTitle(hasErrors) {
    const baseTitle = 'Contact Form';
    const siteName = 'Company Name';
    
    if (hasErrors) {
        updatePageTitle(\`\${baseTitle} - Please Fix Errors - \${siteName}\`);
    } else {
        updatePageTitle(\`\${baseTitle} - \${siteName}\`);
    }
}

// Title validation function
function validateTitle(title) {
    const issues = [];
    
    if (!title || title.trim() === '') {
        issues.push('Title is empty');
    }
    
    if (title.length < 10) {
        issues.push('Title is too short (minimum 10 characters recommended)');
    }
    
    if (title.length > 60) {
        issues.push('Title is too long (maximum 60 characters recommended for SEO)');
    }
    
    if (title.toLowerCase().includes('untitled') || 
        title.toLowerCase().includes('page') ||
        title.toLowerCase().includes('document')) {
        issues.push('Title contains generic terms');
    }
    
    return {
        isValid: issues.length === 0,
        issues: issues
    };
}

// Example usage
updateCartTitle(3);
updateSearchTitle('accessibility', 42);
updateFormTitle(false);

// Validate current title
const currentTitle = document.title;
const validation = validateTitle(currentTitle);
console.log('Title validation:', validation);`;

  const cssCode = `/* CSS for dynamic title indicators */
body {
    font-family: Arial, sans-serif;
}

/* Page state indicators that could be reflected in title */
.page-state {
    position: fixed;
    top: 10px;
    right: 10px;
    background: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
}

.page-state.loading::after {
    content: ' - Loading...';
}

.page-state.error::after {
    content: ' - Error';
    color: #ff6b6b;
}

.page-state.success::after {
    content: ' - Success';
    color: #51cf66;
}

/* Shopping cart example */
.cart-indicator {
    position: relative;
}

.cart-indicator::after {
    content: attr(data-count);
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ff4444;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
}

/* Form validation states */
.form-container.has-errors .form-title::before {
    content: '⚠️ ';
    color: #ff4444;
}

.form-container.submitted .form-title::before {
    content: '✓ ';
    color: #44ff44;
}

/* Screen reader announcements for title changes */
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

/* Responsive title length considerations */
@media (max-width: 768px) {
    /* Consider shorter titles for mobile */
    .mobile-title {
        font-size: 1.2em;
        line-height: 1.3;
    }
}

/* Print styles */
@media print {
    /* Ensure page title is visible in print */
    .page-title::after {
        content: ' (Page: ' attr(data-page-title) ')';
        font-size: 0.8em;
        color: #666;
    }
}`;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <WCAGSEOEnhancements
        title="WCAG 2.4.2: Page Titled"
        description="Web pages have titles that describe topic or purpose."
        criteria="2.4.2"
        level="A"
        principle="Operable"
        guideline="2.4 Navigable"
        url="https://accessibility.build/wcag/2-4-2"
        category="Navigation"
      />
      <div className="max-w-6xl mx-auto">
        <div className="hidden sm:block">
          <WCAGBreadcrumb
            items={[
              { label: "Principle 2: Operable", href: "/wcag?filter=operable" },
              { label: "Guideline 2.4: Navigable" },
            ]}
            current="2.4.2 Page Titled"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WCAG 2.4.2: Page Titled
          </h1>
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-800 font-semibold mb-4">
            <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
            Level A
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Web pages have titles that describe topic or purpose.
          </p>
        </div>

        {/* Interactive Title Analyzer */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-purple-600" />
            Interactive Title Analyzer
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter a page title to analyze:
              </label>
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Contact Us - ABC Company Customer Support"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {analysis && (
              <div className="grid md:grid-cols-2 gap-6">
                <div
                  className={`p-4 rounded-lg border-2 ${getScoreBackground(analysis.seoScore)}`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Analysis Results
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Length:</span>
                      <span
                        className={`font-medium ${
                          analysis.length >= 30 && analysis.length <= 60
                            ? "text-green-600"
                            : analysis.length >= 10 && analysis.length <= 80
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {analysis.length} characters
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Descriptive:
                      </span>
                      <span
                        className={`font-medium ${analysis.isDescriptive ? "text-green-600" : "text-red-600"}`}
                      >
                        {analysis.isDescriptive ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">SEO Score:</span>
                      <span
                        className={`font-bold ${getScoreColor(analysis.seoScore)}`}
                      >
                        {analysis.seoScore}/100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {analysis.issues.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Issues Found
                      </h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {analysis.issues.map((issue, index) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.suggestions.length > 0 && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Suggestions
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {analysis.suggestions.map((suggestion, index) => (
                          <li key={index}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={applyLiveDemo}
                disabled={!currentTitle || liveDemo}
                className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                {liveDemo ? "Demo Active (5s)" : "Try Live Demo"}
              </button>
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                {showExamples ? "Hide" : "Show"} Examples
              </button>
            </div>
          </div>
        </div>

        {/* Title Examples */}
        {showExamples && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-6 h-6 mr-2 text-purple-600" />
              Title Examples
            </h2>

            <div className="grid gap-4">
              {titleExamples.map((example, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    example.rating === "good"
                      ? "border-green-200 bg-green-50 hover:bg-green-100"
                      : example.rating === "bad"
                        ? "border-red-200 bg-red-50 hover:bg-red-100"
                        : "border-yellow-200 bg-yellow-50 hover:bg-yellow-100"
                  }`}
                  onClick={() =>
                    setSelectedExample(
                      selectedExample === example ? null : example
                    )
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {example.rating === "good" ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        ) : example.rating === "bad" ? (
                          <XCircle className="w-5 h-5 text-red-600 mr-2" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                        )}
                        <span className="font-medium text-gray-900">
                          "{example.title}"
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Context: {example.context}
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        example.rating === "good"
                          ? "bg-green-100 text-green-800"
                          : example.rating === "bad"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {example.rating.toUpperCase()}
                    </div>
                  </div>

                  {selectedExample === example && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-700">
                        <strong>Explanation:</strong> {example.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEO and Best Practices */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
            SEO and Best Practices
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Title Best Practices
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">✅ Do:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Keep titles 30-60 characters for SEO</li>
                    <li>• Include the page purpose or topic</li>
                    <li>• Add company/site name at the end</li>
                    <li>• Use keywords naturally</li>
                    <li>• Make each page title unique</li>
                    <li>• Update titles for dynamic content</li>
                  </ul>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">❌ Don't:</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Use generic titles like "Page" or "Home"</li>
                    <li>• Leave titles empty or use defaults</li>
                    <li>• Stuff keywords unnaturally</li>
                    <li>• Make titles too long (over 60 chars)</li>
                    <li>• Use the same title on multiple pages</li>
                    <li>• Include special characters excessively</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Dynamic Title Examples
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    E-commerce
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• "Shopping Cart (3 items) - Store Name"</li>
                    <li>• "Product Name - Category - Store Name"</li>
                    <li>• "Search Results for 'keyword' - Store Name"</li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    Applications
                  </h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• "Document Name - App Name"</li>
                    <li>• "Inbox (12 new) - Email App"</li>
                    <li>• "Settings - Privacy - App Name"</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    Content Sites
                  </h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• "Article Title - Author - Site Name"</li>
                    <li>• "Category Name - News Site"</li>
                    <li>• "Page 2 of Search Results - Site Name"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Examples */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-2 text-purple-600" />
            Implementation Examples
          </h2>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
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
                    JavaScript Implementation
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

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    CSS Enhancements
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
                    Browser Testing
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Check browser tab title</li>
                    <li>• Verify title appears in bookmarks</li>
                    <li>• Test title in search results</li>
                    <li>• Confirm title updates dynamically</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Screen Reader Testing
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Title is announced when page loads</li>
                    <li>• Title changes are announced</li>
                    <li>• Title provides context for page content</li>
                    <li>• Test with multiple screen readers</li>
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
                    SEO Tools
                  </h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Google Search Console</li>
                    <li>• SEO crawlers and analyzers</li>
                    <li>• Lighthouse SEO audit</li>
                    <li>• Meta tag validators</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    Accessibility Tools
                  </h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• axe-core DevTools extension</li>
                    <li>• WAVE Web Accessibility Evaluator</li>
                    <li>• Pa11y command line tool</li>
                    <li>• HTML validators</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Content */}
        <WCAGRelatedContent
          currentCriteria="2.4.2"
          title="Related WCAG Success Criteria & Resources"
        />
      </div>
    </div>
  );
}

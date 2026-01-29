"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Eye,
  Keyboard,
  MousePointer,
  Navigation,
  Code,
  Check,
  X,
  AlertCircle,
  Target,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import WCAGBreadcrumb from "@/components/wcag/breadcrumb";
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements";
import WCAGRelatedContent from "@/components/wcag/related-content";

interface FocusStep {
  id: string;
  element: string;
  order: number;
  timestamp: number;
  isLogical: boolean;
}

interface FocusableElement {
  id: string;
  label: string;
  tabIndex?: number;
  position: { x: number; y: number };
  isCorrect: boolean;
}

export default function WCAG243ClientPage() {
  const [focusHistory, setFocusHistory] = useState<FocusStep[]>([]);
  const [currentFocus, setCurrentFocus] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [showBadExample, setShowBadExample] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoNavigating, setIsAutoNavigating] = useState(false);

  const goodFormRef = useRef<HTMLFormElement>(null);
  const badFormRef = useRef<HTMLFormElement>(null);

  const trackFocus = (
    elementId: string,
    elementLabel: string,
    isLogical: boolean = true
  ) => {
    const step: FocusStep = {
      id: elementId,
      element: elementLabel,
      order: focusHistory.length + 1,
      timestamp: Date.now(),
      isLogical,
    };
    setFocusHistory((prev) => [...prev, step]);
    setCurrentFocus(elementId);
  };

  const clearFocusHistory = () => {
    setFocusHistory([]);
    setCurrentFocus(null);
    setCurrentStep(0);
  };

  const startAutoNavigation = (isGoodExample: boolean = true) => {
    setIsAutoNavigating(true);
    clearFocusHistory();

    const elements = isGoodExample
      ? [
          { id: "good-first-name", label: "First Name", logical: true },
          { id: "good-last-name", label: "Last Name", logical: true },
          { id: "good-email", label: "Email", logical: true },
          { id: "good-phone", label: "Phone", logical: true },
          { id: "good-message", label: "Message", logical: true },
          { id: "good-submit", label: "Submit Button", logical: true },
        ]
      : [
          { id: "bad-first-name", label: "First Name", logical: true },
          { id: "bad-submit", label: "Submit Button", logical: false },
          { id: "bad-last-name", label: "Last Name", logical: false },
          { id: "bad-message", label: "Message", logical: false },
          { id: "bad-email", label: "Email", logical: false },
          { id: "bad-phone", label: "Phone", logical: false },
        ];

    elements.forEach((element, index) => {
      setTimeout(
        () => {
          trackFocus(element.id, element.label, element.logical);
          setCurrentStep(index + 1);

          // Focus the actual element
          const el = document.getElementById(element.id);
          if (el) el.focus();

          if (index === elements.length - 1) {
            setIsAutoNavigating(false);
          }
        },
        (index + 1) * 1000
      );
    });
  };

  const copyCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const htmlCode = `<!-- Good Focus Order Example -->
<form class="logical-form">
    <h2>Contact Form - Logical Focus Order</h2>
    
    <!-- Fields follow logical reading order -->
    <div class="form-group">
        <label for="firstName">First Name *</label>
        <input type="text" id="firstName" name="firstName" required>
    </div>
    
    <div class="form-group">
        <label for="lastName">Last Name *</label>
        <input type="text" id="lastName" name="lastName" required>
    </div>
    
    <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" id="email" name="email" required>
    </div>
    
    <div class="form-group">
        <label for="phone">Phone</label>
        <input type="tel" id="phone" name="phone">
    </div>
    
    <div class="form-group">
        <label for="message">Message *</label>
        <textarea id="message" name="message" rows="4" required></textarea>
    </div>
    
    <!-- Submit button at the end -->
    <button type="submit">Submit Form</button>
</form>

<!-- Bad Focus Order Example -->
<form class="illogical-form">
    <h2>Contact Form - Poor Focus Order</h2>
    
    <!-- Submit button with tabindex forces it to be first -->
    <button type="submit" tabindex="1">Submit Form</button>
    
    <!-- Fields with custom tabindex values in wrong order -->
    <div class="form-group">
        <label for="firstName2">First Name *</label>
        <input type="text" id="firstName2" name="firstName2" tabindex="2" required>
    </div>
    
    <div class="form-group">
        <label for="lastName2">Last Name *</label>
        <input type="text" id="lastName2" name="lastName2" tabindex="5" required>
    </div>
    
    <div class="form-group">
        <label for="email2">Email *</label>
        <input type="email" id="email2" name="email2" tabindex="4" required>
    </div>
    
    <div class="form-group">
        <label for="phone2">Phone</label>
        <input type="tel" id="phone2" name="phone2" tabindex="6">
    </div>
    
    <div class="form-group">
        <label for="message2">Message *</label>
        <textarea id="message2" name="message2" rows="4" tabindex="3" required></textarea>
    </div>
</form>`;

  const cssCode = `/* Focus Order Styles */
.logical-form, .illogical-form {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
}

/* Enhanced focus indicators */
.form-group input:focus,
.form-group textarea:focus,
button:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
    border-color: #0066cc;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

/* Visual focus order indicators */
.focus-order-indicator {
    position: relative;
}

.focus-order-indicator::before {
    content: attr(data-focus-order);
    position: absolute;
    top: -10px;
    left: -10px;
    width: 20px;
    height: 20px;
    background: #0066cc;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    z-index: 10;
    opacity: 0;
    transition: opacity 0.3s;
}

.focus-order-indicator:focus::before {
    opacity: 1;
}

/* Good vs Bad visual indicators */
.logical-form {
    border-color: #28a745;
    background: #f8fff9;
}

.illogical-form {
    border-color: #dc3545;
    background: #fff5f5;
}

.logical-form h2 {
    color: #28a745;
}

.illogical-form h2 {
    color: #dc3545;
}

/* Focus tracking visualization */
.focus-path {
    position: absolute;
    pointer-events: none;
    z-index: 1;
}

.focus-path svg {
    width: 100%;
    height: 100%;
}

.focus-path line {
    stroke: #0066cc;
    stroke-width: 2;
    stroke-dasharray: 5,5;
    animation: dashMove 2s linear infinite;
}

@keyframes dashMove {
    0% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: 10; }
}

/* Skip links should not interfere with focus order */
.skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
}

.skip-link:focus {
    top: 6px;
}

/* Form validation states */
.form-group.error input,
.form-group.error textarea {
    border-color: #dc3545;
}

.form-group.error label {
    color: #dc3545;
}

.form-group.success input,
.form-group.success textarea {
    border-color: #28a745;
}

/* Mobile responsive focus indicators */
@media (max-width: 768px) {
    .focus-order-indicator::before {
        width: 24px;
        height: 24px;
        font-size: 14px;
    }
}`;

  const jsCode = `// Focus Order Management
class FocusOrderManager {
    constructor() {
        this.focusHistory = [];
        this.currentIndex = 0;
        this.isTracking = false;
    }
    
    // Track focus changes
    trackFocus(element, order) {
        if (this.isTracking) {
            this.focusHistory.push({
                element: element,
                order: order,
                timestamp: Date.now(),
                isLogical: this.isLogicalOrder(order)
            });
        }
    }
    
    // Check if focus order is logical
    isLogicalOrder(currentOrder) {
        if (this.focusHistory.length === 0) return true;
        
        const lastOrder = this.focusHistory[this.focusHistory.length - 1].order;
        return currentOrder === lastOrder + 1;
    }
    
    // Start tracking focus order
    startTracking() {
        this.isTracking = true;
        this.focusHistory = [];
        this.currentIndex = 0;
        
        // Add focus event listeners
        document.addEventListener('focusin', this.handleFocus.bind(this));
        document.addEventListener('focusout', this.handleBlur.bind(this));
    }
    
    // Stop tracking
    stopTracking() {
        this.isTracking = false;
        document.removeEventListener('focusin', this.handleFocus.bind(this));
        document.removeEventListener('focusout', this.handleBlur.bind(this));
    }
    
    // Handle focus events
    handleFocus(event) {
        const element = event.target;
        const order = this.getFocusOrder(element);
        
        this.trackFocus(element, order);
        this.highlightFocusPath(element);
    }
    
    // Handle blur events
    handleBlur(event) {
        this.clearFocusPath();
    }
    
    // Get focus order from tabindex or DOM position
    getFocusOrder(element) {
        const tabIndex = element.tabIndex;
        if (tabIndex > 0) return tabIndex;
        
        // Calculate DOM order for elements with tabindex 0 or no tabindex
        const focusableElements = this.getFocusableElements();
        return focusableElements.indexOf(element) + 1;
    }
    
    // Get all focusable elements
    getFocusableElements() {
        const selector = 'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';
        return Array.from(document.querySelectorAll(selector))
            .filter(el => !el.disabled && !el.hidden);
    }
    
    // Validate focus order
    validateFocusOrder() {
        const issues = [];
        
        // Check for positive tabindex values
        const positiveTabIndex = document.querySelectorAll('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])');
        if (positiveTabIndex.length > 0) {
            issues.push('Positive tabindex values can create confusing focus order');
        }
        
        // Check for missing focus indicators
        const focusableElements = this.getFocusableElements();
        focusableElements.forEach(el => {
            const style = window.getComputedStyle(el, ':focus');
            if (style.outline === 'none' && !style.boxShadow) {
                issues.push(\`Element \${el.tagName} lacks visible focus indicator\`);
            }
        });
        
        return {
            isValid: issues.length === 0,
            issues: issues
        };
    }
    
    // Highlight focus path
    highlightFocusPath(element) {
        // Remove existing highlights
        document.querySelectorAll('.focus-highlight').forEach(el => {
            el.classList.remove('focus-highlight');
        });
        
        // Add highlight to current element
        element.classList.add('focus-highlight');
        
        // Add focus order indicator
        const order = this.getFocusOrder(element);
        element.setAttribute('data-focus-order', order);
        element.classList.add('focus-order-indicator');
    }
    
    // Clear focus path
    clearFocusPath() {
        document.querySelectorAll('.focus-highlight').forEach(el => {
            el.classList.remove('focus-highlight');
            el.classList.remove('focus-order-indicator');
            el.removeAttribute('data-focus-order');
        });
    }
    
    // Get focus history report
    getFocusReport() {
        const logicalSteps = this.focusHistory.filter(step => step.isLogical).length;
        const totalSteps = this.focusHistory.length;
        
        return {
            totalSteps: totalSteps,
            logicalSteps: logicalSteps,
            logicalPercentage: totalSteps > 0 ? (logicalSteps / totalSteps) * 100 : 0,
            history: this.focusHistory
        };
    }
}

// Initialize focus order manager
const focusManager = new FocusOrderManager();

// Auto-fix focus order issues
function fixFocusOrder() {
    // Remove positive tabindex values
    document.querySelectorAll('[tabindex]:not([tabindex="0"]):not([tabindex="-1"])').forEach(el => {
        el.removeAttribute('tabindex');
    });
    
    // Add focus indicators where missing
    const focusableElements = focusManager.getFocusableElements();
    focusableElements.forEach(el => {
        const style = window.getComputedStyle(el, ':focus');
        if (style.outline === 'none' && !style.boxShadow) {
            el.style.outline = '2px solid #0066cc';
            el.style.outlineOffset = '2px';
        }
    });
}

// Example usage
focusManager.startTracking();

// Validate focus order on page load
document.addEventListener('DOMContentLoaded', () => {
    const validation = focusManager.validateFocusOrder();
    if (!validation.isValid) {
        console.warn('Focus order issues found:', validation.issues);
    }
});`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <WCAGSEOEnhancements
        title="WCAG 2.4.3: Focus Order"
        description="If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operability."
        criteria="2.4.3"
        level="A"
        principle="Operable"
        guideline="2.4 Navigable"
        url="https://accessibility.build/wcag/2-4-3"
        category="Navigation"
      />
      <div className="max-w-6xl mx-auto">
        <div className="hidden sm:block">
          <WCAGBreadcrumb
            items={[
              { label: "Principle 2: Operable", href: "/wcag?filter=operable" },
              { label: "Guideline 2.4: Navigable" },
            ]}
            current="2.4.3 Focus Order"
          />
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WCAG 2.4.3: Focus Order
          </h1>
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full text-emerald-800 font-semibold mb-4">
            <span className="w-2 h-2 bg-emerald-600 rounded-full mr-2"></span>
            Level A
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            If a Web page can be navigated sequentially and the navigation
            sequences affect meaning or operation, focusable components receive
            focus in an order that preserves meaning and operability.
          </p>
        </div>

        {/* Focus Order Tracker */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-emerald-600" />
            Focus Order Tracker
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Navigation History
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                {focusHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No focus events recorded yet. Try navigating the forms
                    below!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {focusHistory.map((step, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2 rounded text-sm ${
                          step.isLogical
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold mr-2">
                            {step.order}
                          </span>
                          <span>{step.element}</span>
                        </div>
                        {step.isLogical ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
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
                  Logical order
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Illogical order
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Auto Navigation Demo
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Simulate Tab Navigation
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Watch as the system automatically navigates through form
                    elements to demonstrate focus order.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startAutoNavigation(true)}
                      disabled={isAutoNavigating}
                      className="flex items-center px-3 py-1 text-sm bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded transition-colors"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Good Order
                    </button>
                    <button
                      onClick={() => startAutoNavigation(false)}
                      disabled={isAutoNavigating}
                      className="flex items-center px-3 py-1 text-sm bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded transition-colors"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Bad Order
                    </button>
                  </div>
                </div>

                {focusHistory.length > 0 && (
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Focus Order Summary
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Steps:</span>
                        <span className="font-medium">
                          {focusHistory.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Logical Steps:</span>
                        <span className="font-medium text-green-600">
                          {focusHistory.filter((step) => step.isLogical).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Illogical Steps:</span>
                        <span className="font-medium text-red-600">
                          {
                            focusHistory.filter((step) => !step.isLogical)
                              .length
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Form Examples */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Keyboard className="w-6 h-6 mr-2 text-emerald-600" />
            Interactive Form Examples
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Good Example */}
            <div>
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <Check className="w-5 h-5 mr-2" />✅ Good Focus Order
              </h3>
              <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                <form ref={goodFormRef} className="space-y-4">
                  <div>
                    <label
                      htmlFor="good-first-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="good-first-name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onFocus={() =>
                        trackFocus("good-first-name", "First Name", true)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="good-last-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="good-last-name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onFocus={() =>
                        trackFocus("good-last-name", "Last Name", true)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="good-email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="good-email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onFocus={() => trackFocus("good-email", "Email", true)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="good-phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="good-phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onFocus={() => trackFocus("good-phone", "Phone", true)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="good-message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message *
                    </label>
                    <textarea
                      id="good-message"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onFocus={() =>
                        trackFocus("good-message", "Message", true)
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    id="good-submit"
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    onFocus={() =>
                      trackFocus("good-submit", "Submit Button", true)
                    }
                  >
                    Submit Form
                  </button>
                </form>

                <div className="mt-4 p-3 bg-green-100 rounded text-sm">
                  <p className="font-medium text-green-900 mb-1">
                    Why this works:
                  </p>
                  <ul className="text-green-800 space-y-1">
                    <li>• Natural reading order (top to bottom)</li>
                    <li>• No custom tabindex values</li>
                    <li>• Submit button at the end</li>
                    <li>• Logical field progression</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bad Example */}
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
                <X className="w-5 h-5 mr-2" />❌ Poor Focus Order
              </h3>
              <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg">
                <form ref={badFormRef} className="space-y-4">
                  <div>
                    <label
                      htmlFor="bad-first-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="bad-first-name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      onFocus={() =>
                        trackFocus("bad-first-name", "First Name", true)
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    id="bad-submit"
                    tabIndex={1}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    onFocus={() =>
                      trackFocus("bad-submit", "Submit Button", false)
                    }
                  >
                    Submit Form (tabindex=1)
                  </button>

                  <div>
                    <label
                      htmlFor="bad-last-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="bad-last-name"
                      tabIndex={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      onFocus={() =>
                        trackFocus("bad-last-name", "Last Name", false)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bad-message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message *
                    </label>
                    <textarea
                      id="bad-message"
                      tabIndex={3}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      onFocus={() =>
                        trackFocus("bad-message", "Message", false)
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bad-email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="bad-email"
                      tabIndex={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      onFocus={() => trackFocus("bad-email", "Email", false)}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bad-phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="bad-phone"
                      tabIndex={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      onFocus={() => trackFocus("bad-phone", "Phone", false)}
                    />
                  </div>
                </form>

                <div className="mt-4 p-3 bg-red-100 rounded text-sm">
                  <p className="font-medium text-red-900 mb-1">
                    Why this fails:
                  </p>
                  <ul className="text-red-800 space-y-1">
                    <li>• Submit button focused first (tabindex=1)</li>
                    <li>• Random tabindex values disrupt flow</li>
                    <li>• Fields not in logical order</li>
                    <li>• Confusing for keyboard users</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Test Instructions
            </h4>
            <p className="text-sm text-blue-800 mb-2">
              Try navigating through both forms using the Tab key. Notice how
              the good example follows a logical flow, while the bad example
              jumps around confusingly.
            </p>
            <p className="text-sm text-blue-800">
              The focus tracker above will show you the exact order and
              highlight any illogical jumps in red.
            </p>
          </div>
        </div>

        {/* Implementation Examples */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="w-6 h-6 mr-2 text-emerald-600" />
            Implementation Examples
          </h2>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
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
                    JavaScript Management
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
                    <li>• Tab through entire page sequentially</li>
                    <li>• Verify focus follows logical reading order</li>
                    <li>• Check that focus is always visible</li>
                    <li>• Test with screen readers</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Visual Inspection
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Check for positive tabindex values</li>
                    <li>• Verify DOM order matches visual order</li>
                    <li>• Look for focus indicators</li>
                    <li>• Test different screen sizes</li>
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
                    <li>• Lighthouse accessibility audit</li>
                    <li>• Tab order bookmarklet</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    Code Review
                  </h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Search for positive tabindex values</li>
                    <li>• Check DOM structure order</li>
                    <li>• Validate focus management scripts</li>
                    <li>• Review CSS that affects layout</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Content */}
        <WCAGRelatedContent
          currentCriteria="2.4.3"
          title="Related WCAG Success Criteria & Resources"
        />
      </div>
    </div>
  );
}

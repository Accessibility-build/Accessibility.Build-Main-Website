"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Square,
  AlertTriangle,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";
import WCAGBreadcrumb from "@/components/wcag/breadcrumb";
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements";
import WCAGRelatedContent from "@/components/wcag/related-content";

export default function WCAG231ClientPage() {
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashCount, setFlashCount] = useState(0);
  const [flashRate, setFlashRate] = useState(2); // flashes per second
  const [elapsedTime, setElapsedTime] = useState(0);
  const [warningAccepted, setWarningAccepted] = useState(false);
  const [showBadExample, setShowBadExample] = useState(false);
  const [badFlashCount, setBadFlashCount] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const flashInterval = useRef<NodeJS.Timeout | null>(null);
  const timeInterval = useRef<NodeJS.Timeout | null>(null);
  const badFlashInterval = useRef<NodeJS.Timeout | null>(null);
  const badFlashElement = useRef<HTMLDivElement>(null);

  const startFlashing = () => {
    if (!warningAccepted) return;

    setIsFlashing(true);
    setFlashCount(0);
    setElapsedTime(0);

    // Start the flash interval
    flashInterval.current = setInterval(() => {
      setFlashCount((prev) => prev + 1);
    }, 1000 / flashRate);

    // Start the time counter
    timeInterval.current = setInterval(() => {
      setElapsedTime((prev) => prev + 0.1);
    }, 100);
  };

  const stopFlashing = () => {
    setIsFlashing(false);
    if (flashInterval.current) {
      clearInterval(flashInterval.current);
    }
    if (timeInterval.current) {
      clearInterval(timeInterval.current);
    }
  };

  const resetDemo = () => {
    stopFlashing();
    setFlashCount(0);
    setElapsedTime(0);
  };

  const startBadExample = () => {
    if (!warningAccepted) return;

    setShowBadExample(true);
    setBadFlashCount(0);

    // Create rapid flashing effect (dangerous - 5 flashes per second)
    badFlashInterval.current = setInterval(() => {
      setBadFlashCount((prev) => prev + 1);
      if (badFlashElement.current) {
        badFlashElement.current.style.backgroundColor =
          badFlashElement.current.style.backgroundColor === "rgb(255, 0, 0)"
            ? "rgb(255, 255, 255)"
            : "rgb(255, 0, 0)";
      }
    }, 200); // 5 flashes per second

    // Auto-stop after 3 seconds for safety
    setTimeout(() => {
      stopBadExample();
    }, 3000);
  };

  const stopBadExample = () => {
    setShowBadExample(false);
    if (badFlashInterval.current) {
      clearInterval(badFlashInterval.current);
    }
    if (badFlashElement.current) {
      badFlashElement.current.style.backgroundColor = "rgb(255, 255, 255)";
    }
  };

  const copyCode = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  useEffect(() => {
    return () => {
      if (flashInterval.current) clearInterval(flashInterval.current);
      if (timeInterval.current) clearInterval(timeInterval.current);
      if (badFlashInterval.current) clearInterval(badFlashInterval.current);
    };
  }, []);

  const htmlCode = `<!-- Safe flashing implementation -->
<div class="flash-container" id="flashDemo">
  <div class="flash-content">
    <h3>Flash Demo - Safe Rate</h3>
    <p>Flashing at 2 Hz (2 flashes per second)</p>
  </div>
</div>

<div class="flash-controls">
  <button onclick="startSafeFlash()">Start Safe Flash</button>
  <button onclick="stopFlash()">Stop Flash</button>
  <div class="flash-counter">
    Flash Count: <span id="flashCount">0</span>
  </div>
</div>`;

  const cssCode = `.flash-container {
  width: 300px;
  height: 200px;
  border: 2px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  background-color: white;
  transition: background-color 0.1s ease;
}

.flash-safe {
  animation: safeFlash 0.5s infinite;
}

@keyframes safeFlash {
  0%, 100% { background-color: white; }
  50% { background-color: #e3f2fd; }
}

.flash-controls {
  margin: 20px 0;
  display: flex;
  gap: 10px;
  align-items: center;
}

.flash-counter {
  font-weight: bold;
  color: #1976d2;
}

/* Warning for unsafe content */
.flash-warning {
  background-color: #fff3e0;
  border: 2px solid #ff9800;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}`;

  const jsCode = `let flashInterval;
let flashCount = 0;
const maxSafeFlashRate = 3; // Maximum 3 flashes per second

function startSafeFlash() {
  const flashElement = document.getElementById('flashDemo');
  const flashCounter = document.getElementById('flashCount');
  
  // Ensure we don't exceed safe flash rate
  const flashRate = 2; // 2 flashes per second (safe)
  
  flashCount = 0;
  flashCounter.textContent = flashCount;
  
  flashInterval = setInterval(() => {
    flashCount++;
    flashCounter.textContent = flashCount;
    
    // Toggle flash effect
    flashElement.classList.toggle('flash-safe');
    
    // Check if we're within safe limits
    if (flashCount >= 21) { // 3 flashes per second for 7 seconds max
      stopFlash();
      alert('Flash sequence completed safely');
    }
  }, 500); // 500ms = 2 flashes per second
}

function stopFlash() {
  if (flashInterval) {
    clearInterval(flashInterval);
    flashInterval = null;
  }
  
  const flashElement = document.getElementById('flashDemo');
  flashElement.classList.remove('flash-safe');
  flashCount = 0;
  document.getElementById('flashCount').textContent = flashCount;
}

// Flash detection function
function detectFlashRate(element, duration = 1000) {
  const observer = new MutationObserver((mutations) => {
    // Count style changes that might indicate flashing
    const styleChanges = mutations.filter(m => 
      m.type === 'attributes' && m.attributeName === 'style'
    );
    
    if (styleChanges.length > 3) {
      console.warn('Potential unsafe flash rate detected');
    }
  });
  
  observer.observe(element, {
    attributes: true,
    attributeFilter: ['style', 'class']
  });
  
  setTimeout(() => observer.disconnect(), duration);
}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <WCAGSEOEnhancements
        title="WCAG 2.3.1: Three Flashes or Below Threshold"
        description="Web pages must not contain anything that flashes more than three times in any one second period, or the flash is below the general flash and red flash thresholds."
        criteria="2.3.1"
        level="A"
        principle="Perceivable"
        guideline="2.3 Seizures and Physical Reactions"
        url="https://accessibilitybuild.com/wcag/2-3-1"
        category="Seizures and Physical Reactions"
      />
      <div className="max-w-6xl mx-auto">
        <div className="hidden sm:block">
        <WCAGBreadcrumb
          items={[
            { label: "Principle 2: Operable", href: "/wcag?filter=operable" },
            { label: "Guideline 2.3: Seizures and Physical Reactions" },
          ]}
          current="2.3.1 Three Flashes or Below Threshold"
        />
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WCAG 2.3.1: Three Flashes or Below Threshold
          </h1>
          <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-800 font-semibold mb-4">
            <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
            Level A
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Web pages must not contain anything that flashes more than three
            times in any one second period, or the flash is below the general
            flash and red flash thresholds.
          </p>
        </div>

        {/* Safety Warning */}
        {!warningAccepted && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="w-8 h-8 text-red-600 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  ⚠️ Photosensitive Epilepsy Warning
                </h3>
                <p className="text-red-700 mb-4">
                  This demonstration includes flashing content that may
                  potentially trigger seizures in individuals with
                  photosensitive epilepsy. The examples are designed to be
                  educational and stay within safe limits, but please use
                  caution.
                </p>
                <p className="text-red-700 mb-4">
                  If you have a history of seizures or photosensitive epilepsy,
                  please skip the interactive demos.
                </p>
                <button
                  onClick={() => setWarningAccepted(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  I Understand - Continue to Demo
                </button>
              </div>
            </div>
          </div>
        )}

        {warningAccepted && (
          <>
            {/* Interactive Flash Demo */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-orange-600" />
                Interactive Flash Detection Demo
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Safe Flash Demo */}
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-4">
                    ✅ Safe Flash Rate (2 Hz)
                  </h3>
                  <div
                    className={`w-full h-48 border-2 border-gray-300 rounded-lg flex items-center justify-center text-center transition-all duration-100 ${
                      isFlashing && flashCount % 2 === 0
                        ? "bg-orange-100"
                        : "bg-white"
                    }`}
                  >
                    <div>
                      <div className="text-2xl font-bold text-gray-700 mb-2">
                        Safe Flash Demo
                      </div>
                      <div className="text-sm text-gray-600">
                        Rate: {flashRate} flashes/second
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Flash Count:
                      </span>
                      <span className="text-lg font-bold text-orange-600">
                        {flashCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Elapsed Time:
                      </span>
                      <span className="text-lg font-bold text-orange-600">
                        {elapsedTime.toFixed(1)}s
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Rate:
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {elapsedTime > 0
                          ? (flashCount / elapsedTime).toFixed(1)
                          : 0}{" "}
                        Hz
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={startFlashing}
                      disabled={isFlashing}
                      className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Safe Flash
                    </button>
                    <button
                      onClick={stopFlashing}
                      disabled={!isFlashing}
                      className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Stop
                    </button>
                    <button
                      onClick={resetDemo}
                      className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </button>
                  </div>
                </div>

                {/* Flash Rate Control */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Flash Rate Control
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Flash Rate: {flashRate} Hz
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.5"
                        value={flashRate}
                        onChange={(e) => setFlashRate(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        disabled={isFlashing}
                      />
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>1 Hz (Safe)</span>
                        <span>2 Hz (Safe)</span>
                        <span>3 Hz (Limit)</span>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Safety Guidelines:
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Maximum 3 flashes per second</li>
                        <li>• Avoid red flashes above 25 Hz</li>
                        <li>• Consider flash size and brightness</li>
                        <li>• Provide user controls to stop flashing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bad Example Warning */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <EyeOff className="w-6 h-6 mr-2 text-red-600" />
                Unsafe Flash Example (Educational Only)
              </h2>

              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-medium mb-2">
                      ⚠️ This example demonstrates unsafe flashing that violates
                      WCAG 2.3.1
                    </p>
                    <p className="text-red-700 text-sm">
                      Limited to 3 seconds duration for safety. This rate (5 Hz)
                      could trigger seizures.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-4">
                    ❌ Unsafe Flash Rate (5 Hz)
                  </h3>
                  <div
                    ref={badFlashElement}
                    className="w-full h-48 border-2 border-red-300 rounded-lg flex items-center justify-center text-center"
                    style={{ backgroundColor: "rgb(255, 255, 255)" }}
                  >
                    <div>
                      <div className="text-2xl font-bold text-gray-700 mb-2">
                        UNSAFE Example
                      </div>
                      <div className="text-sm text-red-600">
                        Rate: 5 flashes/second (DANGEROUS)
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Flash Count:
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        {badFlashCount}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={startBadExample}
                      disabled={showBadExample}
                      className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Unsafe Flash (3s only)
                    </button>
                    <button
                      onClick={stopBadExample}
                      className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Why This Fails
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">
                        Violations:
                      </h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Exceeds 3 flashes per second (5 Hz)</li>
                        <li>• High contrast flashing (red/white)</li>
                        <li>• No user control to prevent flashing</li>
                        <li>• Could trigger photosensitive seizures</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Impact:
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Affects 1 in 4,000 people</li>
                        <li>• Can cause seizures</li>
                        <li>• Legal liability issues</li>
                        <li>• Excludes users with photosensitive epilepsy</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Implementation Examples */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Implementation Examples
          </h2>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
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
                    Visual Inspection
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Count flashes per second</li>
                    <li>• Check for red flashing content</li>
                    <li>• Verify user controls exist</li>
                    <li>• Test auto-playing content</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Timing Analysis
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Use video analysis tools</li>
                    <li>• Count frames in video content</li>
                    <li>• Measure animation intervals</li>
                    <li>• Check CSS animation duration</li>
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
                    Tools & Scripts
                  </h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• PEAT (Photosensitive Epilepsy Analysis Tool)</li>
                    <li>• Browser developer tools</li>
                    <li>• Custom JavaScript counters</li>
                    <li>• Video analysis software</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    Code Review
                  </h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Check animation intervals</li>
                    <li>• Review CSS keyframes</li>
                    <li>• Validate JavaScript timers</li>
                    <li>• Audit video content</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Content */}
        <WCAGRelatedContent
          currentCriteria="2.3.1"
          title="Related WCAG Success Criteria & Resources"
        />
      </div>
    </div>
  );
}

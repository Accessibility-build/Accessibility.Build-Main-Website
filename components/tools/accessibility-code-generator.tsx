"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code,
  Copy,
  Download,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Zap,
  Eye,
  Hand,
  Layers,
  Keyboard,
  FileCode,
  Braces,
} from "lucide-react";
import {
  hasUnlimitedAccess,
  getUnlimitedAccessRemainingTime,
  formatRemainingTime,
} from "@/lib/unlimited-access";

/**
 * Types describing the AI / backend output
 * This is defensive and maps to the strict JSON schema your backend enforces.
 */
type DetailedAnalysis = {
  code_breakdown: string;
  accessibility_context: string;
  real_world_example: string;
};

type ImplementationExamples = {
  basic_usage: string;
  advanced_usage: string;
  full_integration: string;
};

type ApiResponse = {
  code?: string; // generic code field
  detailed_code_analysis?: DetailedAnalysis;
  implementation_examples?: ImplementationExamples;
  implementation_summary?: string[];
  accessibility_features?: string[];
  wcag_compliances?: string[];
  testing_guide?: string[];
  best_practices?: string[];
  common_mistakes_to_avoid?: string[];
  enhancement_suggestions?: string[];
  creditsUsed?: number;
  remainingCredits?: number;
  trialStatus?: {
    usageCount: number;
    remainingUses: number;
    limitReached: boolean;
  };
};

/**
 * UI mapping shape used by the component
 */
type GeneratedCode = {
  code: string;
  examples: ImplementationExamples;
  detailedAnalysis: DetailedAnalysis;
  accessibility: {
    features: string[];
    wcagCompliance: string[];
    testing: string[];
    common_mistakes_to_avoid: string[];
    enhancement_suggestions: string[];
    implementation: string[];
    bestPractices: string[];
  };
  creditsUsed?: number;
  remainingCredits?: number;
  trialStatus?: ApiResponse["trialStatus"];
};

/**
 * Static pickers for the UI
 */
const componentTypes = [
  {
    value: "button",
    label: "Button",
    description: "Interactive button with focus states",
  },
  {
    value: "form",
    label: "Form",
    description: "Accessible form with validation",
  },
  {
    value: "modal",
    label: "Modal/Dialog",
    description: "Accessible modal with focus management",
  },
  {
    value: "navigation",
    label: "Navigation",
    description: "Accessible navigation menu",
  },
  {
    value: "tabs",
    label: "Tabs",
    description: "Tab interface with keyboard navigation",
  },
  {
    value: "carousel",
    label: "Carousel",
    description: "Image carousel with controls",
  },
];

const frameworks = [
  { value: "html", label: "HTML/CSS", icon: "🌐" },
  { value: "react", label: "React", icon: "⚛️" },
  { value: "vue", label: "Vue.js", icon: "💚" },
  { value: "angular", label: "Angular", icon: "🅰️" },
];

/**
 * Render the AI-powered Accessibility Code Generator UI and manage its state and interactions.
 *
 * This component provides a form for selecting a component type and framework, entering a description and optional
 * custom requirements, and generating WCAG 2.2–aware component code via a backend AI service. It handles:
 * - local form and UI state (inputs, loading, errors, generated output),
 * - unlimited-access checks and remaining-time updates,
 * - sending generation requests and mapping backend responses into UI-friendly structures,
 * - copying and downloading generated code,
 * - and rendering the full set of results (generated code, analysis, examples, accessibility summaries, and credits).
 *
 * @returns The JSX element for the accessibility code generator interface.
 */
export default function AccessibilityCodeGenerator() {
  // Form state
  const [componentType, setComponentType] = useState<string>("");
  const [framework, setFramework] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [customRequirements, setCustomRequirements] = useState<string>("");

  // UI / result state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [unlimitedAccess, setUnlimitedAccess] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Check for unlimited access
  useEffect(() => {
    const checkUnlimitedAccess = () => {
      const hasAccess = hasUnlimitedAccess();
      setUnlimitedAccess(hasAccess);
      if (hasAccess) {
        setRemainingTime(getUnlimitedAccessRemainingTime());
      }
    };

    checkUnlimitedAccess();
    // Check every minute for expiration
    const interval = setInterval(checkUnlimitedAccess, 60000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Helper: copy to clipboard with visual feedback
   */
  const copyCode = (code: string, tab: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  /**
   * Helper: download text as a file
   */
  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /**
   * Map the backend AI JSON GeneratedCode.
   * recovery JSON may be returned by the server (empty fields),
   * and model output may use either generic "code" or framework-specific keys.
   */
  function mapAiResponseToUi(parsed: ApiResponse): GeneratedCode {
    const examples = parsed.implementation_examples ?? {
      basic_usage: "",
      advanced_usage: "",
      full_integration: "",
    };

    const detailedAnalysis = parsed.detailed_code_analysis ?? {
      code_breakdown: "",
      accessibility_context: "",
      real_world_example: "",
    };

    return {
      code: parsed.code ?? "",
      examples,
      detailedAnalysis,
      accessibility: {
        features: parsed.accessibility_features ?? [],
        wcagCompliance: parsed.wcag_compliances ?? [],
        testing: parsed.testing_guide ?? [],
        common_mistakes_to_avoid: parsed.common_mistakes_to_avoid ?? [],
        enhancement_suggestions: parsed.enhancement_suggestions ?? [],
        implementation: parsed.implementation_summary ?? [],
        bestPractices: parsed.best_practices ?? [],
      },
      creditsUsed: parsed.creditsUsed,
      remainingCredits: parsed.remainingCredits,
      trialStatus: parsed.trialStatus,
    };
  }

  /**
   * Call backend API and handle the AI JSON response.
   */
  async function generateCode() {
    setError(null);
    setGeneratedCode(null);

    if (!componentType || !framework || !description) {
      setError(
        "Please select a component type, framework and provide a description."
      );
      return;
    }

    setIsGenerating(true);

    try {
      // Construct request payload matching backend RequestBody
      const reqBody = {
        componentType,
        framework,
        componentDescription: description,
        customRequirement: customRequirements || undefined,
        unlimitedAccess: unlimitedAccess,
      };

      const res = await fetch("/api/accessibility-code-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });

      // handle non-200 responses
      const body = await res.text();
      let parsedData: any | null = null;
      try {
        parsedData = body ? JSON.parse(body) : null;
      } catch (parseErr) {
        // If the server returned non-JSON (unexpected
        throw new Error("Invalid response from server: not JSON.");
      }

      if (!res.ok) {
        // When backend returns errors with { error, code? }
        const serverMsg =
          parsedData?.error ?? `Server returned status ${res.status}`;
        throw new Error(serverMsg);
      }

      // Map and set UI state
      const mapped = mapAiResponseToUi(parsedData);
      setGeneratedCode(mapped);
    } catch (err: any) {
      console.error("Generation failed:", err);
      setError(err?.message ?? "Failed to generate code. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Unlimited Access Banner */}
      {unlimitedAccess && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 shadow-lg mb-8 rounded-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 animate-pulse" />
                <span className="font-bold">UNLIMITED ACCESS ACTIVE</span>
              </div>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                Premium
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="hidden sm:inline">
                Expires in: {formatRemainingTime(remainingTime)}
              </span>
              <Link href="/unlimitedaccess">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-green-600 hover:bg-white/20"
                >
                  Manage Access
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-1 text-green-100 text-sm text-center sm:text-left">
            🚀 Unlimited AI analyses • No usage limits • Priority processing
          </div>
        </div>
      )}

      {/* Controls card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Code Generator
          </CardTitle>
          <CardDescription>
            Generate WCAG 2.2 compliant components with AI assistance
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="component-type">Component Type</Label>
              <Select value={componentType} onValueChange={setComponentType}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select component type" />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  {componentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {type.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="framework">Framework</Label>
              <Select value={framework} onValueChange={setFramework}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  {frameworks.map((fw) => (
                    <SelectItem key={fw.value} value={fw.value}>
                      <div className="flex items-center gap-2">
                        <span>{fw.icon}</span>
                        <span>{fw.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Component Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the component functionality and requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Custom Requirements (Optional)</Label>
            <Textarea
              id="requirements"
              placeholder="Any specific accessibility requirements, styling needs, or functionality..."
              value={customRequirements}
              onChange={(e) => setCustomRequirements(e.target.value)}
              rows={2}
            />
          </div>

          {error && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!unlimitedAccess && (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <strong>Credits Required:</strong> This comprehensive AI-powered
                code generation uses <strong>2 credits</strong> and provides
                detailed accessible components with explanations, examples, and
                implementation guides.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={generateCode}
            disabled={
              !componentType || !framework || !description || isGenerating
            }
            className="w-full"
          >
            {isGenerating ? (
              <>
                <span className="md:hidden">Generating...</span>
                <span className="hidden md:inline">
                  Generating Comprehensive Code...
                </span>
              </>
            ) : (
              <>
                <span className="md:hidden">Generate</span>
                <span className="hidden md:inline">
                  Generate Detailed Accessible Code (
                  {unlimitedAccess ? "Unlimited" : "2 Credits"})
                </span>
              </>
            )}
            {!unlimitedAccess && (
              <Badge variant="secondary" className="ml-2">
                2 Credits
              </Badge>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output: only render when we have generatedCode */}
      {generatedCode && (
        <div className="space-y-6">
          {/* Generated Code Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Generated Accessible Code
              </CardTitle>
              <CardDescription>
                Production-ready, WCAG 2.2 compliant component code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="code" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="code">{framework}</TabsTrigger>
                </TabsList>

                <TabsContent value="code" className="space-y-4">
                  <div className="flex flex-col md:!flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                    <h4 className="font-semibold">{framework} Component</h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCode(generatedCode.code, framework)}
                      >
                        {copiedTab ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copiedTab ? "Copied!" : "Copy"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          downloadCode(
                            generatedCode.code,
                            `${componentType || "component"}.jsx`
                          )
                        }
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{generatedCode.code}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Braces className="h-5 w-5" />
                Detailed Code Analysis
              </CardTitle>
              <CardDescription>
                Comprehensive breakdown of the accessibility implementation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="breakdown" className="w-full">
                <TabsList className="flex w-full overflow-x-auto justify-start md:grid md:grid-cols-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <TabsTrigger value="breakdown" className="flex-shrink-0">Code Breakdown</TabsTrigger>
                  <TabsTrigger value="context" className="flex-shrink-0">
                    Accessibility Context
                  </TabsTrigger>
                  <TabsTrigger value="example" className="flex-shrink-0">Real-World Example</TabsTrigger>
                </TabsList>

                <TabsContent value="breakdown" className="space-y-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: (
                          generatedCode.detailedAnalysis.code_breakdown || ""
                        ).replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="context" className="space-y-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: (
                          generatedCode.detailedAnalysis
                            .accessibility_context || ""
                        ).replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="example" className="space-y-4">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: (
                          generatedCode.detailedAnalysis.real_world_example ||
                          ""
                        ).replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Implementation Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Implementation Examples
              </CardTitle>
              <CardDescription>
                Different ways to use and integrate the component
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="flex w-full overflow-x-auto justify-start md:grid md:grid-cols-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <TabsTrigger value="basic" className="flex-shrink-0">Basic Usage</TabsTrigger>
                  <TabsTrigger value="advanced" className="flex-shrink-0">Advanced Usage</TabsTrigger>
                  <TabsTrigger value="integration" className="flex-shrink-0">
                    Full Integration
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Basic Implementation</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyCode(generatedCode.examples.basic_usage, "basic")
                      }
                    >
                      {copiedTab === "basic" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}{" "}
                      {copiedTab === "basic" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{generatedCode.examples.basic_usage}</code>
                  </pre>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Advanced Configuration</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyCode(
                          generatedCode.examples.advanced_usage,
                          "advanced"
                        )
                      }
                    >
                      {copiedTab === "advanced" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}{" "}
                      {copiedTab === "advanced" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{generatedCode.examples.advanced_usage}</code>
                  </pre>
                </TabsContent>

                <TabsContent value="integration" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Full Integration Example</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        copyCode(
                          generatedCode.examples.full_integration,
                          "integration"
                        )
                      }
                    >
                      {copiedTab === "integration" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}{" "}
                      {copiedTab === "integration" ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{generatedCode.examples.full_integration}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Accessibility Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5" />
                  Accessibility Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedCode.accessibility.features.length === 0 ? (
                    <li className="text-sm text-muted-foreground">
                      No accessibility features provided.
                    </li>
                  ) : (
                    generatedCode.accessibility.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers className="h-5 w-5" />
                  WCAG Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedCode.accessibility.wcagCompliance.length === 0 ? (
                    <li className="text-sm text-muted-foreground">
                      No WCAG items provided.
                    </li>
                  ) : (
                    generatedCode.accessibility.wcagCompliance.map(
                      (item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      )
                    )
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Keyboard className="h-5 w-5" />
                  Testing Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedCode.accessibility.testing.length === 0 ? (
                    <li className="text-sm text-muted-foreground">
                      No testing steps provided.
                    </li>
                  ) : (
                    generatedCode.accessibility.testing.map((t, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Hand className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedCode.accessibility.bestPractices.length === 0 ? (
                    <li className="text-sm text-muted-foreground">
                      No best practices provided.
                    </li>
                  ) : (
                    generatedCode.accessibility.bestPractices.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Common Mistakes & Enhancements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedCode.accessibility.common_mistakes_to_avoid.length >
                  0 ? (
                    generatedCode.accessibility.common_mistakes_to_avoid.map(
                      (c, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{c}</span>
                        </li>
                      )
                    )
                  ) : (
                    <li className="text-sm text-muted-foreground">
                      No common mistakes provided by the analysis.
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-blue-600">
                  <Zap className="h-5 w-5" />
                  Enhancement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedCode.accessibility.enhancement_suggestions.length >
                  0 ? (
                    generatedCode.accessibility.enhancement_suggestions.map(
                      (e, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{e}</span>
                        </li>
                      )
                    )
                  ) : (
                    <li className="text-sm text-muted-foreground">
                      No enhancement suggestions provided.
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Implementation Summary & Credits */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Summary</CardTitle>
              <CardDescription>
                Key points for successful implementation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                This component was generated with accessibility-first design and
                includes explanations and integration guidance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Implementation Steps:</h4>
                  <ul className="space-y-1 text-sm">
                    {generatedCode.accessibility.implementation.length === 0 ? (
                      <li className="text-sm text-muted-foreground">
                        No implementation steps provided.
                      </li>
                    ) : (
                      generatedCode.accessibility.implementation.map(
                        (step, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">
                              {i + 1}.
                            </span>
                            <span>{step}</span>
                          </li>
                        )
                      )
                    )}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      Credits & Status
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Credits used:{" "}
                      <strong>{generatedCode.creditsUsed ?? "—"}</strong>
                      <br />
                      Remaining credits:{" "}
                      <strong>{generatedCode.remainingCredits ?? "—"}</strong>
                    </p>

                    {generatedCode.trialStatus && (
                      <div className="mt-3 text-sm">
                        Trial: used {generatedCode.trialStatus.usageCount},
                        remaining {generatedCode.trialStatus.remainingUses},
                        limit reached:{" "}
                        {String(generatedCode.trialStatus.limitReached)}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      Production Ready
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      This code is intended to be production-ready; please run
                      your usual integration tests and accessibility
                      verification before shipping.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
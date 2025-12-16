"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Code,
  Settings,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Coins,
  Info,
  Loader2,
  Copy,
  ExternalLink,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useCredits } from "@/hooks/use-credits";
import { useTrialStatus } from "@/hooks/use-trial-status";
import {
  hasUnlimitedAccess,
  getUnlimitedAccessRemainingTime,
  formatRemainingTime,
} from "@/lib/unlimited-access";
import Link from "next/link";

interface AnalysisResult {
  issueTitle: string;
  severity: "critical" | "high" | "medium" | "low";
  actualResult: string;
  expectedResult: string;
  userImpact: string;
  wcagCriteria: Array<{
    criterion: string;
    level: string;
    description: string;
  }>;
  recommendations: string;
  codeExample?: string;
  implementationSteps: string[];
  testingChecklist: string[];
  relatedResources: Array<{
    title: string;
    url: string;
  }>;
  creditsUsed: number;
  remainingCredits: number;
  trialStatus?: {
    usageCount: number;
    remainingUses: number;
    limitReached: boolean;
  };
}

const TECH_STACKS = [
  "React",
  "Vue.js",
  "Angular",
  "Svelte",
  "Next.js",
  "Nuxt.js",
  "HTML/CSS/JS",
  "jQuery",
  "WordPress",
  "Shopify",
  "Other",
];

const COMPONENT_TYPES = [
  "Navigation",
  "Forms",
  "Buttons",
  "Modals/Dialogs",
  "Dropdowns",
  "Tables",
  "Images",
  "Videos",
  "Carousels",
  "Accordions",
  "Tabs",
  "Other",
];

const AVAILABLE_MODELS = [
  // OpenAI Models - Premium Quality
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Most capable OpenAI model",
    provider: "openai",
    cost: "High ($2.50/$10.00 per 1M tokens)",
    performance: "Excellent",
    recommended: true,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Fast and cost-effective",
    provider: "openai",
    cost: "Low ($0.15/$0.60 per 1M tokens)",
    performance: "Good",
    recommended: true,
  },
  {
    id: "o3-mini",
    name: "o3-mini (Reasoning)",
    description: "Latest reasoning model",
    provider: "openai",
    cost: "Medium (Reasoning model)",
    performance: "Excellent for complex analysis",
    recommended: true,
  },

  // Claude Models - Best for Accessibility Analysis
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    description: "Excellent for detailed accessibility analysis",
    provider: "openrouter",
    cost: "High ($3.00/$15.00 per 1M tokens)",
    performance: "Excellent",
    recommended: true,
  },
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    description: "Latest Claude model with enhanced capabilities",
    provider: "openrouter",
    cost: "High ($3.50/$17.50 per 1M tokens)",
    performance: "Excellent",
    recommended: true,
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    description: "Fast Claude model for quick analysis",
    provider: "openrouter",
    cost: "Low ($0.25/$1.25 per 1M tokens)",
    performance: "Good",
    recommended: false,
  },

  // Google Models - Multimodal Capabilities
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    description: "Google's latest fast multimodal model",
    provider: "openrouter",
    cost: "Low ($0.15/$0.60 per 1M tokens)",
    performance: "Very Good",
    recommended: true,
  },
  {
    id: "google/gemini-pro-1.5",
    name: "Gemini Pro 1.5",
    description: "Advanced multimodal model with large context",
    provider: "openrouter",
    cost: "Medium ($1.25/$5.00 per 1M tokens)",
    performance: "Excellent",
    recommended: true,
  },

  // Meta AI Models - Open Source Excellence
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    description: "Meta's latest open-source model",
    provider: "openrouter",
    cost: "Low ($0.59/$0.79 per 1M tokens)",
    performance: "Very Good",
    recommended: true,
  },
  {
    id: "meta-llama/llama-3.1-405b-instruct",
    name: "Llama 3.1 405B",
    description: "Meta's largest open-source model",
    provider: "openrouter",
    cost: "Medium ($2.70/$2.70 per 1M tokens)",
    performance: "Excellent",
    recommended: false,
  },

  // DeepSeek Models - Great Value (Corrected IDs)
  {
    id: "deepseek/deepseek-chat-v3.1",
    name: "DeepSeek Chat V3.1",
    description: "Latest DeepSeek model, great value",
    provider: "openrouter",
    cost: "Very Low ($0.27/$1.10 per 1M tokens)",
    performance: "Very Good",
    recommended: true,
  },
  {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek R1",
    description: "Reasoning model, cost-effective",
    provider: "openrouter",
    cost: "Low ($0.55/$2.19 per 1M tokens)",
    performance: "Good for reasoning",
    recommended: true,
  },

  // Other High-Value Models
  {
    id: "mistralai/mistral-large-2407",
    name: "Mistral Large",
    description: "European AI, balanced performance",
    provider: "openrouter",
    cost: "Medium ($2.00/$6.00 per 1M tokens)",
    performance: "Very Good",
    recommended: false,
  },
];

const SEVERITY_CONFIG = {
  critical: {
    color: "bg-red-100 text-red-800 border-red-200",
    icon: XCircle,
    label: "Critical",
  },
  high: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertCircle,
    label: "High",
  },
  medium: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: AlertCircle,
    label: "Medium",
  },
  low: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Info,
    label: "Low",
  },
};

export default function AccessibilityAuditHelper() {
  const { isSignedIn, user } = useUser();
  const { refreshCredits } = useCredits();
  const { getTrialStatus, updateTrialStatus, fetchTrialStatus } =
    useTrialStatus();

  // Form state
  const [issueDescription, setIssueDescription] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [techStack, setTechStack] = useState("");
  const [componentType, setComponentType] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini"); // Default to cost-effective model

  // UI state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [partialResult, setPartialResult] =
    useState<Partial<AnalysisResult> | null>(null);
  const [currentSection, setCurrentSection] = useState<string>("");
  const [typingText, setTypingText] = useState<string>("");
  const [unlimitedAccess, setUnlimitedAccess] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);

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

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!issueDescription.trim()) {
      setError("Please describe the accessibility issue you're experiencing");
      return;
    }

    setIsAnalyzing(true);
    setIsStreaming(true);
    setError(null);
    setResult(null);
    setStreamingContent("");
    setCurrentStatus("Connecting...");
    setPartialResult(null);
    setCurrentSection("");
    setTypingText("");

    try {
      const response = await fetch("/api/analyze-accessibility-issue-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issueDescription: issueDescription.trim(),
          codeSnippet: codeSnippet.trim() || null,
          techStack: techStack || null,
          componentType: componentType || null,
          unlimitedAccess: unlimitedAccess,
          selectedModel: unlimitedAccess ? selectedModel : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response stream available");
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              switch (data.type) {
                case "connected":
                  setCurrentStatus("Connected");
                  break;

                case "status":
                  setCurrentStatus(data.message);
                  break;

                case "partial":
                  setStreamingContent((prev) => {
                    const newContent = prev + data.content;

                    // Detect current section and typing text
                    const detectCurrentSection = (content: string) => {
                      // Remove markdown code blocks if present
                      const cleanContent = content
                        .replace(/```(?:json)?\s*/, "")
                        .replace(/```\s*$/, "");

                      // Find the current field being written
                      const fieldPatterns = [
                        {
                          field: "issueTitle",
                          label: "Issue Identification",
                          pattern: /"issueTitle":\s*"([^"]*)"?$/,
                        },
                        {
                          field: "severity",
                          label: "Severity Assessment",
                          pattern: /"severity":\s*"([^"]*)"?$/,
                        },
                        {
                          field: "actualResult",
                          label: "Problem Analysis",
                          pattern: /"actualResult":\s*"([^"]*)"?$/,
                        },
                        {
                          field: "expectedResult",
                          label: "Solution Planning",
                          pattern: /"expectedResult":\s*"([^"]*)"?$/,
                        },
                        {
                          field: "userImpact",
                          label: "Impact Assessment",
                          pattern: /"userImpact":\s*"([^"]*)"?$/,
                        },
                        {
                          field: "recommendations",
                          label: "Expert Recommendations",
                          pattern: /"recommendations":\s*"([^"]*)"?$/,
                        },
                        {
                          field: "codeExample",
                          label: "Code Solution",
                          pattern: /"codeExample":\s*"([^"]*)"?$/,
                        },
                      ];

                      // Check for WCAG criteria being written
                      if (
                        content.includes('"wcagCriteria"') &&
                        content.includes("[")
                      ) {
                        const wcagMatch = content.match(
                          /"wcagCriteria":\s*\[([\s\S]*?)$/
                        );
                        if (wcagMatch) {
                          return {
                            section: "WCAG Compliance Analysis",
                            text: "Analyzing WCAG criteria and compliance requirements...",
                          };
                        }
                      }

                      // Check for implementation steps
                      if (
                        content.includes('"implementationSteps"') &&
                        content.includes("[")
                      ) {
                        const stepsMatch = content.match(
                          /"implementationSteps":\s*\[([\s\S]*?)$/
                        );
                        if (stepsMatch) {
                          return {
                            section: "Implementation Guide",
                            text: "Creating step-by-step implementation guide...",
                          };
                        }
                      }

                      // Check for testing checklist
                      if (
                        content.includes('"testingChecklist"') &&
                        content.includes("[")
                      ) {
                        return {
                          section: "Testing Checklist",
                          text: "Preparing accessibility testing checklist...",
                        };
                      }

                      // Check each field pattern
                      for (const { field, label, pattern } of fieldPatterns) {
                        const match = content.match(pattern);
                        if (match) {
                          // Get the partial text being written
                          const partialText = match[1] || "";
                          return { section: label, text: partialText };
                        }

                        // Check if we're in the middle of writing this field
                        const fieldStart = content.lastIndexOf(`"${field}":"`);
                        if (fieldStart !== -1) {
                          const afterField = content.substring(
                            fieldStart + field.length + 4
                          );
                          const quoteIndex = afterField.indexOf('"');
                          if (quoteIndex === -1) {
                            // Still writing this field
                            const rawText = afterField
                              .replace(/\\n/g, "\n")
                              .replace(/\\"/g, '"');
                            return { section: label, text: rawText };
                          }
                        }
                      }

                      return {
                        section: "Initializing Analysis",
                        text: "Connecting to accessibility expert AI...",
                      };
                    };

                    const currentInfo = detectCurrentSection(newContent);
                    setCurrentSection(currentInfo.section);
                    setTypingText(currentInfo.text);

                    // Also extract completed fields for final display
                    try {
                      const jsonMatch = newContent.match(/\{[\s\S]*/);
                      if (jsonMatch) {
                        const extractCompletedFields = (content: string) => {
                          const partial: Partial<AnalysisResult> = {};

                          // Helper function to extract completed string values
                          const extractField = (
                            fieldName: string,
                            content: string
                          ) => {
                            const pattern = new RegExp(
                              `"${fieldName}":\\s*"([^"]*)"(?:[^"]*"[^"]*)*`,
                              "i"
                            );
                            const match = content.match(pattern);
                            return match
                              ? match[1]
                                  .replace(/\\"/g, '"')
                                  .replace(/\\n/g, "\n")
                              : null;
                          };

                          // Only extract fully completed fields (with closing quotes)
                          const completedFields = [
                            "issueTitle",
                            "severity",
                            "actualResult",
                            "expectedResult",
                            "userImpact",
                            "recommendations",
                            "codeExample",
                          ];

                          completedFields.forEach((field) => {
                            const value = extractField(field, content);
                            if (
                              value &&
                              content.includes(`"${field}":"${value}"`)
                            ) {
                              (partial as any)[field] = value;
                            }
                          });

                          // Handle severity validation
                          if (
                            partial.severity &&
                            !["critical", "high", "medium", "low"].includes(
                              partial.severity
                            )
                          ) {
                            delete partial.severity;
                          }

                          return partial;
                        };

                        const completed = extractCompletedFields(jsonMatch[0]);
                        if (Object.keys(completed).length > 0) {
                          setPartialResult(completed);
                        }
                      }
                    } catch (e) {
                      // Ignore parsing errors during streaming
                    }

                    return newContent;
                  });
                  setCurrentStatus("Analyzing accessibility issue...");
                  break;

                case "complete":
                  setResult(data.result);
                  setIsStreaming(false);
                  setCurrentStatus("Analysis complete!");
                  if (isSignedIn) {
                    refreshCredits();
                  } else {
                    fetchTrialStatus();
                  }
                  break;

                case "error":
                  if (data.code === "INSUFFICIENT_CREDITS") {
                    setError(
                      `${data.error} Visit your dashboard to purchase more credits.`
                    );
                  } else if (data.code === "TRIAL_LIMIT_EXCEEDED") {
                    setError(
                      `${data.error} You've used all your trial analyses for this tool. Sign up to get 100 free credits!`
                    );
                  } else {
                    setError(data.error);
                  }
                  setIsStreaming(false);
                  break;
              }
            } catch (parseError) {
              console.error("Error parsing SSE data:", parseError);
            }
          }
        }
      }
    } catch (err) {
      console.error(
        "Streaming failed, falling back to non-streaming API:",
        err
      );

      // Fallback to non-streaming API
      try {
        setCurrentStatus("Retrying with alternative method...");
        setStreamingContent("");
        setPartialResult(null);
        setCurrentSection("");
        setTypingText("");

        const fallbackResponse = await fetch(
          "/api/analyze-accessibility-issue",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              issueDescription: issueDescription.trim(),
              codeSnippet: codeSnippet.trim() || null,
              techStack: techStack || null,
              componentType: componentType || null,
              unlimitedAccess: unlimitedAccess,
            }),
          }
        );

        const fallbackData = await fallbackResponse.json();

        if (!fallbackResponse.ok) {
          if (fallbackData.code === "INSUFFICIENT_CREDITS") {
            setError(
              `${fallbackData.error} Visit your dashboard to purchase more credits.`
            );
          } else if (fallbackData.code === "TRIAL_LIMIT_EXCEEDED") {
            setError(
              `${fallbackData.error} You've used all your trial analyses for this tool. Sign up to get 100 free credits!`
            );
          } else {
            throw new Error(
              fallbackData.error || "Failed to analyze accessibility issue"
            );
          }
          return;
        }

        setResult(fallbackData);
        if (isSignedIn) {
          refreshCredits();
        } else {
          fetchTrialStatus();
        }
        setCurrentStatus("Analysis complete!");
      } catch (fallbackErr) {
        const errorMessage =
          fallbackErr instanceof Error
            ? fallbackErr.message
            : "An unknown error occurred";
        setError(errorMessage);
      }

      setIsStreaming(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      toast.success(`${type} copied to clipboard`);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const clearForm = () => {
    setIssueDescription("");
    setCodeSnippet("");
    setTechStack("");
    setComponentType("");
    setSelectedModel("gpt-4o"); // Reset to default model
    setResult(null);
    setError(null);
    setStreamingContent("");
    setCurrentStatus("");
    setIsStreaming(false);
    setPartialResult(null);
    setCurrentSection("");
    setTypingText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900">
      {/* Unlimited Access Banner */}
      {unlimitedAccess && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 shadow-lg">
          <div className="container-wide">
            <div className="flex items-center justify-between">
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
            <div className="mt-1 text-green-100 text-sm">
              🚀 Unlimited AI analyses • No usage limits • Priority processing
            </div>
          </div>
        </div>
      )}

      {/* Functional Hero Section with Form */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-slate-600/5"></div>
        <div className="container-wide relative py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-2 xs2:p-3 xs3:p-3 rounded-full mb-6 bg-blue-100 dark:bg-blue-900/50">
                <Search className="h-5 w-5 xs2:h-6 xs2:w-6 xs3:h-7 xs3:w-7 md:h-8 md:w-8 text-blue-600 dark:text-blue-400" />
              </div>

              <h1 className="text-3xl xs2:text-4xl xs3:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                AI Accessibility{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Audit Helper
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Get expert accessibility analysis with AI-powered insights and
                WCAG compliance recommendations
              </p>
            </div>

            {/* Integrated Form */}
            <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-950/20 dark:to-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-6">
                  <div className="text-center mb-6">
                    <CardTitle className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                      Describe Your Accessibility Issue
                    </CardTitle>
                    <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                      Provide details about your accessibility challenge and get
                      expert AI-powered analysis
                    </CardDescription>
                  </div>

                  {!isSignedIn ? (
                    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                      <Info className="h-4 w-4 text-blue-600" />

                      <AlertTitle className="text-blue-800 dark:text-blue-200">
                        Free Trial Available
                      </AlertTitle>

                      <AlertDescription className="text-blue-700 dark:text-blue-300 space-y-2">
                        Try this tool up to 2 times for free! Then{" "}
                        <Link href="/sign-in" className="underline font-medium">
                          sign in
                        </Link>{" "}
                        or{" "}
                        <Link href="/sign-up" className="underline font-medium">
                          create an account
                        </Link>{" "}
                        to get unlimited access.
                        {/* --- Badge now responsive --- */}
                        <div className="block md:inline-flex mt-2 md:mt-0">
                          <Badge variant="secondary" className="text-xs">
                            100 free credits for new users!
                          </Badge>
                        </div>
                        {result && result.trialStatus && (
                          <div className="mt-2 text-sm">
                            Trial uses: {result.trialStatus.usageCount}/2 •{" "}
                            {result.trialStatus.remainingUses} remaining
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="flex items-center justify-center gap-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <Coins className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-slate-900 dark:text-white">
                          Cost: 1 credit per analysis
                        </span>
                      </div>
                      {result && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Remaining: {result.remainingCredits} credits
                        </div>
                      )}
                    </div>
                  )}
                </CardHeader>
              </div>

              <CardContent className="p-8">
                <form
                  ref={formRef}
                  onSubmit={handleAnalyze}
                  className="space-y-8"
                >
                  {/* Two Column Layout for Form Fields */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Issue Description */}
                      <div className="space-y-3">
                        <Label
                          htmlFor="issue-description"
                          className="text-lg font-semibold text-slate-900 dark:text-white"
                        >
                          Issue Description *
                        </Label>
                        <Textarea
                          id="issue-description"
                          placeholder="Describe the accessibility issue you're experiencing. For example: 'Users can't navigate our dropdown menu with keyboard', 'Screen readers aren't announcing form validation errors', etc."
                          value={issueDescription}
                          onChange={(e) => setIssueDescription(e.target.value)}
                          className="min-h-[140px] text-base border-2 focus:border-blue-500"
                          required
                          suppressHydrationWarning
                        />
                      </div>

                      {/* Tech Stack */}
                      <div className="space-y-3">
                        <Label
                          htmlFor="tech-stack"
                          className="text-lg font-semibold text-slate-900 dark:text-white"
                        >
                          Tech Stack (Optional)
                        </Label>
                        <select
                          id="tech-stack"
                          value={techStack}
                          onChange={(e) => setTechStack(e.target.value)}
                          className="w-full p-3 border-2 rounded-lg focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          suppressHydrationWarning
                        >
                          <option value="">Select your technology stack</option>
                          {TECH_STACKS.map((stack) => (
                            <option key={stack} value={stack}>
                              {stack}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Code Snippet */}
                      <div className="space-y-3">
                        <div>
                          <Label
                            htmlFor="code-snippet"
                            className="text-lg font-semibold text-slate-900 dark:text-white"
                          >
                            Code Snippet (Optional)
                            {/* helper visible only on md+ (inline with label) */}
                            <span className="hidden md:inline text-sm font-normal text-slate-600 dark:text-slate-400 ml-2">
                              Paste relevant HTML/CSS/JS code
                            </span>
                          </Label>

                          {/* helper visible only on small screens (xs-xs3) */}
                          <div className="block md:hidden text-sm text-slate-600 dark:text-slate-400">
                            Paste relevant HTML/CSS/JS code
                          </div>
                        </div>
                        <Textarea
                          id="code-snippet"
                          placeholder="<div onClick={handleClick}>&#10;  Click me&#10;</div>"
                          value={codeSnippet}
                          onChange={(e) => setCodeSnippet(e.target.value)}
                          className="min-h-[140px] font-mono text-sm border-2 focus:border-blue-500"
                          suppressHydrationWarning
                        />
                      </div>

                      {/* Component Type */}
                      <div className="space-y-3">
                        <Label
                          htmlFor="component-type"
                          className="text-lg font-semibold text-slate-900 dark:text-white"
                        >
                          Component Type (Optional)
                        </Label>
                        <select
                          id="component-type"
                          value={componentType}
                          onChange={(e) => setComponentType(e.target.value)}
                          className="w-full p-3 border-2 rounded-lg focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          suppressHydrationWarning
                        >
                          <option value="">Select component type</option>
                          {COMPONENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* AI Model Selection - Only for Unlimited Access Users */}
                      {unlimitedAccess && (
                        <div className="space-y-3">
                          <Label
                            htmlFor="ai-model"
                            className="text-lg font-semibold text-slate-900 dark:text-white"
                          >
                            AI Model Selection
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-green-100 text-green-800 border-green-200"
                            >
                              Unlimited Access
                            </Badge>
                          </Label>
                          <select
                            id="ai-model"
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full p-3 border-2 rounded-lg focus:border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          >
                            {AVAILABLE_MODELS.map((model) => (
                              <option key={model.id} value={model.id}>
                                {model.recommended ? "◆ " : ""}
                                {model.name} - {model.cost} -{" "}
                                {model.performance}
                              </option>
                            ))}
                          </select>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            💡 <strong>Recommended models (◆)</strong> offer the
                            best balance of quality and cost.
                            <br />• <strong>DeepSeek Chat V3.1 & R1</strong>:
                            Best value for money, latest models
                            <br />• <strong>Claude models</strong>: Best for
                            detailed accessibility analysis
                            <br />• <strong>Gemini models</strong>: Multimodal
                            capabilities with good performance
                            <br />• <strong>Meta Llama</strong>: Open-source
                            excellence
                            <br />• <strong>GPT-4o Mini</strong>: Good balance
                            of speed and quality
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        {error}
                        {error.includes("Insufficient credits") && (
                          <div className="mt-3">
                            <Link href="/dashboard">
                              <Button variant="outline" size="sm">
                                <Coins className="h-4 w-4 mr-2" />
                                Purchase Credits
                              </Button>
                            </Link>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col items-center gap-3 md:!flex-row md:justify-center md:gap-4">
                    <Button
                      type="submit"
                      disabled={isAnalyzing}
                      className="w-full md:w-auto px-4 py-2 text-sm xs2:text-base md:text-lg
      bg-blue-600 hover:bg-blue-700 text-white justify-center
      inline-flex items-center
    "
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-3 h-4 w-4 xs3:h-5 xs3:w-5 animate-spin" />
                          {isStreaming
                            ? currentStatus || "Analyzing..."
                            : "Analyzing..."}
                        </>
                      ) : (
                        <>
                          <Zap className="mr-3 h-4 w-4 xs3:h-5 xs3:w-5" />
                          {issueDescription
                            ? "Analyze"
                            : "Analyze Accessibility Issue"}
                        </>
                      )}
                    </Button>

                    {(result || issueDescription) && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={clearForm}
                        className="
        w-full md:w-auto
        px-4 py-2 text-sm xs2:text-base md:text-lg hover:bg-gray-700
        inline-flex items-center justify-center
      "
                      >
                        Clear Form
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Key Features Below Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg mb-3">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Expert AI Analysis
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Advanced AI trained on WCAG guidelines
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg mb-3">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Code Solutions
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Practical code examples and guides
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-lg mb-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  WCAG Compliance
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Meet WCAG 2.2 Level AA standards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container-wide py-16">
        {/* Results Section */}
        <div className="max-w-6xl mx-auto">
          {/* Live Streaming Analysis */}
          {isStreaming && (
            <div className="space-y-6 mb-8">
              {/* Status Header */}
              <Card className="border-2 border-blue-200 dark:border-blue-700 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <div>
                      <CardTitle className="text-xl text-slate-900 dark:text-white">
                        AI Accessibility Expert is Analyzing
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        {currentStatus}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Current Section Being Written */}
              {currentSection && (
                <Card className="border-2 border-green-200 bg-green-50/50 dark:border-green-700 dark:bg-green-950/20">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <CardTitle className="text-lg text-green-800 dark:text-green-200">
                        Currently Writing: {currentSection}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg border border-green-200 dark:border-green-700">
                      <p className="text-green-900 dark:text-green-100 leading-relaxed whitespace-pre-wrap">
                        {typingText}
                        <span className="animate-pulse text-green-600 font-bold">
                          |
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Completed Sections */}
              {partialResult && Object.keys(partialResult).length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Completed Analysis Sections</span>
                  </div>

                  {/* Issue Summary - Completed */}
                  {partialResult.issueTitle && (
                    <Card className="border-green-200 bg-green-50/30 dark:border-green-700 dark:bg-green-950/20">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                ✅ Issue Identified
                              </span>
                            </div>
                            <CardTitle className="text-lg text-slate-900 dark:text-white">
                              {partialResult.issueTitle}
                            </CardTitle>
                            {partialResult.userImpact && (
                              <CardDescription className="mt-2 text-slate-600 dark:text-slate-400">
                                {partialResult.userImpact}
                              </CardDescription>
                            )}
                          </div>
                          {partialResult.severity && (
                            <Badge
                              className={`${SEVERITY_CONFIG[partialResult.severity].color} border`}
                            >
                              {SEVERITY_CONFIG[partialResult.severity].label}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      {(partialResult.actualResult ||
                        partialResult.expectedResult) && (
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {partialResult.actualResult && (
                              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                                <h4 className="font-medium text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                                  <XCircle className="h-4 w-4" />
                                  Current Problem
                                </h4>
                                <p className="text-sm text-red-800 dark:text-red-200">
                                  {partialResult.actualResult}
                                </p>
                              </div>
                            )}
                            {partialResult.expectedResult && (
                              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                                <h4 className="font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4" />
                                  Expected Solution
                                </h4>
                                <p className="text-sm text-green-800 dark:text-green-200">
                                  {partialResult.expectedResult}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  )}

                  {/* Recommendations - Completed */}
                  {partialResult.recommendations && (
                    <Card className="border-green-200 bg-green-50/30 dark:border-green-700 dark:bg-green-950/20">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            ✅ Recommendations Ready
                          </span>
                        </div>
                        <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          Expert Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-white/70 dark:bg-slate-800/70 rounded-lg border border-green-200 dark:border-green-700">
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {partialResult.recommendations}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Code Example - Completed */}
                  {partialResult.codeExample && (
                    <Card className="border-green-200 bg-green-50/30 dark:border-green-700 dark:bg-green-950/20">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            ✅ Code Solution Ready
                          </span>
                        </div>
                        <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
                          <Code className="h-5 w-5" />
                          Code Solution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-slate-900 dark:bg-slate-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm border border-green-200 dark:border-green-700">
                          <code>{partialResult.codeExample}</code>
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Progress Indicator */}
              <Card className="border-2 border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Analysis in progress... This usually takes 15-30 seconds
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Completed Analysis Results */}
          {result && (
            <div className="space-y-8">
              {/* Issue Summary */}
              <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-white mb-2">
                        {result.issueTitle}
                      </CardTitle>
                      <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                        {result.userImpact}
                      </CardDescription>
                    </div>
                    <Badge
                      className={`${SEVERITY_CONFIG[result.severity].color} border text-lg px-3 py-1`}
                    >
                      {SEVERITY_CONFIG[result.severity].label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                        <XCircle className="h-5 w-5" />
                        Current Problem
                      </h4>
                      <p className="text-red-800 dark:text-red-200">
                        {result.actualResult}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Expected Solution
                      </h4>
                      <p className="text-green-800 dark:text-green-200">
                        {result.expectedResult}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WCAG Criteria */}
              <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">
                    WCAG Compliance Requirements
                  </CardTitle>
                  <CardDescription>
                    Relevant WCAG criteria that apply to this accessibility
                    issue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {result.wcagCriteria.map((criterion, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {criterion.criterion}
                          </span>
                          <Badge variant="outline" className="text-sm">
                            Level {criterion.level}
                          </Badge>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                          {criterion.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
                    <Lightbulb className="h-6 w-6" />
                    Expert Recommendations
                  </CardTitle>
                  <CardDescription>
                    Detailed guidance on how to fix this accessibility issue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                      {result.recommendations}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Code Example */}
              {result.codeExample && (
                <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
                        <Code className="h-6 w-6" />
                        Code Solution
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(result.codeExample!, "Code")
                        }
                      >
                        {copied === "Code" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copied === "Code" ? "Copied!" : "Copy Code"}
                      </Button>
                    </div>
                    <CardDescription>
                      Improved code example implementing the accessibility fix
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-900 dark:bg-slate-800 text-green-400 p-6 rounded-lg overflow-x-auto text-sm border">
                      <code>{result.codeExample}</code>
                    </pre>
                  </CardContent>
                </Card>
              )}

              {/* Implementation Steps */}
              <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">
                    Implementation Steps
                  </CardTitle>
                  <CardDescription>
                    Follow these steps to implement the accessibility fix
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {result.implementationSteps.map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Testing Checklist */}
              <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">
                    Testing Checklist
                  </CardTitle>
                  <CardDescription>
                    Verify your implementation with these accessibility tests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.testingChecklist.map((test, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">
                          {test}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Related Resources */}
              {result.relatedResources &&
                result.relatedResources.length > 0 && (
                  <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-slate-900 dark:text-white">
                        Related Resources
                      </CardTitle>
                      <CardDescription>
                        Additional reading and documentation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {result.relatedResources.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 gap-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <span className="font-medium text-slate-900 dark:text-white">
                              {resource.title}
                            </span>
                            <ExternalLink className="h-5 w-5 text-slate-400" />
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>
          )}

          {/* Empty State */}
          {!result && !isAnalyzing && !isStreaming && (
            <Card className="border-dashed border-2 border-slate-300 dark:border-slate-600">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="h-16 w-16 text-slate-400 mb-6" />
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                  Ready to Analyze
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-md">
                  Describe your accessibility issue above and get expert AI
                  analysis with detailed recommendations.
                </p>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Coins className="h-5 w-5" />
                  <span className="font-medium">
                    {isSignedIn
                      ? "1 credit per analysis"
                      : "2 free trials available"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

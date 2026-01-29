"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Upload,
  Link2,
  Copy,
  AlertCircle,
  CheckCircle,
  Info,
  CreditCard,
  Coins,
  ImageIcon,
  Trash2,
  RefreshCw,
  Eye,
  Download,
  Sparkles,
  Zap,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Languages,
  Palette,
  BarChart3,
  Target,
  BookOpen,
  Globe,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { errorLogger } from "@/lib/error-logger";
import { useUser } from "@clerk/nextjs";
import { useCredits } from "@/hooks/use-credits";
import Link from "next/link";
import { getLanguagesForSelect } from "@/lib/alt-text-languages";
import { getStylesForSelect } from "@/lib/alt-text-styles";
import {
  generateQualityReport,
  type QualityReport,
  type PlatformCompatibility,
} from "@/lib/alt-text-quality";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface GenerationResult {
  altText: string;
  creditsUsed?: number;
  remainingCredits?: number;
  timestamp: number;
  wordCount?: number;
  lengthPreference?: string;
  language?: string;
  style?: string;
  qualityReport?: QualityReport;
  trialStatus?: {
    usageCount: number;
    remainingUses: number;
    limitReached: boolean;
  };
}

export default function AltTextGenerator() {
  const { isSignedIn, user } = useUser();
  const { refreshCredits } = useCredits();
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [context, setContext] = useState("");
  const [lengthPreference, setLengthPreference] = useState<string>("medium");
  const [customLength, setCustomLength] = useState<string>("50");
  const [language, setLanguage] = useState<string>("en");
  const [altTextStyle, setAltTextStyle] = useState<string>("default");
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [qualityOpen, setQualityOpen] = useState<Record<number, boolean>>({});

  // Reset error when tab changes or image changes
  useEffect(() => {
    setError(null);
  }, [activeTab, uploadedImage]);

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, GIF, WebP, etc.)");
      errorLogger.logMinorError("Invalid file type uploaded", {
        component: "AltTextGenerator",
        context: { fileType: file.type },
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      errorLogger.logMinorError("File too large", {
        component: "AltTextGenerator",
        context: { fileSize: file.size },
      });
      return;
    }

    setError(null);
    setUploadProgress(0);

    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress);
      }
    };

    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    };

    reader.onerror = () => {
      setError("Failed to read the file. Please try again.");
      setUploadProgress(0);
      errorLogger.logMinorError("File read error", {
        component: "AltTextGenerator",
      });
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl) {
      setError("Please enter an image URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch (e) {
      setError("Please enter a valid URL");
      errorLogger.logMinorError("Invalid URL format", {
        component: "AltTextGenerator",
        context: { url: imageUrl },
      });
      return;
    }

    setError(null);
    setImageLoading(true);

    // Test if image loads
    const img = new window.Image();
    img.onload = () => {
      setUploadedImage(imageUrl);
      setImageLoading(false);
    };
    img.onerror = () => {
      setError(
        "Failed to load image from URL. Please check the URL and try again."
      );
      setImageLoading(false);
      errorLogger.logMinorError("URL image load error", {
        component: "AltTextGenerator",
        context: { url: imageUrl },
      });
    };
    img.src = imageUrl;
  };

  const generateAltText = async () => {
    if (!uploadedImage) {
      setError("Please upload an image or provide an image URL");
      return;
    }

    // Validate custom length if selected
    if (lengthPreference === "custom") {
      const customLengthNum = parseInt(customLength);
      if (
        isNaN(customLengthNum) ||
        customLengthNum < 5 ||
        customLengthNum > 1000
      ) {
        setError("Custom word count must be between 5 and 1000 words");
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // Determine target word count based on preference
      let targetWordCount: number;
      switch (lengthPreference) {
        case "short":
          targetWordCount = 20;
          break;
        case "medium":
          targetWordCount = 40;
          break;
        case "long":
          targetWordCount = 75;
          break;
        case "comprehensive":
          targetWordCount = 150;
          break;
        case "custom":
          targetWordCount = parseInt(customLength);
          break;
        default:
          targetWordCount = 40;
      }

      const response = await fetch("/api/generate-alt-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedImage,
          context: context.trim() || undefined,
          lengthPreference: lengthPreference,
          targetWordCount: targetWordCount,
          language: language,
          style: altTextStyle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "INSUFFICIENT_CREDITS") {
          setError(
            `${data.error} Visit your dashboard to purchase more credits.`
          );
        } else if (data.code === "TRIAL_LIMIT_EXCEEDED") {
          setError(
            `${data.error} You've used all your trial generations for this tool. Sign up to get 100 free credits!`
          );
        } else {
          throw new Error(data.error || "Failed to generate alt text");
        }
        return;
      }

      // Generate quality report for the alt text
      const qualityReport = generateQualityReport(data.altText, context);

      const newResult: GenerationResult = {
        altText: data.altText,
        creditsUsed: data.creditsUsed,
        remainingCredits: data.remainingCredits,
        timestamp: Date.now(),
        wordCount: data.wordCount,
        lengthPreference: data.lengthPreference,
        language: language,
        style: altTextStyle,
        qualityReport: qualityReport,
        trialStatus: data.trialStatus,
      };

      setResults((prev) => [newResult, ...prev]);

      // Refresh credits in header after successful generation
      refreshCredits();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      errorLogger.logMinorError("Alt text generation failed", {
        component: "AltTextGenerator",
        context: { error: errorMessage },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
      },
      (err) => {
        setError("Failed to copy to clipboard");
        errorLogger.logMinorError("Clipboard copy failed", {
          component: "AltTextGenerator",
          context: { error: err },
        });
      }
    );
  };

  /**
   * Quick regenerate with modified settings
   */
  const quickRegenerate = async (modification: {
    lengthPreference?: string;
    style?: string;
    language?: string;
  }) => {
    if (!uploadedImage) return;

    // Update settings based on modification
    if (modification.lengthPreference) {
      setLengthPreference(modification.lengthPreference);
    }
    if (modification.style) {
      setAltTextStyle(modification.style);
    }
    if (modification.language) {
      setLanguage(modification.language);
    }

    // Small delay to ensure state is updated
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Trigger regeneration
    generateAltText();
  };

  const clearImage = () => {
    setUploadedImage(null);
    setImageUrl("");
    setResults([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (score >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/30";
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/30";
    if (score >= 40) return "bg-orange-100 dark:bg-orange-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  const getPlatformStatusColor = (status: "ok" | "warning" | "error") => {
    switch (status) {
      case "ok": return "text-green-600 dark:text-green-400";
      case "warning": return "text-yellow-600 dark:text-yellow-400";
      case "error": return "text-red-600 dark:text-red-400";
    }
  };

  const getPlatformStatusBg = (status: "ok" | "warning" | "error") => {
    switch (status) {
      case "ok": return "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800";
      case "warning": return "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800";
      case "error": return "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800";
    }
  };

  const toggleQuality = (index: number) => {
    setQualityOpen(prev => ({...prev, [index]: !prev[index]}));
  };

  return (
    <div className="space-y-8">
      {/* Main Generator Card */}
      <Card className="overflow-hidden border-2 shadow-lg">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              Generate Alt Text
            </CardTitle>
            <CardDescription className="text-lg">
              Upload an image or provide a URL to generate professional,
              accessible alt text using OpenAI GPT-4 Vision
            </CardDescription>

            {!isSignedIn ? (
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 dark:text-blue-200">
                  Free Trial Available
                </AlertTitle>

                <AlertDescription className="text-blue-700 dark:text-blue-300">
                  Try this tool up to 2 times for free! Then{" "}
                  <Link href="/sign-in" className="underline font-medium">
                    sign in
                  </Link>{" "}
                  or{" "}
                  <Link href="/sign-up" className="underline font-medium">
                    create an account
                  </Link>{" "}
                  to get unlimited access.
                  <div className="block md:inline-flex mt-2 md:mt-0 md:ml-2">
                    <Badge variant="secondary" className="text-xs md:text-sm">
                      100 free credits for new users!
                    </Badge>
                  </div>
                  {results.length > 0 && results[0].trialStatus && (
                    <div className="mt-2 text-sm">
                      Trial uses: {results[0].trialStatus.usageCount}/2 •{" "}
                      {results[0].trialStatus.remainingUses} remaining
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    Cost: 1 credit per generation
                  </span>
                </div>
                {results.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Remaining: {results[0].remainingCredits} credits
                  </div>
                )}
              </div>
            )}
          </CardHeader>
        </div>

        <CardContent className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="flex w-full mb-6 items-stretch overflow-hidden">
              <TabsTrigger
                value="upload"
                className={
                  "flex-1 min-w-0 self-stretch flex items-center justify-center gap-2 " +
                  "px-2 xs:px-2 xs2:px-3 xs3:px-4 py-2 leading-none " +
                  "text-sm xs:text-sm xs2:text-sm xs3:text-base md:text-base"
                }
              >
                <Upload className="h-4 w-4 xs:h-3 xs:w-3 xs2:h-3 xs2:w-3 xs3:h-4 xs3:w-4" />
                <span className="min-w-0 truncate">Upload Image</span>
              </TabsTrigger>

              <TabsTrigger
                value="url"
                className={
                  "flex-1 min-w-0 self-stretch flex items-center justify-center gap-2 " +
                  "px-2 xs:px-2 xs2:px-3 xs3:px-4 py-2 leading-none " +
                  "text-sm xs:text-sm xs2:text-sm xs3:text-base md:text-base"
                }
              >
                <Link2 className="h-4 w-4 xs:h-3 xs:w-3 xs2:h-3 xs2:w-3 xs3:h-4 xs3:w-4" />
                <span className="min-w-0 truncate">Image URL</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  dragActive
                    ? "border-primary bg-primary/5 scale-105"
                    : uploadedImage && activeTab === "upload"
                      ? "border-primary/50 bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
                }`}
                onClick={triggerFileInput}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="absolute top-4 left-4 right-4">
                    <Progress value={uploadProgress} className="h-1" />
                  </div>
                )}

                {uploadedImage && activeTab === "upload" ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video max-h-[400px] mx-auto rounded-lg overflow-hidden">
                      <Image
                        src={uploadedImage}
                        alt="Uploaded image preview"
                        fill
                        className="object-contain"
                        onError={() => {
                          setError(
                            "Failed to load image. Please try another image."
                          );
                          setUploadedImage(null);
                          errorLogger.logMinorError("Image load error", {
                            component: "AltTextGenerator",
                          });
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearImage();
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-full bg-primary/10">
                        <Upload className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Upload Your Image
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Click to upload or drag and drop your image here
                    </p>
                    <div className="flex flex-col xs3:!flex-row items-center justify-center xs3:gap-4 text-sm text-muted-foreground">
                      <span>PNG, JPG, GIF, WebP</span>
                      <span className="hidden xs3:block">•</span>
                      <span>Up to 5MB</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="image-url" className="text-base font-medium">
                  Image URL
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="image-url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="text-base"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUrlSubmit();
                      }
                    }}
                    suppressHydrationWarning
                  />
                  <Button
                    type="button"
                    onClick={handleUrlSubmit}
                    disabled={imageLoading}
                    size="lg"
                  >
                    {imageLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronRight className="mr-2 h-4 w-4" />
                    )}
                    Load
                  </Button>
                </div>
              </div>

              {uploadedImage && activeTab === "url" && (
                <div className="space-y-4">
                  <div className="relative aspect-video max-h-[400px] mx-auto rounded-lg overflow-hidden border">
                    <Image
                      src={uploadedImage}
                      alt="URL image preview"
                      fill
                      className="object-contain"
                      onError={() => {
                        setError(
                          "Failed to load image from URL. Please check the URL and try again."
                        );
                        setUploadedImage(null);
                        errorLogger.logMinorError("URL image load error", {
                          component: "AltTextGenerator",
                          context: { url: imageUrl },
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <Button variant="outline" size="sm" onClick={clearImage}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Image
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Context Input */}
          <div className="space-y-3 mt-8">
            <div className="flex flex-col md:!flex-row md:items-center">
              <Label htmlFor="context" className="text-base font-medium">
                Context (Optional)
              </Label>
              <span className="md:ml-2 text-sm font-normal text-muted-foreground">
                Help our AI understand your image better
              </span>
            </div>
            <Textarea
              id="context"
              placeholder="Describe how this image will be used. For example: 'Product image for an online store', 'Blog post hero image about sustainability', or 'Team photo for company about page'"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="resize-none text-base"
              rows={3}
              suppressHydrationWarning
            />
          </div>

          {/* Length Preference */}
          <div className="space-y-3 mt-6">
            <div className="flex flex-col md:!flex-row md:items-center">
              <Label className="text-base font-medium">Alt Text Length</Label>
              <span className="text-sm font-normal text-muted-foreground md:ml-2">
                Choose how detailed you want the description
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length-preference" className="text-sm">
                  Length Style
                </Label>
                <Select
                  value={lengthPreference}
                  onValueChange={setLengthPreference}
                >
                  <SelectTrigger
                    id="length-preference"
                    suppressHydrationWarning
                  >
                    <SelectValue placeholder="Select length preference" />
                  </SelectTrigger>
                  <SelectContent suppressHydrationWarning>
                    <SelectItem value="short">
                      Short & Concise (10-25 words)
                    </SelectItem>
                    <SelectItem value="medium">
                      Medium Detail (25-50 words)
                    </SelectItem>
                    <SelectItem value="long">
                      Long & Descriptive (50-100 words)
                    </SelectItem>
                    <SelectItem value="comprehensive">
                      Comprehensive (100-200 words)
                    </SelectItem>
                    <SelectItem value="custom">Custom Word Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {lengthPreference === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="custom-length" className="text-sm">
                    Word Count (Max 1000)
                  </Label>
                  <Input
                    id="custom-length"
                    type="number"
                    min="5"
                    max="1000"
                    value={customLength}
                    onChange={(e) => setCustomLength(e.target.value)}
                    placeholder="Enter word count"
                    className="text-base"
                    suppressHydrationWarning
                  />
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground mt-2">
              {lengthPreference === "short" &&
                "Perfect for simple images where brevity is key"}
              {lengthPreference === "medium" &&
                "Good balance of detail and conciseness for most use cases"}
              {lengthPreference === "long" &&
                "Detailed descriptions for complex images or artistic content"}
              {lengthPreference === "comprehensive" &&
                "Very detailed descriptions for educational or analytical purposes"}
              {lengthPreference === "custom" &&
                `Custom length of ${customLength} words - ideal for specific requirements`}
            </div>
          </div>

          {/* Language and Style Selection */}
          <div className="space-y-3 mt-6">
            <div className="flex flex-col md:!flex-row md:items-center">
              <Label className="text-base font-medium">Language & Style</Label>
              <span className="text-sm font-normal text-muted-foreground md:ml-2">
                Customize the output format
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm">
                  Output Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" suppressHydrationWarning>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent suppressHydrationWarning className="max-h-[300px]">
                    {getLanguagesForSelect().map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <div className="flex items-center gap-2">
                          <span>{lang.label}</span>
                          <span className="text-muted-foreground text-xs">
                            ({lang.nativeName})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alt-text-style" className="text-sm">
                  Description Style
                </Label>
                <Select value={altTextStyle} onValueChange={setAltTextStyle}>
                  <SelectTrigger id="alt-text-style" suppressHydrationWarning>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent suppressHydrationWarning>
                    {getStylesForSelect().map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        <div>
                          <div className="font-medium">{style.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {style.description}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-xs text-muted-foreground mt-2">
              {altTextStyle === "default" &&
                "Balanced descriptions suitable for most websites and applications"}
              {altTextStyle === "ecommerce" &&
                "Optimized for product listings with SEO-friendly keywords"}
              {altTextStyle === "editorial" &&
                "Objective, factual descriptions for news and journalism"}
              {altTextStyle === "technical" &&
                "Precise specifications for diagrams, charts, and documentation"}
              {altTextStyle === "social" &&
                "Engaging descriptions for social media platforms"}
              {altTextStyle === "artistic" &&
                "Expressive descriptions for art and creative photography"}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                {error.includes("Insufficient credits") && (
                  <div className="mt-3">
                    <Link href="/dashboard">
                      <Button variant="outline" size="sm">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Purchase Credits
                      </Button>
                    </Link>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="bg-muted/30 p-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button
              onClick={generateAltText}
              disabled={isLoading || !uploadedImage}
              className="w-full sm:w-auto sm:min-w-[280px] h-12 xs2:h-14 text-sm xs2:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 xs2:mr-3 h-5 w-5 xs2:h-6 xs2:w-6 animate-spin flex-shrink-0" />
                  Generating Alt Text...
                </>
              ) : (
                <>
                  <Zap className="mr-2 xs2:mr-3 h-5 w-5 xs2:h-6 xs2:w-6 flex-shrink-0" />
                  {isSignedIn
                    ? "Generate Alt Text (1 Credit)"
                    : "Generate Alt Text (Trial)"}
                </>
              )}
            </Button>

            {!isSignedIn && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2 sm:mt-0">
                <span>
                  <Link href="/sign-up" className="underline font-medium">
                    Sign up
                  </Link>{" "}
                  to get 100 free credits
                </span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Results */}
      {results.map((result, index) => (
        <Card
          key={result.timestamp}
          className="border-2 border-green-200 dark:border-green-800"
        >
          <CardHeader className="bg-green-50 dark:bg-green-950/20">
            <CardTitle className="flex flex-wrap items-center justify-between gap-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Generated Alt Text
                <Badge variant="outline" className="text-xs">
                  #{results.length - index}
                </Badge>
                {result.lengthPreference && (
                  <Badge variant="secondary" className="text-xs">
                    {result.lengthPreference === "custom"
                      ? `${result.wordCount} words`
                      : result.lengthPreference}
                  </Badge>
                )}
                {result.language && result.language !== "en" && (
                  <Badge variant="outline" className="text-xs">
                    <Languages className="h-3 w-3 mr-1" />
                    {result.language.toUpperCase()}
                  </Badge>
                )}
                {result.style && result.style !== "default" && (
                  <Badge variant="outline" className="text-xs">
                    <Palette className="h-3 w-3 mr-1" />
                    {result.style}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {result.creditsUsed ? (
                  <>
                    <Coins className="h-4 w-4" />
                    {result.creditsUsed} credit used
                  </>
                ) : result.trialStatus ? (
                  <>
                    <Info className="h-4 w-4" />
                    Trial {result.trialStatus.usageCount}/2 •{" "}
                    {result.trialStatus.remainingUses} remaining
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generated
                  </>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              Created on {new Date(result.timestamp).toLocaleString()}
              {result.wordCount && (
                <span className="ml-2">
                  • {result.wordCount} words generated
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-muted/30 p-4 rounded-lg relative group">
              <p className="pr-12 text-base leading-relaxed">
                {result.altText}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyToClipboard(result.altText, index)}
                aria-label="Copy alt text to clipboard"
              >
                {copied === index ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-muted-foreground">
                  <strong>Characters:</strong> {result.altText.length}
                  {result.altText.length > 500 && (
                    <span className="text-orange-600 ml-1">(Very long)</span>
                  )}
                </span>
                <span className="text-muted-foreground">
                  <strong>Words:</strong>{" "}
                  {result.wordCount || result.altText.split(" ").length}
                </span>
                {result.lengthPreference && (
                  <span className="text-muted-foreground">
                    <strong>Style:</strong>{" "}
                    {result.lengthPreference === "custom"
                      ? "Custom"
                      : result.lengthPreference}
                  </span>
                )}
                {result.qualityReport && (
                  <span className={`font-medium ${getScoreColor(result.qualityReport.overallScore)}`}>
                    <strong>Quality:</strong> {result.qualityReport.overallScore}%
                  </span>
                )}
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(result.altText, index)}
                  className="flex-1 md:flex-none"
                >
                  {copied === index ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                      className="flex-1 md:flex-none"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Quick Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => quickRegenerate({ lengthPreference: "short" })}
                    >
                      Make Shorter
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => quickRegenerate({ lengthPreference: "long" })}
                    >
                      Make Longer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => quickRegenerate({ style: "ecommerce" })}
                    >
                      E-commerce Style
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => quickRegenerate({ style: "technical" })}
                    >
                      Technical Style
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => quickRegenerate({ style: "social" })}
                    >
                      Social Media Style
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => quickRegenerate({})}
                    >
                      Same Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Quality Report Section */}
            {result.qualityReport && (
              <Collapsible
                open={qualityOpen[index]}
                onOpenChange={() => toggleQuality(index)}
                className="mt-6"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Quality Analysis</span>
                      <Badge className={`ml-2 ${getScoreBg(result.qualityReport.overallScore)}`}>
                        Overall: {result.qualityReport.overallScore}%
                      </Badge>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${qualityOpen[index] ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  {/* Score Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* SEO Score */}
                    <div className={`p-4 rounded-lg border ${getScoreBg(result.qualityReport.seo.score)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5" />
                        <span className="font-medium">SEO Score</span>
                      </div>
                      <div className={`text-3xl font-bold ${getScoreColor(result.qualityReport.seo.score)}`}>
                        {result.qualityReport.seo.score}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Grade: {result.qualityReport.seo.grade}
                      </div>
                    </div>

                    {/* Readability Score */}
                    <div className={`p-4 rounded-lg border ${getScoreBg(result.qualityReport.readability.score)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5" />
                        <span className="font-medium">Readability</span>
                      </div>
                      <div className={`text-3xl font-bold ${getScoreColor(result.qualityReport.readability.score)}`}>
                        {result.qualityReport.readability.score}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.qualityReport.readability.level}
                      </div>
                    </div>

                    {/* Overall Score */}
                    <div className={`p-4 rounded-lg border ${getScoreBg(result.qualityReport.overallScore)}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5" />
                        <span className="font-medium">Overall Quality</span>
                      </div>
                      <div className={`text-3xl font-bold ${getScoreColor(result.qualityReport.overallScore)}`}>
                        {result.qualityReport.overallScore}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Weighted score
                      </div>
                    </div>
                  </div>

                  {/* SEO Issues and Suggestions */}
                  {(result.qualityReport.seo.issues.length > 0 || result.qualityReport.seo.suggestions.length > 0) && (
                    <div className="p-4 rounded-lg border bg-muted/30">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        SEO Analysis
                      </h4>
                      {result.qualityReport.seo.issues.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Issues:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {result.qualityReport.seo.issues.map((issue, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {result.qualityReport.seo.suggestions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Suggestions:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {result.qualityReport.seo.suggestions.map((suggestion, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Readability Details */}
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Readability Details
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Word Count</span>
                        <div className="font-medium">{result.qualityReport.readability.wordCount}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Words/Sentence</span>
                        <div className="font-medium">{result.qualityReport.readability.avgWordsPerSentence}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Syllables/Word</span>
                        <div className="font-medium">{result.qualityReport.readability.avgSyllablesPerWord}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reading Level</span>
                        <div className="font-medium">{result.qualityReport.readability.level}</div>
                      </div>
                    </div>
                  </div>

                  {/* Platform Compatibility */}
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Platform Compatibility
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {result.qualityReport.platforms.map((platform) => (
                        <div
                          key={platform.platform}
                          className={`p-3 rounded-lg border text-sm ${getPlatformStatusBg(platform.status)}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{platform.platform}</span>
                            {platform.status === "ok" && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {platform.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                            {platform.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                          </div>
                          <div className={`text-xs ${getPlatformStatusColor(platform.status)}`}>
                            {platform.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

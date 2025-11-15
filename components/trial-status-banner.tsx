"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Info, Sparkles, UserPlus, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";

{
  /* To be implemented */
}
// interface TrialStatus {
//   tool: string;
//   canUse: boolean;
//   usageCount: number;
//   remainingUses: number;
//   limitReached: boolean;
// }

{
  /* Temporary fix */
}
interface TrialStatus {
  tool: string;
  allowed: boolean;
  remaining: number;
  message: string;
  resetTime: string;
}

const TOOL_NAMES: Record<string, string> = {
  alt_text_generator: "Alt Text Generator",
  contrast_checker: "Contrast Checker",
  accessibility_checker: "Accessibility Checker",
  accessibility_audit_helper: "Audit Helper",
  url_accessibility_auditor: "URL Auditor",
};

export default function TrialStatusBanner() {
  const { isSignedIn } = useUser();
  const [trialStatus, setTrialStatus] = useState<TrialStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchTrialStatus = async () => {
      if (isSignedIn) {
        setTrialStatus([]);
        setIsVisible(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/trial-status");
        if (response.ok) {
          const data = await response.json();
          setTrialStatus(data);
          setIsVisible(data.length > 0);
        }
      } catch (error) {
        console.error("Failed to fetch trial status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrialStatus();
  }, [isSignedIn]);

  if (isSignedIn || !isVisible || isLoading) {
    return null;
  }

  const totalTrials = trialStatus.length * 5;
  const usedTrials =
    totalTrials -
    trialStatus.reduce((sum, status) => sum + status.remaining, 0);
  const remainingTrials = totalTrials - usedTrials;

  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Free Trial - Try Our Tools
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You can try each tool up to 5 times for free! Sign up to get 100
                free credits and unlimited access.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Overall Progress
                </span>
                <span className="font-medium">
                  {usedTrials} / {totalTrials} trials used
                </span>
              </div>
              <Progress
                value={(usedTrials / totalTrials) * 100}
                className="h-2"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {remainingTrials} trials remaining across all tools
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {trialStatus.map((status) => (
                <div
                  key={status.tool}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {TOOL_NAMES[status.tool] || status.tool}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {5 - status.remaining}/5 used
                    </div>
                  </div>
                  <Badge
                    variant={status.allowed ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {status.remaining == 0
                      ? "Used Up"
                      : `${status.remaining} left`}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link href="/sign-up">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up - Get 100 Free Credits
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/sign-in">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

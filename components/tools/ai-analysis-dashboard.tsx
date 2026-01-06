import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

/**
 * Interface definition for the structured AI data.
 */
interface AiAnalysisData {
  websiteClassification?: {
    type?: string;
    industry?: string;
    targetAudience?: string;
    complianceRequirements?: string;
  };
  businessImpact?: {
    userExperience?: string;
    reach?: string;
  };
  industryContext?: {
    industryAverage?: string;
    yourPerformance?: string;
    complianceRisk?: string;
  };
  quickWins?: string[];
  businessRecommendations?: {
    prioritize?: string;
    improvementPotential?: string;
    expectedROI?: string;
  };
}

/**
 * Component: AI Analysis Dashboard
 * 
 * Purpose: 
 * This component takes the raw text summary from the AI and tries to display it nicely.
 * If the text is JSON, it shows a structured dashboard.
 */
interface AiAnalysisDashboardProps {
  summaryString: string; // The raw string from the database (JSON)
}

/**
 * Renders an AI analysis dashboard built from a JSON summary string, or a simple fallback view showing the raw summary when parsing fails.
 *
 * @param summaryString - Raw analysis string (typically JSON) sourced from storage; when it contains valid JSON matching the expected structure the component renders structured sections (classification, business impact, benchmarking, quick wins, recommendations), otherwise the raw string is displayed in a fallback block.
 * @returns The rendered JSX element: a multi-section AI analysis dashboard when parsed data is available, or a compact fallback view containing the original summary string when parsing fails.
 */
export function AiAnalysisDashboard({ summaryString }: AiAnalysisDashboardProps) {
  
  // 1. Try to parse the JSON string into an object.
  const parseAiSummary = (rawString: string): AiAnalysisData | null => {
    if (!rawString) return null;
    try {
      return JSON.parse(rawString);
    } catch (error) {
      return null;
    }
  };

  const aiData = parseAiSummary(summaryString);

  // 2. CHECK: Did we get valid structured data?
  // If NOT, we likely have an older audit record that is just plain text.
  // Render the "Fallback" view for backward compatibility.
  if (!aiData) {
    return (
      <div className="prose prose-sm max-w-none">
         <div className="p-4 rounded-lg bg-background/50 border">
             <h4 className="font-semibold mb-2">Analysis Summary</h4>
             <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans">
                 {summaryString}
             </pre>
         </div>
      </div>
    );
  }

  // 3. RENDER
  return (
    <div className="space-y-6">
      
      <div className="p-4 rounded-lg bg-background/50 border">
        <h4 className="font-semibold text-sm uppercase tracking-wide text-primary mb-3 flex items-center gap-2">
          📊 Website Classification
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
           <InfoItem label="Type" value={aiData.websiteClassification?.type} capitalize />
           <InfoItem label="Industry" value={aiData.websiteClassification?.industry} />
           <InfoItem label="Target Audience" value={aiData.websiteClassification?.targetAudience} capitalize />
           <InfoItem label="Compliance" value={aiData.websiteClassification?.complianceRequirements} span={2} />
        </div>
      </div>

      <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
        <h4 className="font-semibold text-sm uppercase tracking-wide text-orange-700 mb-3 flex items-center gap-2">
          📈 Business Impact Analysis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
           <BusinessCard title="User Experience Impact" content={aiData.businessImpact?.userExperience} />
           <BusinessCard title="Market Reach Impact" content={aiData.businessImpact?.reach} />
        </div>
      </div>

      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
        <h4 className="font-semibold text-sm uppercase tracking-wide text-blue-700 mb-3 flex items-center gap-2">
          🎯 Industry Benchmarking
        </h4>
        <div className="space-y-3 text-sm">
           <div className="flex items-center justify-between">
             <span className="text-muted-foreground">Industry Average:</span>
             <span className="font-medium">{aiData.industryContext?.industryAverage || "N/A"}</span>
           </div>

           <div className="flex items-center justify-between">
             <span className="text-muted-foreground">Your Performance:</span>
             <PerformanceBadge text={aiData.industryContext?.yourPerformance} />
           </div>

           <div className="flex items-center justify-between">
             <span className="text-muted-foreground">Compliance Risk:</span>
             <RiskBadge text={aiData.industryContext?.complianceRisk} />
           </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
        <h4 className="font-semibold text-sm uppercase tracking-wide text-green-700 mb-3 flex items-center gap-2">
          🚀 Quick Wins Available
        </h4>
        <div className="text-sm space-y-2">
           {aiData.quickWins && aiData.quickWins.length > 0 ? (
             aiData.quickWins.map((win, index) => (
               <div key={index} className="flex items-start gap-2">
                 <div className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                 <span>{win}</span>
               </div>
             ))
           ) : (
             <span className="text-muted-foreground italic">No quick wins identified.</span>
           )}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
        <h4 className="font-semibold text-sm uppercase tracking-wide text-purple-700 mb-3 flex items-center gap-2">
          💼 Strategic Recommendations
        </h4>
        <div className="space-y-3 text-sm">
           <RecommendationCard title="Priority Focus" content={aiData.businessRecommendations?.prioritize} />
           <RecommendationCard title="Improvement Potential" content={aiData.businessRecommendations?.improvementPotential} />
           <RecommendationCard title="Expected ROI" content={aiData.businessRecommendations?.expectedROI} />
        </div>
      </div>

    </div>
  );
}


/**
 * Render a labeled info cell for grid layouts when a value is present.
 *
 * @param label - The label text shown before the value (e.g., "Industry")
 * @param value - The value to display; the component returns `null` if this is falsy
 * @param capitalize - When true, apply CSS `capitalize` to the displayed value
 * @param span - Number of grid columns the item should span (1 means no extra span class)
 * @returns A JSX element containing the label and value styled for a grid column, or `null` if `value` is falsy
 */

function InfoItem({ label, value, capitalize = false, span = 1 }: { label: string, value?: string, capitalize?: boolean, span?: number }) {
    if (!value) return null;
    return (
        <div className={span > 1 ? `col-span-${span}` : ""}>
            <span className="text-muted-foreground">{label}:</span>
            <span className={`ml-2 font-medium ${capitalize ? 'capitalize' : ''}`}>{value}</span>
        </div>
    );
}

/**
 * Render a compact titled card that displays provided content or a visible fallback.
 *
 * @param title - The card's title shown above the content
 * @param content - The body text to display; shows `"N/A"` when falsy
 * @returns A JSX element containing the titled, bordered card with the content or `"N/A"`
 */
function BusinessCard({ title, content }: { title: string, content?: string }) {
    return (
        <div className="p-3 bg-white rounded border">
            <div className="font-medium text-muted-foreground mb-1">{title}:</div>
            <div>{content || "N/A"}</div>
        </div>
    )
}

/**
 * Renders a small titled card showing a recommendation and its content.
 *
 * @param title - The card title shown in purple (e.g., "Priority Focus")
 * @param content - The recommendation text; displays `"N/A"` when omitted or falsy
 * @returns A JSX element containing the titled card with the provided content or `"N/A"`
 */
function RecommendationCard({ title, content }: { title: string, content?: string }) {
    return (
        <div className="p-3 bg-white rounded border">
            <div className="font-medium text-purple-700 mb-1">{title}:</div>
            <div>{content || "N/A"}</div>
        </div>
    )
}

/**
 * Renders a performance-styled Badge whose variant is inferred from the provided text.
 *
 * @param text - Optional performance description used to determine the badge variant:
 *               - If it contains "Above Average", the default variant is used.
 *               - If it contains "Average" but not "Below", the secondary variant is used.
 *               - Otherwise the destructive variant is used.
 * @returns A Badge React element displaying `text` or `"N/A"` with the inferred variant.
 */
function PerformanceBadge({ text }: { text?: string }) {
    const isGood = text?.includes('Above Average');
    const isAverage = text?.includes('Average') && !text?.includes('Below');
    let variant: "default" | "secondary" | "destructive" = "destructive";
    if (isGood) variant = "default";
    else if (isAverage) variant = "secondary";

    return <Badge variant={variant}>{text || "N/A"}</Badge>;
}

/**
 * Render a risk-level Badge inferred from the provided risk text.
 *
 * The badge variant is chosen by scanning the `text` for specific keywords:
 * - contains `"HIGH"` → `destructive`
 * - contains `"MEDIUM"` → `secondary`
 * - otherwise → `default`
 *
 * @param text - Optional risk description; matching is case-sensitive and performed by substring inclusion
 * @returns A Badge element displaying `text` or `"N/A"` when `text` is falsy
 */
function RiskBadge({ text }: { text?: string }) {
    const isHigh = text?.includes('HIGH');
    const isMedium = text?.includes('MEDIUM');
    
    let variant: "default" | "secondary" | "destructive" = "default"; // Low risk is default (primary color usually safe)
    if (isHigh) variant = "destructive";
    else if (isMedium) variant = "secondary";

    return <Badge variant={variant}>{text || "N/A"}</Badge>;
}
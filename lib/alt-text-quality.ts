/**
 * Alt Text Quality Scoring Utilities
 * Provides SEO scoring, readability analysis, and platform compatibility checks
 */

// Platform character limits
export const PLATFORM_LIMITS = {
  twitter: { max: 1000, recommended: 280, name: "Twitter/X" },
  instagram: { max: 2200, recommended: 125, name: "Instagram" },
  facebook: { max: 500, recommended: 125, name: "Facebook" },
  linkedin: { max: 300, recommended: 150, name: "LinkedIn" },
  pinterest: { max: 500, recommended: 100, name: "Pinterest" },
  html: { max: Infinity, recommended: 125, name: "HTML/Web" },
} as const;

export type PlatformKey = keyof typeof PLATFORM_LIMITS;

export interface PlatformCompatibility {
  platform: string;
  status: "ok" | "warning" | "error";
  message: string;
  characterCount: number;
  limit: number;
}

export interface SEOScore {
  score: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  issues: string[];
  suggestions: string[];
}

export interface ReadabilityScore {
  score: number; // 0-100 (Flesch Reading Ease)
  level: string;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  wordCount: number;
}

export interface QualityReport {
  seo: SEOScore;
  readability: ReadabilityScore;
  platforms: PlatformCompatibility[];
  overallScore: number;
}

/**
 * Count syllables in a word (approximate)
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;

  const vowels = "aeiouy";
  let count = 0;
  let prevWasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !prevWasVowel) {
      count++;
    }
    prevWasVowel = isVowel;
  }

  // Handle silent e
  if (word.endsWith("e") && count > 1) {
    count--;
  }

  // Handle -le endings
  if (word.endsWith("le") && word.length > 2 && !vowels.includes(word[word.length - 3])) {
    count++;
  }

  return Math.max(1, count);
}

/**
 * Calculate SEO score for alt text
 */
export function calculateSEOScore(altText: string, context?: string): SEOScore {
  let score = 100;
  const issues: string[] = [];
  const suggestions: string[] = [];

  const charCount = altText.length;
  const words = altText.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  // Length checks
  if (charCount < 20) {
    score -= 25;
    issues.push("Alt text is too short (less than 20 characters)");
    suggestions.push("Add more descriptive details about the image");
  } else if (charCount < 50) {
    score -= 10;
    issues.push("Alt text could be more descriptive");
    suggestions.push("Consider adding more context about the image");
  }

  if (charCount > 300) {
    score -= 15;
    issues.push("Alt text may be too long for optimal SEO");
    suggestions.push("Consider condensing to under 200 characters");
  }

  // Check for keyword stuffing (repeated words)
  const wordFreq: Record<string, number> = {};
  words.forEach((word) => {
    const lower = word.toLowerCase();
    wordFreq[lower] = (wordFreq[lower] || 0) + 1;
  });

  const repeatedWords = Object.entries(wordFreq)
    .filter(([word, count]) => count > 2 && word.length > 3)
    .map(([word]) => word);

  if (repeatedWords.length > 0) {
    score -= 10;
    issues.push(`Repeated words detected: ${repeatedWords.join(", ")}`);
    suggestions.push("Avoid repeating the same words multiple times");
  }

  // Check for bad patterns
  if (/^(image of|picture of|photo of)/i.test(altText)) {
    score -= 5;
    issues.push('Starts with redundant phrase ("image of", etc.)');
    suggestions.push('Remove phrases like "image of" or "picture of"');
  }

  if (/^(a |an |the )/i.test(altText)) {
    score -= 3;
    issues.push("Starts with an article");
    suggestions.push("Start with the main subject for better SEO");
  }

  // Check for context keyword inclusion
  if (context) {
    const contextWords = context
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 4);
    const altLower = altText.toLowerCase();
    const matchedKeywords = contextWords.filter((w) => altLower.includes(w));

    if (matchedKeywords.length < contextWords.length * 0.3 && contextWords.length > 0) {
      score -= 10;
      issues.push("Missing context keywords");
      suggestions.push("Include relevant keywords from the context");
    }
  }

  // Check for descriptive language
  const hasAction = /\b(showing|displaying|featuring|demonstrates|illustrates|depicts|contains|includes)\b/i.test(
    altText
  );
  const hasAdjective = /\b(large|small|red|blue|green|bright|dark|modern|traditional|professional)\b/i.test(
    altText
  );

  if (!hasAction && !hasAdjective && wordCount > 5) {
    score -= 5;
    suggestions.push("Add descriptive adjectives or action words");
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Determine grade
  let grade: "A" | "B" | "C" | "D" | "F";
  if (score >= 90) grade = "A";
  else if (score >= 80) grade = "B";
  else if (score >= 70) grade = "C";
  else if (score >= 60) grade = "D";
  else grade = "F";

  return { score, grade, issues, suggestions };
}

/**
 * Calculate readability score using Flesch Reading Ease
 */
export function calculateReadability(text: string): ReadabilityScore {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);

  if (words.length === 0 || sentences.length === 0) {
    return {
      score: 100,
      level: "Very Easy",
      avgWordsPerSentence: 0,
      avgSyllablesPerWord: 0,
      wordCount: 0,
    };
  }

  const totalSyllables = words.reduce(
    (count, word) => count + countSyllables(word),
    0
  );

  const avgWordsPerSentence = words.length / sentences.length;
  const avgSyllablesPerWord = totalSyllables / words.length;

  // Flesch Reading Ease formula
  const fleschScore =
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;

  const score = Math.max(0, Math.min(100, Math.round(fleschScore)));

  // Determine reading level
  let level: string;
  if (score >= 90) level = "Very Easy";
  else if (score >= 80) level = "Easy";
  else if (score >= 70) level = "Fairly Easy";
  else if (score >= 60) level = "Standard";
  else if (score >= 50) level = "Fairly Difficult";
  else if (score >= 30) level = "Difficult";
  else level = "Very Difficult";

  return {
    score,
    level,
    avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
    wordCount: words.length,
  };
}

/**
 * Check platform compatibility for alt text
 */
export function checkPlatformCompatibility(
  altText: string
): PlatformCompatibility[] {
  const charCount = altText.length;
  const results: PlatformCompatibility[] = [];

  for (const [key, limit] of Object.entries(PLATFORM_LIMITS)) {
    let status: "ok" | "warning" | "error";
    let message: string;

    if (charCount > limit.max) {
      status = "error";
      message = `Exceeds maximum (${charCount}/${limit.max})`;
    } else if (charCount > limit.recommended * 1.5) {
      status = "warning";
      message = `Above recommended (${charCount}/${limit.recommended})`;
    } else {
      status = "ok";
      message = `Good length (${charCount}/${limit.recommended})`;
    }

    results.push({
      platform: limit.name,
      status,
      message,
      characterCount: charCount,
      limit: limit.max,
    });
  }

  return results;
}

/**
 * Generate a comprehensive quality report for alt text
 */
export function generateQualityReport(
  altText: string,
  context?: string
): QualityReport {
  const seo = calculateSEOScore(altText, context);
  const readability = calculateReadability(altText);
  const platforms = checkPlatformCompatibility(altText);

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    seo.score * 0.5 + readability.score * 0.3 + (seo.issues.length === 0 ? 20 : 0)
  );

  return {
    seo,
    readability,
    platforms,
    overallScore,
  };
}

/**
 * Get a quick quality indicator color
 */
export function getQualityColor(score: number): string {
  if (score >= 80) return "green";
  if (score >= 60) return "yellow";
  if (score >= 40) return "orange";
  return "red";
}

/**
 * Format quality score as percentage string
 */
export function formatQualityScore(score: number): string {
  return `${score}%`;
}

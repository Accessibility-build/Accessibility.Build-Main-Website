/**
 * Generates a slug from a string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .trim() // Remove whitespace from both ends
}

/**
 * Truncates text to a specified length and adds ellipsis
 * @param text The text to truncate
 * @param maxLength The maximum length of the text
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

/**
 * Generates a meta description from content
 * @param content The content to generate a description from
 * @param maxLength The maximum length of the description
 * @returns A meta description
 */
export function generateMetaDescription(content: string, maxLength = 160): string {
  // Remove HTML tags
  const textContent = content.replace(/<[^>]*>/g, " ")

  // Remove extra whitespace
  const cleanText = textContent.replace(/\s+/g, " ").trim()

  return truncateText(cleanText, maxLength)
}

/**
 * Extracts keywords from content
 * @param content The content to extract keywords from
 * @param tags Optional array of tags to include as keywords
 * @returns An array of keywords
 */
export function extractKeywords(content: string, tags: string[] = []): string[] {
  // Remove HTML tags
  const textContent = content.replace(/<[^>]*>/g, " ")

  // Common words to exclude
  const stopWords = [
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "is",
    "are",
    "was",
    "were",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "by",
    "about",
    "as",
    "of",
  ]

  // Split into words, filter out stop words, and get unique words
  const words = textContent
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 3 && !stopWords.includes(word))

  // Count word frequency
  const wordCounts: Record<string, number> = {}
  words.forEach((word) => {
    wordCounts[word] = (wordCounts[word] || 0) + 1
  })

  // Sort by frequency
  const sortedWords = Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0])

  // Combine with tags and return top 10
  return [...new Set([...tags, ...sortedWords])].slice(0, 10)
}

/**
 * Generates a JSON-LD schema for a webpage
 * @param data The data to include in the schema
 * @returns A JSON-LD schema string
 */
export function generateWebPageSchema(data: {
  title: string
  description: string
  url: string
  image?: string
  datePublished?: string
  dateModified?: string
}): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: data.title,
    description: data.description,
    url: data.url,
    image: data.image,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    isPartOf: {
      "@type": "WebSite",
      name: "Accessibility.build",
      url: "https://accessibility.build",
    },
  }

  return JSON.stringify(schema)
}

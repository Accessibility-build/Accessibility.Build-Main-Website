import { getWcagPageDate } from "@/lib/site-routes";
import { wcagSlug } from "@/lib/wcag-pages";

interface WCAGSEOProps {
  title: string;
  description: string;
  criteria: string;
  level: 'A' | 'AA' | 'AAA';
  principle: string;
  guideline: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  category: string;
  // New enhanced properties for better SEO
  wordCount?: number;
  timeToRead?: number; // in minutes
  hasInteractiveDemo?: boolean;
  relatedCriteria?: string[];
  /**
   * The page's real, visible FAQs. FAQPage schema is emitted ONLY from these —
   * Google requires marked-up Q&A to be present on the page, so we never
   * generate questions that the reader cannot see. Omit on pages that already
   * render <FAQStructuredData> themselves, to avoid two FAQPage nodes.
   */
  faqs?: { q: string; a: string }[];
}

// Static dates for each WCAG criteria to ensure consistency (Google penalizes changing dates)
const WCAG_PUBLISH_DATES: Record<string, string> = {
  "1.1.1": "2024-01-15",
  "1.2.1": "2024-01-20",
  "1.2.2": "2024-01-22",
  "1.2.3": "2024-01-25",
  "1.3.1": "2024-02-01",
  "1.3.2": "2024-02-05",
  "1.3.3": "2024-02-08",
  "1.4.1": "2024-02-12",
  "1.4.2": "2024-02-15",
  "1.4.3": "2024-02-18",
  "2.1.1": "2024-03-01",
  "2.1.2": "2024-03-05",
  "2.1.4": "2024-03-10",
  "2.2.1": "2024-03-15",
  "2.2.2": "2024-03-20",
  "2.3.1": "2024-03-25",
  "2.4.1": "2024-04-01",
  "2.4.2": "2024-04-05",
  "2.4.3": "2024-04-10",
  "2.4.4": "2024-04-15",
};

// Get stable dates for SEO consistency.
// dateModified comes from lib/site-routes.ts — the same source the XML sitemap
// uses — so the schema, the sitemap, and reality cannot drift apart.
function getStableDates(criteria: string, providedPublished?: string, providedModified?: string) {
  const routeDate = getWcagPageDate(wcagSlug(criteria));
  const baseDate = WCAG_PUBLISH_DATES[criteria] || routeDate;
  const publishDate = providedPublished || `${baseDate}T10:00:00Z`;
  const modifiedDate = providedModified || `${routeDate}T10:00:00Z`;

  // Never claim the page was modified before it was published.
  return {
    publishDate,
    modifiedDate: modifiedDate < publishDate ? publishDate : modifiedDate,
  };
}

export default function WCAGSEOEnhancements({
  title,
  description,
  criteria,
  level,
  principle,
  guideline,
  url,
  datePublished,
  dateModified,
  author = "Khushwant Parihar",
  category,
  // No default: a hardcoded count would claim the same length for all 86
  // criterion pages. Omitted from the schema entirely when not supplied.
  wordCount,
  timeToRead = 8,
  hasInteractiveDemo = true,
  relatedCriteria = [],
  faqs
}: WCAGSEOProps) {

  const { publishDate, modifiedDate } = getStableDates(criteria, datePublished, dateModified);

  // Construct the criteria name properly
  const criteriaName = title.includes(':')
    ? title.split(':')[1]?.trim()
    : title.replace(/^WCAG\s*\d+\.\d+\.\d+\s*/i, '').trim();

  // Enhanced Article Schema with all recommended properties
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#article`,
    "headline": title,
    "name": title,
    "description": description,
    "author": {
      // A named human is a Person, not an Organization.
      "@type": "Person",
      "@id": "https://accessibility.build/#person",
      "name": author,
      "url": "https://accessibility.build/about"
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://accessibility.build/#organization",
      "name": "Accessibility Build",
      "logo": {
        "@type": "ImageObject",
        "url": "https://accessibility.build/android-chrome-512x512.png",
        "width": 512,
        "height": 512
      }
    },
    "datePublished": publishDate,
    "dateModified": modifiedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "image": {
      "@type": "ImageObject",
      "url": `https://accessibility.build/api/og?title=${encodeURIComponent(`WCAG ${criteria} ${criteriaName}`)}&section=WCAG`,
      "width": 1200,
      "height": 630
    },
    "articleSection": category,
    ...(wordCount ? { "wordCount": wordCount } : {}),
    "timeRequired": `PT${timeToRead}M`,
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "keywords": [
      `WCAG ${criteria}`,
      criteriaName,
      `Level ${level}`,
      "accessibility",
      "web accessibility",
      "WCAG 2.2",
      principle,
      guideline,
      "compliance",
      "inclusive design",
      "digital accessibility",
      "accessibility testing",
      "ADA compliance"
    ],
    "about": [
      {
        "@type": "Thing",
        "name": `WCAG ${criteria}`,
        "description": `Web Content Accessibility Guidelines success criterion ${criteria}`
      },
      {
        "@type": "Thing",
        "name": "Web Accessibility",
        "sameAs": "https://www.w3.org/WAI/fundamentals/accessibility-intro/"
      }
    ],
    "mentions": [
      {
        "@type": "Thing",
        "name": "WCAG 2.2",
        "sameAs": "https://www.w3.org/TR/WCAG22/"
      },
      {
        "@type": "Thing",
        "name": "W3C",
        "sameAs": "https://www.w3.org/"
      }
    ],
    "teaches": {
      "@type": "DefinedTerm",
      "name": `WCAG ${criteria} ${criteriaName}`,
      "description": `How to implement and test ${title} for web accessibility compliance`
    },
    "educationalLevel": level === 'AAA' ? "Advanced" : level === 'AA' ? "Intermediate" : "Beginner",
    "learningResourceType": "Tutorial",
    "audience": {
      "@type": "Audience",
      "audienceType": ["Web Developers", "UX Designers", "Accessibility Specialists", "QA Engineers"]
    },
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "copyrightYear": Number(publishDate.slice(0, 4)),
    "copyrightHolder": {
      "@type": "Organization",
      "name": "Accessibility Build"
    }
  };

  // Enhanced WebPage Schema with speakable for voice search
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    "name": title,
    "description": description,
    "url": url,
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://accessibility.build/#website"
    },
    "about": {
      "@type": "Thing",
      "name": `WCAG ${criteria} ${criteriaName}`
    },
    "mainEntity": {
      "@id": `${url}#article`
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://accessibility.build"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "WCAG 2.2 Checklist",
          "item": "https://accessibility.build/wcag"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": principle,
          "item": `https://accessibility.build/wcag#${principle.toLowerCase()}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": `WCAG ${criteria}`,
          "item": url
        }
      ]
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", ".summary", ".key-requirements", ".testing-methods"]
    },
    "lastReviewed": modifiedDate,
    "reviewedBy": {
      "@type": "Organization",
      "@id": "https://accessibility.build/#organization"
    },
    "specialty": "Web Accessibility",
    "significantLink": [
      "https://www.w3.org/TR/WCAG22/",
      `https://www.w3.org/WAI/WCAG22/Understanding/${criteria.replace(/\./g, '')}`
    ]
  };

  // FAQPage schema built ONLY from the page's real, visible FAQs.
  //
  // This previously emitted five templated questions with the criterion number
  // swapped in, which (a) were not the Q&A actually rendered on the page —
  // a Google FAQ-policy violation — (b) produced 86 near-duplicate FAQPage
  // nodes across the site, and (c) asserted unverified statistics ("lawsuits
  // increased 300% since 2018", "$13 trillion disability market",
  // "15-20% of the population") as fact inside machine-readable data.
  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    "mainEntity": faqs.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": a
      }
    }))
  } : null;

  // ItemList for related criteria (improves internal linking signals)
  const relatedContentSchema = relatedCriteria.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#related`,
    "name": "Related WCAG Criteria",
    "description": `Other accessibility guidelines related to ${title}`,
    "itemListElement": relatedCriteria.map((related, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://accessibility.build/wcag/${related.replace(/\./g, '-')}`,
      "name": `WCAG ${related}`
    }))
  } : null;

  return (
    <>
      {/* TechArticle Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* WebPage Schema with Speakable */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* FAQ Schema - only when the page passes its real, visible FAQs */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Related Content Schema */}
      {relatedContentSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedContentSchema) }}
        />
      )}
    </>
  );
}

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

// Get stable dates for SEO consistency
function getStableDates(criteria: string, providedPublished?: string, providedModified?: string) {
  const baseDate = WCAG_PUBLISH_DATES[criteria] || "2024-01-01";
  const publishDate = providedPublished || `${baseDate}T10:00:00Z`;
  // Modified date should be more recent but stable
  const modifiedDate = providedModified || "2025-01-15T10:00:00Z";

  return { publishDate, modifiedDate };
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
  author = "Accessibility Build Team",
  category,
  wordCount = 2500,
  timeToRead = 8,
  hasInteractiveDemo = true,
  relatedCriteria = []
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
      "@type": "Organization",
      "@id": "https://accessibility.build/#organization",
      "name": author,
      "url": "https://accessibility.build"
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
      "url": `https://accessibility.build/images/wcag-${criteria.replace(/\./g, '-')}-og.png`,
      "width": 1200,
      "height": 630
    },
    "articleSection": category,
    "articleBody": `Comprehensive guide to ${title} covering requirements, implementation techniques, testing methods, and code examples.`,
    "wordCount": wordCount,
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
    "copyrightYear": 2024,
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

  // Enhanced FAQPage Schema with specific, valuable answers (improves rich snippet chances)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is WCAG ${criteria} ${criteriaName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `WCAG ${criteria} "${criteriaName}" is a Level ${level} success criterion under the ${principle} principle and ${guideline} guideline. It requires that ${description.toLowerCase()}. This criterion is ${level === 'A' ? 'essential for basic accessibility' : level === 'AA' ? 'required for most legal compliance standards including ADA and Section 508' : 'recommended for enhanced accessibility'}. Meeting this criterion helps ensure your website is accessible to users with disabilities.`
        }
      },
      {
        "@type": "Question",
        "name": `How do I test for WCAG ${criteria} compliance?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `To test WCAG ${criteria} compliance: 1) Use automated tools like axe DevTools, WAVE, or Lighthouse to detect obvious violations. 2) Perform manual testing using keyboard-only navigation and screen readers (NVDA, JAWS, VoiceOver). 3) Check the specific requirements in our interactive demo above. 4) Verify with real users who have disabilities when possible. Our interactive testing tool on this page provides hands-on practice for this specific criterion.`
        }
      },
      {
        "@type": "Question",
        "name": `What are the consequences of failing WCAG ${criteria}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Failing WCAG ${criteria} can result in: 1) Legal liability under ADA, Section 508, EAA (Europe), or AODA (Canada) - accessibility lawsuits increased 300% since 2018. 2) Exclusion of ${level === 'A' ? 'users with severe disabilities who cannot access basic functionality' : level === 'AA' ? 'approximately 15-20% of the population with various disabilities' : 'users needing enhanced accessibility features'}. 3) SEO penalties as search engines increasingly favor accessible sites. 4) Damage to brand reputation and customer trust. 5) Lost revenue from the $13 trillion disability market.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the difference between WCAG Level A, AA, and AAA?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `WCAG has three conformance levels: Level A (minimum/essential) - 30 criteria that address the most critical barriers. Level AA (standard/recommended) - 20 additional criteria that most laws require (ADA, Section 508, EN 301 549). Level AAA (enhanced/optimal) - 28 additional criteria for maximum accessibility. WCAG ${criteria} is Level ${level}, which means it is ${level === 'A' ? 'a fundamental requirement for any accessible website' : level === 'AA' ? 'required for legal compliance in most jurisdictions' : 'an enhancement that goes beyond typical requirements'}.`
        }
      },
      {
        "@type": "Question",
        "name": `How do I fix WCAG ${criteria} violations?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `To fix WCAG ${criteria} violations: 1) Identify all instances using automated scanning and manual testing. 2) Review our implementation examples and code snippets in the Implementation section below. 3) Apply the fixes using semantic HTML, ARIA attributes, or CSS as appropriate. 4) Test your fixes with assistive technologies. 5) Document your remediation for compliance records. Our interactive demo includes copyable code examples for common ${criteriaName?.toLowerCase() || 'accessibility'} scenarios.`
        }
      }
    ]
  };

  // Enhanced HowTo Schema with detailed steps and totalTime
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${url}#howto`,
    "name": `How to Implement WCAG ${criteria} ${criteriaName}`,
    "description": `Complete step-by-step guide to implementing ${title} for WCAG 2.2 compliance. Learn requirements, coding techniques, and testing methods.`,
    "image": `https://accessibility.build/images/wcag-${criteria.replace(/\./g, '-')}.png`,
    "totalTime": `PT${timeToRead + 15}M`,
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "HTML/CSS/JavaScript knowledge"
      },
      {
        "@type": "HowToSupply",
        "name": "Code editor (VS Code, WebStorm, etc.)"
      },
      {
        "@type": "HowToSupply",
        "name": "Screen reader for testing (NVDA, VoiceOver, JAWS)"
      },
      {
        "@type": "HowToSupply",
        "name": "Modern web browser with DevTools"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "axe DevTools browser extension"
      },
      {
        "@type": "HowToTool",
        "name": "WAVE accessibility evaluation tool"
      },
      {
        "@type": "HowToTool",
        "name": "Chrome/Firefox DevTools Accessibility panel"
      },
      {
        "@type": "HowToTool",
        "name": "Accessibility Insights for Web"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Understand the Requirement",
        "text": `Read and understand what WCAG ${criteria} requires. The criterion states: ${description}. Review the official W3C understanding document for detailed guidance.`,
        "url": `${url}#understanding`,
        "image": `https://accessibility.build/images/wcag-${criteria.replace(/\./g, '-')}-step1.png`
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Audit Current Implementation",
        "text": `Use automated tools (axe, WAVE, Lighthouse) to scan your website for ${criteriaName?.toLowerCase() || 'this criterion'} violations. Document all instances that need remediation.`,
        "url": `${url}#audit`
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Review Code Examples",
        "text": `Study the implementation examples in our interactive demo. Copy the accessible code patterns that apply to your use case. Pay attention to semantic HTML, ARIA attributes, and keyboard interactions.`,
        "url": `${url}#examples`
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Implement the Fix",
        "text": `Apply the appropriate technique to your codebase. For ${criteriaName?.toLowerCase() || 'this criterion'}, ensure you follow the specific requirements outlined in this guide. Use semantic HTML first, then enhance with ARIA only when necessary.`,
        "url": `${url}#implementation`
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Test with Assistive Technology",
        "text": `Verify your implementation works correctly with screen readers (NVDA, VoiceOver, JAWS), keyboard-only navigation, and other assistive technologies. Use our interactive testing tool to validate compliance.`,
        "url": `${url}#testing`
      },
      {
        "@type": "HowToStep",
        "position": 6,
        "name": "Document and Monitor",
        "text": `Record your remediation efforts for compliance documentation. Set up automated accessibility testing in your CI/CD pipeline to prevent regression.`,
        "url": `${url}#documentation`
      }
    ]
  };

  // Course Schema for educational value (helps with knowledge graph)
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${url}#course`,
    "name": `WCAG ${criteria} ${criteriaName} - Complete Tutorial`,
    "description": `Learn everything about ${title} including requirements, implementation techniques, testing methods, and real-world examples.`,
    "provider": {
      "@type": "Organization",
      "@id": "https://accessibility.build/#organization"
    },
    "educationalLevel": level === 'AAA' ? "Advanced" : level === 'AA' ? "Intermediate" : "Beginner",
    "teaches": `WCAG ${criteria} ${criteriaName}`,
    "assesses": `Understanding and implementing ${title}`,
    "competencyRequired": "Basic HTML and CSS knowledge",
    "educationalCredentialAwarded": "WCAG 2.2 Knowledge",
    "timeRequired": `PT${timeToRead}M`,
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": ["Web Developer", "UX Designer", "QA Engineer", "Accessibility Specialist"]
    },
    "hasCourseInstance": hasInteractiveDemo ? {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": `PT${timeToRead}M`
    } : undefined
  };

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

      {/* FAQ Schema - Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* HowTo Schema - Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* Course Schema - Educational Content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

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

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
}

export default function WCAGSEOEnhancements({
  title,
  description,
  criteria,
  level,
  principle,
  guideline,
  url,
  datePublished = new Date().toISOString(),
  dateModified = new Date().toISOString(),
  author = "Accessibility Build Team",
  category
}: WCAGSEOProps) {
  // Article Schema Markup
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Organization",
      "name": author,
      "url": "https://accessibilitybuild.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Accessibility Build",
      "logo": {
        "@type": "ImageObject",
        "url": "https://accessibilitybuild.com/logo.png"
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": category,
    "keywords": [
      `WCAG ${criteria}`,
      `Level ${level}`,
      "accessibility",
      "web accessibility",
      "WCAG 2.2",
      principle,
      guideline,
      "compliance",
      "inclusive design",
      "digital accessibility"
    ],
    "about": {
      "@type": "Thing",
      "name": `WCAG ${criteria} ${title.split(':')[1]?.trim() || title}`,
      "description": description
    },
    "teaches": {
      "@type": "Thing",
      "name": "Web Accessibility",
      "description": `How to implement ${title} for better web accessibility`
    },
    "educationalLevel": "Intermediate",
    "learningResourceType": "Tutorial",
    "isAccessibleForFree": true,
    "license": "https://creativecommons.org/licenses/by/4.0/"
  };

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url,
    "mainEntity": {
      "@type": "TechArticle",
      "name": title,
      "description": description
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://accessibilitybuild.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "WCAG 2.2 Checklist",
          "item": "https://accessibilitybuild.com/wcag"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": title
        }
      ]
    },
    "lastReviewed": dateModified,
    "reviewedBy": {
      "@type": "Organization",
      "name": "Accessibility Build Team"
    }
  };

  // FAQPage Schema for common accessibility questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is WCAG ${criteria}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `WCAG ${criteria} is a Level ${level} success criterion that ensures ${description}`
        }
      },
      {
        "@type": "Question",
        "name": `How do I test for WCAG ${criteria} compliance?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `You can test WCAG ${criteria} through manual testing with keyboard navigation, automated accessibility tools, and screen reader testing. Our interactive demo provides hands-on testing tools.`
        }
      },
      {
        "@type": "Question",
        "name": `What happens if I don't meet WCAG ${criteria}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Failing to meet WCAG ${criteria} can create barriers for users with disabilities, potentially violating accessibility laws and excluding users from accessing your content.`
        }
      }
    ]
  };

  // HowTo Schema for implementation guidance
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Implement ${title}`,
    "description": `Step-by-step guide to implementing ${title} for web accessibility`,
    "image": `https://accessibilitybuild.com/images/wcag-${criteria.toLowerCase().replace('.', '-')}.png`,
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Web Development Knowledge"
      },
      {
        "@type": "HowToSupply",
        "name": "Code Editor"
      },
      {
        "@type": "HowToSupply",
        "name": "Screen Reader for Testing"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Accessibility Testing Tools"
      },
      {
        "@type": "HowToTool",
        "name": "Browser DevTools"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Understanding the Requirement",
        "text": `Learn what ${title} requires for accessibility compliance`,
        "url": `${url}#requirements`
      },
      {
        "@type": "HowToStep",
        "name": "Implementation",
        "text": `Follow the code examples and best practices to implement ${title}`,
        "url": `${url}#implementation`
      },
      {
        "@type": "HowToStep",
        "name": "Testing",
        "text": `Test your implementation using manual and automated testing methods`,
        "url": `${url}#testing`
      }
    ]
  };

  return (
    <>
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* HowTo Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </>
  );
} 
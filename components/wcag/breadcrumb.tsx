import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  current: string;
}

export default function WCAGBreadcrumb({ items, current }: BreadcrumbProps) {
  const allItems = [
    { label: 'Home', href: '/' },
    { label: 'WCAG 2.2 Checklist', href: '/wcag' },
    ...items
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      ...allItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": item.href ? `https://accessibilitybuild.com${item.href}` : undefined
      })),
      {
        "@type": "ListItem",
        "position": allItems.length + 1,
        "name": current,
        "item": undefined
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {allItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index === 0 && <Home className="w-4 h-4 mr-1" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
              {index < allItems.length - 1 && (
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              )}
            </li>
          ))}
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium">{current}</span>
          </li>
        </ol>
      </nav>
    </>
  );
} 
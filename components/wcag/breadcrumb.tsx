import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

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
    { label: "Home", href: "/" },
    { label: "WCAG 2.2 Checklist", href: "/wcag" },
    ...items,
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      ...allItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        item: item.href
          ? `https://accessibilitybuild.com${item.href}`
          : undefined,
      })),
      {
        "@type": "ListItem",
        position: allItems.length + 1,
        name: current,
        item: undefined,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600 xs3:flex-nowrap xs3:text-sm">
          {allItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index === 0 && <Home className="w-4 h-4 mr-1 xs3:mr-1" />}
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
                <ChevronRight className="w-4 h-4 mx-1 text-gray-400 xs3:mx-2" />
              )}
            </li>
          ))}
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-1 text-gray-400 xs3:mx-2" />
            <span className="text-gray-900 font-medium">{current}</span>
          </li>
        </ol>
      </nav>
    </>
  );
}

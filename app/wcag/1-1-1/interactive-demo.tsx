"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Eye, EyeOff } from "lucide-react"

interface ExampleItem {
  src: string
  badAlt: string
  goodAlt: string
  explanation: string
  isDecorative?: boolean
  isButton?: boolean
  longDescription?: string
}

interface ExampleCategory {
  category: string
  items: ExampleItem[]
}

const examples: ExampleCategory[] = [
  {
    category: "Informative images",
    items: [
      {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
        badAlt: "chart",
        goodAlt:
          "Bar chart showing quarterly sales growth: Q1 $2.3M, Q2 $2.8M, Q3 $3.1M, Q4 $3.6M, demonstrating 57% year-over-year growth",
        explanation: "Describes the data and trends shown in the chart",
      },
      {
        src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
        badAlt: "office",
        goodAlt:
          "Modern open office space with collaborative workstations, natural lighting, and team members working on laptops",
        explanation: "Describes the environment and activity taking place",
      },
      {
        src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
        badAlt: "coding",
        goodAlt:
          "Developer writing JavaScript code on dual monitors showing a React application with component hierarchy",
        explanation: "Specifies the technology and context of the work",
      },
    ],
  },
  {
    category: "Decorative images",
    items: [
      {
        src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
        badAlt: "abstract background",
        goodAlt: "",
        explanation:
          "Decorative pattern - empty alt attribute allows screen readers to skip",
        isDecorative: true,
      },
      {
        src: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=300&fit=crop",
        badAlt: "geometric shapes",
        goodAlt: "",
        explanation: "Background design element - no informational value",
        isDecorative: true,
      },
    ],
  },
  {
    category: "Functional images",
    items: [
      {
        src: "https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?w=100&h=100&fit=crop",
        badAlt: "download icon",
        goodAlt: "Download PDF report",
        explanation: "Describes the action that will be performed",
        isButton: true,
      },
      {
        src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop",
        badAlt: "search",
        goodAlt: "Search products",
        explanation: "Describes the function, not the appearance",
        isButton: true,
      },
    ],
  },
  {
    category: "Complex images",
    items: [
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        badAlt: "chart",
        goodAlt: "Line graph showing website traffic trends over 12 months",
        longDescription:
          "Detailed data: January 45K visitors, February 52K (+15%), March 48K (-8%), April 61K (+27%), May 58K (-5%), June 67K (+16%), July 72K (+7%), August 69K (-4%), September 78K (+13%), October 82K (+5%), November 88K (+7%), December 94K (+7%). Overall growth of 109% from start to end of year.",
        explanation: "Complex data requires both alt text and detailed description",
      },
    ],
  },
]

export default function AltTextDemo() {
  const [showAltText, setShowAltText] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <Button
          onClick={() => setShowAltText(!showAltText)}
          variant={showAltText ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          {showAltText ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {showAltText ? "Hide Alt Text" : "Show Alt Text"}
        </Button>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Toggle to see how alt text appears for screen reader users
        </p>
      </div>

      {examples.map((category) => (
        <div
          key={category.category}
          className="rounded-xl border border-slate-200 dark:border-slate-700 p-6"
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            {category.category}
          </h3>
          <div className="grid gap-8">
            {category.items.map((item) => (
              <div
                key={item.src}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Image
                      src={item.src}
                      alt={showAltText ? item.goodAlt : item.badAlt}
                      width={400}
                      height={300}
                      className="rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                    {showAltText && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Screen Reader Announces:{" "}
                          {item.goodAlt
                            ? `"${item.goodAlt}"`
                            : "(nothing — image is skipped)"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-red-800 dark:text-red-300">
                            Bad Alt Text
                          </span>
                        </div>
                        <code className="text-sm text-red-700 dark:text-red-300 break-words">
                          alt=&quot;{item.badAlt}&quot;
                        </code>
                      </div>

                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800 dark:text-green-300">
                            Good Alt Text
                          </span>
                        </div>
                        <code className="text-sm text-green-700 dark:text-green-300 break-words">
                          alt=&quot;{item.goodAlt}&quot;
                        </code>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                        Why This Works:
                      </h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {item.explanation}
                      </p>
                    </div>

                    {item.longDescription && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                          Long Description:
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {item.longDescription}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

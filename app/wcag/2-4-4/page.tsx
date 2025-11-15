import { Metadata } from "next";

export const metadata: Metadata = {
  title: "WCAG 2.4.4 Link Purpose (In Context) (Level A) - Interactive Demo | Accessibility Build",
  description: "Learn WCAG 2.4.4 Link Purpose with interactive link analysis tools, descriptive link text examples, and context validation. Includes live examples and implementation code.",
  keywords: ["WCAG 2.4.4", "Link Purpose", "descriptive links", "link context", "accessibility", "Level A", "link text"],
  openGraph: {
    title: "WCAG 2.4.4 Link Purpose (In Context) - Interactive Demo",
    description: "Master descriptive link text with interactive analysis tools and context validation examples.",
    type: "article",
    url: "https://accessibilitybuild.com/wcag/2-4-4",
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.4.4 Link Purpose (In Context) - Interactive Demo",
    description: "Master descriptive link text with interactive analysis tools and context validation examples.",
  },
  alternates: {
    canonical: "https://accessibilitybuild.com/wcag/2-4-4",
  },
};

export default function WCAG244Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WCAG 2.4.4: Link Purpose (In Context)
          </h1>
          <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-indigo-800 font-semibold mb-4">
            <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
            Level A
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The purpose of each link can be determined from the link text alone or from the link text together with its programmatically determined link context.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            This interactive demonstration for WCAG 2.4.4 Link Purpose (In Context) is currently being developed. 
            It will include comprehensive examples of descriptive link text, context analysis tools, and implementation guidance.
          </p>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">What's Coming:</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Interactive link text analyzer</li>
              <li>• Context validation tools</li>
              <li>• Good vs bad link examples</li>
              <li>• Implementation code samples</li>
              <li>• Testing methodologies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 
import { Metadata } from "next";
import WCAG243ClientPage from "./client-page";

export const metadata: Metadata = {
  title: "WCAG 2.4.3 Focus Order (Level A) - Interactive Demo | Accessibility Build",
  description: "Master WCAG 2.4.3 Focus Order with interactive focus sequence demonstrations, logical order validation, and keyboard navigation testing tools. Complete guide with live examples, focus tracking, and implementation code for accessible keyboard navigation.",
  keywords: [
    "WCAG 2.4.3", 
    "Focus Order", 
    "keyboard navigation", 
    "tabindex", 
    "focus sequence", 
    "accessibility", 
    "Level A",
    "web accessibility",
    "WCAG 2.2",
    "focus management",
    "logical navigation",
    "keyboard accessibility",
    "assistive technology",
    "screen reader",
    "inclusive design"
  ],
  authors: [{ name: "Accessibility Build Team" }],
  creator: "Accessibility Build",
  publisher: "Accessibility Build",
  openGraph: {
    title: "WCAG 2.4.3 Focus Order - Interactive Focus Tracking & Validation Tools",
    description: "Comprehensive guide to implementing logical focus order. Interactive focus sequence demonstrations, validation tools, and keyboard navigation testing for accessibility compliance.",
    type: "article",
    url: "https://accessibilitybuild.com/wcag/2-4-3",
    siteName: "Accessibility Build",
    locale: "en_US",
    images: [
      {
        url: "https://accessibilitybuild.com/images/wcag-2-4-3-focus-order.png",
        width: 1200,
        height: 630,
        alt: "WCAG 2.4.3 Focus Order Interactive Demo - Keyboard Navigation Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.4.3 Focus Order - Interactive Demo",
    description: "Learn logical focus order with interactive tracking tools and keyboard navigation validation for accessibility compliance.",
    images: ["https://accessibilitybuild.com/images/wcag-2-4-3-twitter.png"],
  },
  alternates: {
    canonical: "https://accessibilitybuild.com/wcag/2-4-3",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Web Accessibility",
};

export default function WCAG243Page() {
  return <WCAG243ClientPage />;
} 
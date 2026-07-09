import { Metadata } from "next";
import WCAG241ClientPage from "./client-page";
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 2.4.1 Bypass Blocks (Level A) - Interactive Demo",
  description: "Master WCAG 2.4.1 Bypass Blocks with interactive skip link demos, navigation bypass mechanisms, and keyboard accessibility tools. Complete guide with live examples, focus tracking, and implementation code for efficient keyboard navigation.",
  keywords: [
    "WCAG 2.4.1", 
    "Bypass Blocks", 
    "skip links", 
    "navigation", 
    "keyboard accessibility", 
    "Level A", 
    "screen reader",
    "web accessibility",
    "WCAG 2.2",
    "focus management",
    "keyboard navigation",
    "accessibility compliance",
    "skip navigation",
    "assistive technology",
    "inclusive design"
  ],
  authors: [{ name: "Accessibility.build Team" }],
  creator: "Accessibility.build",
  publisher: "Accessibility.build",
  openGraph: {
    title: "WCAG 2.4.1 Bypass Blocks - Interactive Skip Link Demo & Tools",
    description: "Comprehensive guide to implementing skip links and navigation bypass mechanisms. Interactive demos, focus tracking tools, and keyboard navigation testing for accessibility compliance.",
    type: "article",
    url: "https://accessibility.build/wcag/2-4-1",
    siteName: "Accessibility.build",
    locale: "en_US",
    images: [
      {
        url: "https://accessibility.build/api/og?title=WCAG%202.4.1%20Bypass%20Blocks&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.4.1 Skip Links Interactive Demo - Keyboard Navigation Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.4.1 Bypass Blocks - Interactive Demo",
    description: "Learn skip links and navigation bypass with interactive demos and keyboard accessibility testing tools.",
    images: ["https://accessibility.build/api/og?title=WCAG%202.4.1%20Bypass%20Blocks&section=WCAG"],
  },
  alternates: {
    canonical: "https://accessibility.build/wcag/2-4-1",
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

export default function WCAG241Page() {
  return (
    <>
      <WCAG241ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="2.4.1" />
      </div>
    </>
  );
} 
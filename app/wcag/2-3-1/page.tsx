import { Metadata } from "next";
import WCAG231ClientPage from "./client-page";

export const metadata: Metadata = {
  title: "WCAG 2.3.1 Three Flashes or Below Threshold (Level A) - Interactive Demo | Accessibility Build",
  description: "Master WCAG 2.3.1 Three Flashes or Below Threshold with interactive flash detection tools, seizure prevention techniques, and safety testing. Includes live demos, code examples, and comprehensive implementation guide for photosensitive epilepsy protection.",
  keywords: [
    "WCAG 2.3.1", 
    "Three Flashes", 
    "seizure prevention", 
    "photosensitive epilepsy", 
    "flash detection", 
    "accessibility", 
    "Level A",
    "web accessibility",
    "WCAG 2.2",
    "seizures",
    "flashing content",
    "epilepsy safety",
    "compliance testing",
    "accessibility audit"
  ],
  authors: [{ name: "Accessibility Build Team" }],
  creator: "Accessibility Build",
  publisher: "Accessibility Build",
  openGraph: {
    title: "WCAG 2.3.1 Three Flashes or Below Threshold - Interactive Demo & Testing Tools",
    description: "Comprehensive guide to implementing seizure-safe web content. Interactive flash detection tools, safety guidelines, and compliance testing for photosensitive epilepsy protection.",
    type: "article",
    url: "https://accessibilitybuild.com/wcag/2-3-1",
    siteName: "Accessibility Build",
    locale: "en_US",
    images: [
      {
        url: "https://accessibilitybuild.com/images/wcag-2-3-1-flash-detection.png",
        width: 1200,
        height: 630,
        alt: "WCAG 2.3.1 Flash Detection Interactive Demo - Seizure Prevention Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.3.1 Three Flashes or Below Threshold - Interactive Demo",
    description: "Learn seizure prevention with interactive flash detection tools and safety guidelines for web accessibility compliance.",
    images: ["https://accessibilitybuild.com/images/wcag-2-3-1-twitter.png"],
  },
  alternates: {
    canonical: "https://accessibilitybuild.com/wcag/2-3-1",
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

export default function WCAG231Page() {
  return <WCAG231ClientPage />;
} 
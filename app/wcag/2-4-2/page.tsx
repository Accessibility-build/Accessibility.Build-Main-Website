import { Metadata } from "next";
import WCAG242ClientPage from "./client-page";

export const metadata: Metadata = {
  title: "WCAG 2.4.2 Page Titled (Level A) - Interactive Demo | Accessibility Build",
  description: "Master WCAG 2.4.2 Page Titled with interactive title analysis tools, SEO optimization techniques, and descriptive page title examples. Complete guide with live validation, title scoring, and implementation code for better user orientation.",
  keywords: [
    "WCAG 2.4.2", 
    "Page Titled", 
    "descriptive titles", 
    "SEO", 
    "accessibility", 
    "Level A", 
    "page titles",
    "web accessibility",
    "WCAG 2.2",
    "title optimization",
    "user orientation",
    "navigation",
    "accessibility compliance",
    "semantic HTML",
    "inclusive design"
  ],
  authors: [{ name: "Accessibility Build Team" }],
  creator: "Accessibility Build",
  publisher: "Accessibility Build",
  openGraph: {
    title: "WCAG 2.4.2 Page Titled - Interactive Title Analysis & SEO Tools",
    description: "Comprehensive guide to creating descriptive page titles. Interactive analysis tools, SEO optimization, title scoring, and validation for accessibility compliance and better user experience.",
    type: "article",
    url: "https://accessibilitybuild.com/wcag/2-4-2",
    siteName: "Accessibility Build",
    locale: "en_US",
    images: [
      {
        url: "https://accessibilitybuild.com/images/wcag-2-4-2-page-titles.png",
        width: 1200,
        height: 630,
        alt: "WCAG 2.4.2 Page Titled Interactive Demo - Title Analysis Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.4.2 Page Titled - Interactive Demo",
    description: "Learn descriptive page titles with interactive analysis tools and SEO optimization techniques for accessibility compliance.",
    images: ["https://accessibilitybuild.com/images/wcag-2-4-2-twitter.png"],
  },
  alternates: {
    canonical: "https://accessibilitybuild.com/wcag/2-4-2",
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

export default function WCAG242Page() {
  return <WCAG242ClientPage />;
} 
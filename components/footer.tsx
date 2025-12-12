"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NewsletterSignup } from "@/components/newsletter-signup";
import ClientOnly from "@/components/client-only";
import {
  Github,
  Twitter,
  Linkedin,
  ArrowUp,
  Shield,
  Zap,
  Heart,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative border-t bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800/50 dark:to-indigo-900/20">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Logo className="h-8 w-auto" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-300" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Accessibility.build
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Professional accessibility platform with AI-powered tools, WCAG
              compliance testing, and comprehensive resources for building
              inclusive digital experiences.
            </p>

            <div className="flex items-center space-x-1 mb-4">
              <Shield className="h-4 w-4 text-green-600" />
              <Badge variant="secondary" className="text-xs">
                WCAG 2.2 Compliant
              </Badge>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              <Link
                href="#"
                className="p-2 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-110 group"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110 group"
                aria-label="View our GitHub"
              >
                <Github className="h-4 w-4 text-muted-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors" />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-white/50 dark:bg-slate-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 hover:scale-110 group"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Tools & Resources */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-blue-600" />
              Tools & Resources
            </h3>
            <ul className="space-y-3">
              {[
                {
                  href: "/tools/accessibility-audit-helper",
                  label: "Accessibility Auditor",
                  badge: "Pro",
                },
                {
                  href: "/tools/alt-text-generator",
                  label: "AI Alt Text Generator",
                  badge: "Popular",
                },
                {
                  href: "/tools/contrast-checker",
                  label: "Contrast Checker",
                  badge: "Free",
                },
                {
                  href: "/tools/heading-analyzer",
                  label: "Heading Analyzer",
                  badge: "Free",
                },
                { href: "/blog", label: "Accessibility Blog" },
                { href: "/resources", label: "Learning Resources" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1"
                  >
                    <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant={
                          item.badge === "Free"
                            ? "secondary"
                            : item.badge === "Popular"
                              ? "default"
                              : "outline"
                        }
                        className="text-xs ml-2"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Company & Legal
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Support" },
                { href: "/faq", label: "FAQ & Help" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/refund", label: "Refund Policy" },
                { href: "/sitemap-page", label: "Sitemap" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1"
                  >
                    <ChevronRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <ClientOnly
              fallback={
                <div className="space-y-3">
                  <div className="h-10 bg-muted/30 rounded animate-pulse" />
                  <div className="h-4 bg-muted/20 rounded animate-pulse" />
                </div>
              }
            >
              <NewsletterSignup
                source="footer"
                compact={true}
                placeholder="Enter your email"
                buttonText="Subscribe"
                className=""
              />
            </ClientOnly>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/30 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <div className="text-lg font-bold text-blue-600">50K+</div>
                <div className="text-xs text-muted-foreground">Tests Run</div>
              </div>
              <div className="text-center p-3 bg-white/30 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                <div className="text-lg font-bold text-indigo-600">99.9%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex flex-col w-full justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="w-full flex flex-col md:!flex-row items-center justify-center space-x-4 text-sm text-muted-foreground">
              <p className="text-center xs2:text-left">
                &copy; {currentYear} Accessibility.build
              </p>

              <span className="hidden md:inline">•</span>

              <p className="flex items-center justify-center xs2:justify-start whitespace-nowrap mt-1 xs2:mt-0">
                <span className="mr-1">Made with</span>
                <span className="inline-flex items-center flex-shrink-0">
                  <Heart className="h-3 w-3 text-red-500" />
                </span>
                <span className="ml-1">for inclusive web</span>
              </p>
            </div>

            {/* External Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="https://www.w3.org/WAI/WCAG22/quickref/"
                target="_blank"
                className="flex items-center text-muted-foreground hover:text-primary transition-colors group"
              >
                WCAG 2.2 Guidelines
                <ExternalLink className="h-3 w-3 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>

              {/* Back to Top Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-blue-50 dark:hover:bg-slate-800 group"
              >
                <span className="text-xs">Back to top</span>
                <ArrowUp className="h-3 w-3 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

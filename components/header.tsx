"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import {
  ChevronDown,
  Menu,
  Search,
  X,
  CreditCard,
  Settings,
  LogOut,
  Coins,
  Grid3X3,
  Star,
  Zap,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Removed framer-motion to fix TypeScript compatibility issues
import { SearchDialog } from "@/components/search/search-dialog";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useCredits } from "@/hooks/use-credits";

type NavItem = {
  name: string;
  href: string;
  children?: {
    name: string;
    href: string;
    description?: string;
    popular?: boolean;
  }[];
};

const navItems: NavItem[] = [
  {
    name: "Tools",
    href: "/tools",
    children: [
      {
        name: "AI Accessibility Audit",
        href: "/tools/accessibility-audit-helper",
        description: "Get expert WCAG analysis",
        popular: true,
      },
      {
        name: "AI Alt Text Generator",
        href: "/tools/alt-text-generator",
        description: "Generate perfect alt text with AI",
        popular: true,
      },
      {
        name: "Color Contrast Checker",
        href: "/tools/contrast-checker",
        description: "Verify WCAG color standards",
        popular: true,
      },
      {
        name: "Heading Structure Analyzer",
        href: "/tools/heading-analyzer",
        description: "Optimize heading hierarchy",
      },
      {
        name: "Color Palette Generator",
        href: "/tools/color-palette-generator",
        description: "Create accessible color schemes",
      },
      {
        name: "Mobile Accessibility Checker",
        href: "/tools/mobile-accessibility-checker",
        description: "Test mobile WCAG compliance",
      },
    ],
  },
  { name: "WCAG 2.2 Checklist", href: "/checklists/wcag-2-2" },
  { name: "Pricing", href: "/pricing" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const { isSignedIn, user } = useUser();
  const { credits, isLoading, refreshCredits } = useCredits();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // Close mobile menu with Escape
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // Refresh credits when user signs in or navigates
  useEffect(() => {
    if (isSignedIn) {
      refreshCredits();
    }
  }, [isSignedIn, pathname, refreshCredits]);

  return (
    <>
      <header
        className={cn(
          "sticky top-4 z-40 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300",
          isScrolled ? "top-2" : "top-4"
        )}
      >
        <div
          className={cn(
            "rounded-full border border-border/40 backdrop-blur-md transition-all duration-300",
            isScrolled
              ? "bg-background/80 py-2 shadow-lg"
              : "bg-background/60 py-3"
          )}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center space-x-2 transition-transform hover:scale-105"
              >
                <Logo className="h-8 w-auto" />
                <span className="font-bold text-lg hidden sm:inline-block">
                  Accessibility.build
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center max-w-4xl mx-8">
              {navItems.map((item) =>
                item.children ? (
                  <DropdownMenu key={item.href}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-colors",
                          pathname.startsWith(item.href)
                            ? "text-primary bg-primary/10 font-semibold"
                            : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                        )}
                      >
                        {item.name}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="rounded-xl p-3 min-w-[280px] bg-background border border-border shadow-xl"
                    >
                      <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Accessibility Tools
                      </DropdownMenuLabel>

                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link
                            href={child.href}
                            className={cn(
                              "w-full rounded-lg px-3 py-3 text-sm flex flex-col items-start gap-1 min-h-[60px]",
                              pathname === child.href
                                ? "bg-primary/10 text-primary font-semibold"
                                : "hover:bg-primary/5"
                            )}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <span className="font-medium">{child.name}</span>
                              {child.popular && (
                                <Badge className="bg-orange-500 text-white border-0 text-xs">
                                  <Star className="h-2.5 w-2.5 mr-1" />
                                  Popular
                                </Badge>
                              )}
                            </div>
                            {child.description && (
                              <span className="text-xs text-muted-foreground">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        </DropdownMenuItem>
                      ))}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link
                          href="/tools"
                          className="w-full rounded-lg px-3 py-2 text-sm hover:bg-primary/5 flex items-center gap-2 font-medium text-primary"
                        >
                          <Grid3X3 className="h-4 w-4" />
                          View All Tools
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap",
                      pathname === item.href
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              <ThemeToggle />

              {/* Authentication */}
              {isSignedIn ? (
                <div className="flex items-center gap-3">
                  {/* Enhanced Credits Display */}
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden sm:flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
                    >
                      <div className="flex items-center gap-1">
                        <div className="p-1 bg-blue-600 rounded-full">
                          <Coins className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-blue-700 dark:text-blue-300 font-semibold">
                          {credits?.currentCredits || 0}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 text-xs">
                          credits
                        </span>
                      </div>
                    </Button>
                  </Link>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <img
                          src={user?.imageUrl}
                          alt="Profile"
                          className="h-8 w-8 rounded-full"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-64 rounded-xl p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl"
                    >
                      {/* User Profile Section */}
                      <div className="flex items-center gap-3 p-3 mb-2">
                        <img
                          src={user?.imageUrl}
                          alt="Profile"
                          className="h-12 w-12 rounded-full border-2 border-blue-200 dark:border-blue-800"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {user?.emailAddresses[0]?.emailAddress}
                          </p>
                        </div>
                      </div>

                      {/* Credits Info */}
                      <div className="p-3 mb-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-blue-600 rounded-full">
                              <Coins className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              Credits
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600 text-white">
                              {credits?.currentCredits || 0}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                refreshCredits();
                              }}
                              className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                          Earned: {credits?.totalCreditsEarned || 0} • Used:{" "}
                          {credits?.totalCreditsUsed || 0}
                        </div>
                      </div>

                      <DropdownMenuSeparator />

                      {/* Dashboard - Solid Background */}
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 transition-colors"
                        >
                          <CreditCard className="h-4 w-4" />
                          <span className="font-medium">Dashboard</span>
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-white/20 text-white border-white/30"
                          >
                            {credits?.currentCredits || 0}
                          </Badge>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Profile Settings</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <div className="p-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                          <SignOutButton redirectUrl="/sign-in">
                            <div className="flex items-center gap-3">
                              <LogOut className="h-4 w-4" />
                              <span>Sign Out</span>
                            </div>
                          </SignOutButton>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="rounded-full"
                  >
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className="rounded-full">
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden">
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-2xl">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <Link
                    href="/"
                    className="flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Logo className="h-8 w-auto" />
                    <span className="font-bold text-lg">
                      Accessibility.build
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Enhanced User Info in Mobile */}
                {isSignedIn && (
                  <div className="p-6 border-b border-border bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={user?.imageUrl}
                        alt="Profile"
                        className="h-14 w-14 rounded-full border-2 border-blue-200 dark:border-blue-800"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-slate-900 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                          {user?.emailAddresses[0]?.emailAddress}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced Mobile Credits Display */}
                    <div className="p-4 bg-blue-600 rounded-xl text-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-white/20 rounded-full">
                            <Coins className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-semibold">Your Credits</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            refreshCredits();
                          }}
                          className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        {credits?.currentCredits || 0}
                      </div>
                      <div className="text-sm text-white/80">
                        Earned: {credits?.totalCreditsEarned || 0} • Used:{" "}
                        {credits?.totalCreditsUsed || 0}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <nav className="space-y-6">
                    {navItems.map((item) => (
                      <div key={item.href} className="space-y-3">
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center justify-between text-lg font-semibold transition-colors py-2",
                            pathname === item.href
                              ? "text-primary"
                              : "text-foreground hover:text-primary"
                          )}
                          onClick={() =>
                            !item.children && setIsMobileMenuOpen(false)
                          }
                        >
                          <span>{item.name}</span>
                          {item.children && <ChevronDown className="h-5 w-5" />}
                        </Link>

                        {item.children && (
                          <div className="pl-4 space-y-3 border-l-2 border-primary/20">
                            {item.children.slice(0, 3).map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "flex flex-col gap-1 py-2 transition-colors",
                                  pathname === child.href
                                    ? "text-primary"
                                    : "text-foreground/80 hover:text-primary"
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {child.name}
                                  </span>
                                  {child.popular && (
                                    <Badge className="bg-orange-500 text-white border-0 text-xs">
                                      <Star className="h-2.5 w-2.5 mr-1" />
                                      Popular
                                    </Badge>
                                  )}
                                </div>
                                {child.description && (
                                  <span className="text-xs text-muted-foreground">
                                    {child.description}
                                  </span>
                                )}
                              </Link>
                            ))}
                            <Link
                              href="/tools"
                              className="flex items-center gap-2 py-2 text-sm text-primary font-medium"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Grid3X3 className="h-4 w-4" />
                              View All Tools
                            </Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Mobile Footer */}
                <div className="border-t border-border p-6">
                  {!isSignedIn && (
                    <div className="flex flex-col gap-3 mb-4">
                      <Button asChild className="w-full rounded-full">
                        <Link
                          href="/sign-up"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        asChild
                        className="w-full rounded-full"
                      >
                        <Link
                          href="/sign-in"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => setIsSearchOpen(true)}
                      aria-label="Search"
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Dialog */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}

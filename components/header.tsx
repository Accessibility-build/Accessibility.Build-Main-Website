"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Star,
  Zap,
  RefreshCw,
  UserRound,
  ScanSearch,
  Image as ImageIcon,
  Contrast,
  Heading,
  Palette,
  Smartphone,
  BookOpenCheck,
  Table2,
  ListOrdered,
  Keyboard,
  Headphones,
  BookOpen,
  AlertTriangle,
  ChartNoAxesCombined,
  Scale,
  Landmark,
  Telescope,
  Library,
  LayoutGrid,
  ChartColumn,
  GraduationCap,
  type LucideIcon,
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
import { POPULAR_BADGE_CLASS } from "@/lib/ui-tokens";

type NavItem = {
  name: string;
  href: string;
  menuLabel?: string;
  menuIcon?: LucideIcon;
  viewAllLabel?: string;
  viewAllIcon?: LucideIcon;
  children?: {
    name: string;
    href: string;
    description?: string;
    popular?: boolean;
    icon: LucideIcon;
  }[];
};

function MenuIcon({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return <Icon className={className} aria-hidden="true" />;
}

const navItems: NavItem[] = [
  {
    name: "Tools",
    href: "/tools",
    menuLabel: "Accessibility tools",
    menuIcon: Zap,
    viewAllLabel: "View all tools",
    viewAllIcon: LayoutGrid,
    children: [
      {
        name: "AI Accessibility Audit",
        href: "/tools/accessibility-audit-helper",
        description: "Get expert WCAG analysis",
        popular: true,
        icon: ScanSearch,
      },
      {
        name: "AI Alt Text Generator",
        href: "/tools/alt-text-generator",
        description: "Generate perfect alt text with AI",
        popular: true,
        icon: ImageIcon,
      },
      {
        name: "Color Contrast Checker",
        href: "/tools/contrast-checker",
        description: "Verify WCAG color standards",
        popular: true,
        icon: Contrast,
      },
      {
        name: "Heading Structure Analyzer",
        href: "/tools/heading-analyzer",
        description: "Optimize heading hierarchy",
        icon: Heading,
      },
      {
        name: "Color Palette Generator",
        href: "/tools/color-palette-generator",
        description: "Create accessible color schemes",
        icon: Palette,
      },
      {
        name: "Mobile Accessibility Checker",
        href: "/tools/mobile-accessibility-checker",
        description: "Test mobile WCAG compliance",
        icon: Smartphone,
      },
    ],
  },
  {
    name: "Learn",
    href: "/learn",
    menuLabel: "Learning resources",
    menuIcon: GraduationCap,
    viewAllLabel: "Explore learning hub",
    viewAllIcon: Library,
    children: [
      {
        name: "WCAG Success Criteria",
        href: "/wcag",
        description: "In-depth guides to all 86 WCAG 2.2 criteria",
        popular: true,
        icon: BookOpenCheck,
      },
      {
        name: "Table Pattern",
        href: "/learn/table",
        description: "Accessible table implementation guide",
        icon: Table2,
      },
      {
        name: "Pagination Pattern",
        href: "/learn/pagination",
        description: "Accessible pagination implementation guide",
        icon: ListOrdered,
      },
      {
        name: "Keyboard Accessibility Guide",
        href: "/guides/keyboard-accessibility",
        description: "Complete keyboard navigation reference",
        icon: Keyboard,
      },
      {
        name: "Screen Reader Testing",
        href: "/guides/screen-reader-testing",
        description: "Test with NVDA, JAWS, VoiceOver",
        icon: Headphones,
      },
      {
        name: "Glossary",
        href: "/glossary",
        description: "Accessibility terms explained",
        icon: BookOpen,
      },
      {
        name: "A11y Hell",
        href: "/hell",
        description: "Experience real accessibility barriers",
        icon: AlertTriangle,
      },
    ],
  },
  {
    name: "Research",
    href: "/research",
    menuLabel: "Research and compliance",
    menuIcon: ChartNoAxesCombined,
    viewAllLabel: "View all research",
    viewAllIcon: ChartColumn,
    children: [
      {
        name: "State of Accessibility",
        href: "/research/state-of-accessibility",
        description: "Annual web accessibility report",
        popular: true,
        icon: ChartNoAxesCombined,
      },
      {
        name: "Lawsuit Tracker",
        href: "/research/accessibility-lawsuits",
        description: "ADA accessibility litigation data",
        icon: Scale,
      },
      {
        name: "Compliance & Laws",
        href: "/compliance",
        description: "ADA, EAA, Section 508, and state laws",
        icon: Landmark,
      },
      {
        name: "WCAG 3.0 Guide",
        href: "/wcag-3",
        description: "Next-gen accessibility standards",
        icon: Telescope,
      },
    ],
  },
  { name: "WCAG 2.2 Checklist", href: "/checklists/wcag-2-2" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

export function Header() {
  const { isSignedIn, user } = useUser();
  const { credits, refreshCredits } = useCredits();
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
    const closeTimer = window.setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => window.clearTimeout(closeTimer);
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
          <div className="flex min-w-0 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex shrink-0 items-center">
              <Link
                href="/"
                aria-label="Accessibility.build home"
                className="flex items-center space-x-2 transition-transform hover:scale-105"
              >
                <Logo className="h-8 w-auto" />
                <span className="hidden text-lg font-bold 2xl:inline-block">
                  Accessibility.build
                </span>
              </Link>
            </div>

            <nav className="mx-6 hidden min-w-0 flex-1 items-center justify-start space-x-1 xl:flex 2xl:mx-8 2xl:max-w-4xl">
              {navItems.map((item) =>
                item.children ? (
                  <DropdownMenu key={item.href}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors 2xl:px-4",
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
                      align="start"
                      className="max-h-[calc(100vh-6rem)] w-[360px] overflow-y-auto rounded-xl border border-border bg-background p-3 shadow-xl"
                    >
                      <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2 text-left">
                        <MenuIcon icon={item.menuIcon ?? Zap} className="h-4 w-4 text-primary" />
                        {item.menuLabel ?? item.name}
                      </DropdownMenuLabel>

                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link
                            href={child.href}
                            className={cn(
                              "grid min-h-[72px] w-full grid-cols-[36px_minmax(0,1fr)] items-start gap-3 rounded-lg px-3 py-3 text-left text-sm",
                              pathname === child.href
                                ? "bg-primary/10 text-primary font-semibold"
                                : "hover:bg-primary/5"
                            )}
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                              <MenuIcon icon={child.icon} className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 text-left">
                              <div className="flex w-full flex-wrap items-center gap-2 text-left">
                                <span className="font-medium">{child.name}</span>
                                {child.popular && (
                                  <Badge className={cn(POPULAR_BADGE_CLASS, "text-xs")}>
                                    <Star className="mr-1 h-2.5 w-2.5" aria-hidden="true" />
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              {child.description && (
                                <span className="mt-1 block w-full text-left text-xs leading-5 text-muted-foreground">
                                  {child.description}
                                </span>
                              )}
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link
                          href={item.href}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-primary hover:bg-primary/5"
                        >
                          <MenuIcon icon={item.viewAllIcon ?? LayoutGrid} className="h-4 w-4" />
                          {item.viewAllLabel ?? `View all ${item.name.toLowerCase()}`}
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors 2xl:px-4",
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

            <div className="flex shrink-0 items-center gap-2">
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
                        aria-label="Open account menu"
                      >
                        {user?.imageUrl ? (
                          <Image
                            src={user.imageUrl}
                            alt=""
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <UserRound className="h-5 w-5" aria-hidden="true" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-64 rounded-xl p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl"
                    >
                      {/* User Profile Section */}
                      <div className="flex items-center gap-3 p-3 mb-2">
                        {user?.imageUrl ? (
                          <Image
                            src={user.imageUrl}
                            alt=""
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-full border-2 border-blue-200 dark:border-blue-800"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-200 dark:border-blue-800">
                            <UserRound className="h-5 w-5" aria-hidden="true" />
                          </div>
                        )}
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
                className="rounded-full xl:hidden"
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
                    aria-label="Accessibility.build home"
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
                      {user?.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt=""
                          width={56}
                          height={56}
                          className="h-14 w-14 rounded-full border-2 border-blue-200 dark:border-blue-800"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-blue-200 dark:border-blue-800">
                          <UserRound className="h-6 w-6" aria-hidden="true" />
                        </div>
                      )}
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
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "grid grid-cols-[28px_minmax(0,1fr)] items-start gap-3 py-2 text-left transition-colors",
                                  pathname === child.href
                                    ? "text-primary"
                                    : "text-foreground/80 hover:text-primary"
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                                  <MenuIcon icon={child.icon} className="h-4 w-4" />
                                </span>
                                <div className="min-w-0 text-left">
                                  <div className="flex flex-wrap items-center gap-2 text-left">
                                    <span className="font-medium">{child.name}</span>
                                    {child.popular && (
                                      <Badge className={cn(POPULAR_BADGE_CLASS, "text-xs")}>
                                        <Star className="mr-1 h-2.5 w-2.5" aria-hidden="true" />
                                        Popular
                                      </Badge>
                                    )}
                                  </div>
                                  {child.description && (
                                    <span className="mt-1 block w-full text-left text-xs leading-5 text-muted-foreground">
                                      {child.description}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            ))}
                            <Link
                              href={item.href}
                              className="flex items-center gap-2 py-2 text-left text-sm font-medium text-primary"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <MenuIcon icon={item.viewAllIcon ?? LayoutGrid} className="h-4 w-4" />
                              {item.viewAllLabel ?? `View all ${item.name.toLowerCase()}`}
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

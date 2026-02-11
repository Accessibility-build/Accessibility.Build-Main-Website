'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Table as TableIcon,
  ListOrdered,
  Sparkles,
  BookOpen,
  Zap,
  Trophy,
  Star,
  Clock,
  ChevronRight,
  Rocket,
  GraduationCap,
  FormInput,
  MessageSquare,
  Navigation,
  GalleryHorizontal,
  Search,
  LucideIcon
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const patterns = [
  {
    id: 'table',
    title: 'Data Tables',
    description: 'Master semantic tables, sorting, selection, and responsive patterns',
    href: '/learn/table',
    icon: TableIcon,
    gradient: 'from-blue-600 via-cyan-600 to-teal-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200 hover:border-blue-400',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    lessons: 6,
    difficulty: 'Intermediate',
    duration: '25 min',
    topics: ['Semantic HTML', 'Sortable Headers', 'Multi-select', 'Inline Editing'],
    featured: true,
  },
  {
    id: 'pagination',
    title: 'Pagination',
    description: 'From page numbers to infinite scroll—every navigation pattern explained',
    href: '/learn/pagination',
    icon: ListOrdered,
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
    bgGradient: 'from-violet-50 to-purple-50',
    borderColor: 'border-violet-200 hover:border-violet-400',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    lessons: 5,
    difficulty: 'Beginner',
    duration: '20 min',
    topics: ['Numbered Pages', 'Infinite Scroll', 'Load More', 'Focus Management'],
    featured: true,
  },
  {
    id: 'modals',
    title: 'Modal Dialogs',
    description: 'Focus trapping, keyboard controls, and proper announcements',
    href: '/learn/modals',
    icon: MessageSquare,
    gradient: 'from-sky-600 via-blue-600 to-indigo-600',
    bgGradient: 'from-sky-50 to-blue-50',
    borderColor: 'border-sky-200 hover:border-sky-400',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    lessons: 5,
    difficulty: 'Intermediate',
    duration: '20 min',
    topics: ['Focus Trap', 'Escape to Close', 'aria-modal', 'Return Focus'],
    featured: false,
  },
  {
    id: 'carousels',
    title: 'Carousels',
    description: 'Auto-play controls, keyboard navigation, and motion preferences',
    href: '/learn/carousels',
    icon: GalleryHorizontal,
    gradient: 'from-rose-600 via-pink-600 to-fuchsia-600',
    bgGradient: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200 hover:border-rose-400',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    lessons: 5,
    difficulty: 'Intermediate',
    duration: '20 min',
    topics: ['Play/Pause', 'Arrow Navigation', 'prefers-reduced-motion', 'Live Regions'],
    featured: false,
  },
  {
    id: 'search',
    title: 'Search & Autocomplete',
    description: 'Combobox patterns, keyboard navigation, and result announcements',
    href: '/learn/search',
    icon: Search,
    gradient: 'from-indigo-600 via-violet-600 to-purple-600',
    bgGradient: 'from-indigo-50 to-violet-50',
    borderColor: 'border-indigo-200 hover:border-indigo-400',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    lessons: 5,
    difficulty: 'Advanced',
    duration: '25 min',
    topics: ['Combobox', 'aria-activedescendant', 'Result Announcements', 'Loading States'],
    featured: false,
  },
];

const comingSoon: { title: string; icon: LucideIcon; description: string; color: string }[] = [
  { title: 'Form Controls', icon: FormInput, description: 'Labels, validation, error handling', color: 'text-emerald-600 bg-emerald-100' },
  { title: 'Navigation Menus', icon: Navigation, description: 'Dropdowns, mega menus, mobile nav', color: 'text-amber-600 bg-amber-100' },
];

const stats = [
  { icon: BookOpen, value: '26', label: 'Interactive Lessons', color: 'text-blue-600 bg-blue-50' },
  { icon: Clock, value: '110', label: 'Minutes of Content', color: 'text-violet-600 bg-violet-50' },
  { icon: Zap, value: '100%', label: 'Hands-on Demos', color: 'text-amber-600 bg-amber-50' },
];

export default function LearnPage() {
  const [hoveredPattern, setHoveredPattern] = useState<string | null>(null);

  return (
    <div className="learn-theme min-h-screen bg-background">
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-full text-muted-foreground text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              Interactive Learning
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-foreground">Learn Accessibility</span>
              <br />
              <span className="text-muted-foreground">By Doing</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Master web accessibility through hands-on interactive demos. No dry documentation—just real patterns you can touch, test, and truly understand.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              {stats.map((stat, idx) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex items-center gap-3 px-5 py-3 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className={cn("p-2 rounded-xl", stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Pattern Cards */}
      <div className="relative px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-green-100 rounded-xl">
              <Rocket className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Start Learning</h2>
            <Badge className="bg-green-100 text-green-700 border-green-200">Available Now</Badge>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {patterns.map((pattern, idx) => {
              const Icon = pattern.icon;
              const isHovered = hoveredPattern === pattern.id;

              return (
                <motion.div key={pattern.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + idx * 0.1 }}>
                  <Link href={pattern.href} onMouseEnter={() => setHoveredPattern(pattern.id)} onMouseLeave={() => setHoveredPattern(null)} className="block group">
                    <div className={cn(
                      "p-7 rounded-2xl border border-border transition-all duration-200 bg-card",
                      isHovered && "shadow-md -translate-y-0.5"
                    )}>
                      {/* Badge */}
                      {pattern.featured && (
                        <div className="mb-4">
                          <Badge className="bg-muted text-foreground border-border">
                            <Star className="w-3 h-3 mr-1" /> Featured
                          </Badge>
                        </div>
                      )}

                      <div>
                        {/* Icon */}
                        <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-6", pattern.iconBg)}>
                          <Icon className={cn("w-8 h-8", pattern.iconColor)} />
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold text-foreground mb-2">{pattern.title}</h3>
                        <p className="text-muted-foreground mb-6">{pattern.description}</p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-3 mb-6">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                            <BookOpen className="w-3 h-3" /> {pattern.lessons} lessons
                          </span>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" /> {pattern.duration}
                          </span>
                          <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm",
                            pattern.difficulty === 'Beginner' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                          )}>
                            <Zap className="w-3 h-3" /> {pattern.difficulty}
                          </span>
                        </div>

                        {/* Topics */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {pattern.topics.map((topic) => (
                            <span key={topic} className="px-2 py-1 bg-card border border-border rounded-lg text-xs text-muted-foreground">{topic}</span>
                          ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 font-semibold text-primary">
                          Start Learning
                          <motion.div animate={{ x: isHovered ? 5 : 0 }}><ArrowRight className="w-5 h-5" /></motion.div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="relative px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-amber-100 rounded-xl">
              <GraduationCap className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Coming Soon</h2>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">In Development</Badge>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {comingSoon.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + idx * 0.1 }}
                  className="p-5 rounded-2xl bg-card border-2 border-dashed border-border hover:border-border/80 hover:shadow-md transition-all group">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110", item.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="relative px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}
            className="p-8 md:p-10 rounded-2xl border border-border bg-card text-center">
            <div>
              <div className="inline-flex items-center justify-center w-14 h-14 bg-muted rounded-xl mb-6">
                <Trophy className="w-7 h-7 text-primary" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Master Accessibility?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Pick a pattern above and start your journey. Each lesson is designed to be completed in under 10 minutes—no excuses!
              </p>

              <Link href="/learn/table"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-lg text-primary-foreground font-semibold transition-colors">
                <Rocket className="w-5 h-5" />
                Start with Tables
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

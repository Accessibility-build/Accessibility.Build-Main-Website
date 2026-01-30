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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-100/50 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-violet-100 border border-blue-200 rounded-full text-blue-700 text-sm mb-8 shadow-sm">
              <Sparkles className="w-4 h-4" />
              Interactive Learning Experience
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-slate-900">Learn Accessibility</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">By Doing</span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
              Master web accessibility through hands-on interactive demos. No dry documentation—just real patterns you can touch, test, and truly understand.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              {stats.map((stat, idx) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className={cn("p-2 rounded-xl", stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
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
            <h2 className="text-2xl font-bold text-slate-900">Start Learning</h2>
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
                      "relative p-8 rounded-3xl border-2 transition-all duration-300 overflow-hidden bg-white",
                      pattern.borderColor,
                      isHovered && "shadow-xl -translate-y-1"
                    )}>
                      {/* Gradient Background on Hover */}
                      <div className={cn("absolute inset-0 opacity-0 transition-opacity duration-300 bg-gradient-to-br", pattern.bgGradient, isHovered && "opacity-100")} />

                      {/* Badge */}
                      {pattern.featured && (
                        <div className="absolute top-4 right-4 z-10">
                          <Badge className={cn("bg-gradient-to-r text-white border-0 shadow-md", pattern.gradient)}>
                            <Star className="w-3 h-3 mr-1" /> Featured
                          </Badge>
                        </div>
                      )}

                      <div className="relative z-10">
                        {/* Icon */}
                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-sm", pattern.iconBg, isHovered && "scale-110 shadow-md")}>
                          <Icon className={cn("w-8 h-8", pattern.iconColor)} />
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{pattern.title}</h3>
                        <p className="text-slate-600 mb-6">{pattern.description}</p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-3 mb-6">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">
                            <BookOpen className="w-3 h-3" /> {pattern.lessons} lessons
                          </span>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">
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
                            <span key={topic} className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 shadow-sm">{topic}</span>
                          ))}
                        </div>

                        {/* CTA */}
                        <div className={cn("flex items-center gap-2 font-semibold transition-all duration-300", pattern.iconColor)}>
                          Start Learning
                          <motion.div animate={{ x: isHovered ? 5 : 0 }}><ArrowRight className="w-5 h-5" /></motion.div>
                        </div>
                      </div>

                      {/* Bottom Gradient Line */}
                      <div className={cn("absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-500", pattern.gradient, isHovered ? "w-full" : "w-0")} />
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
            <h2 className="text-2xl font-bold text-slate-900">Coming Soon</h2>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">In Development</Badge>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {comingSoon.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + idx * 0.1 }}
                  className="p-5 rounded-2xl bg-white border-2 border-dashed border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110", item.color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
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
            className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-blue-600 via-violet-600 to-purple-600 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAxOGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-2xl mb-6">
                <Trophy className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Master Accessibility?</h2>
              <p className="text-blue-100 max-w-xl mx-auto mb-8">
                Pick a pattern above and start your journey. Each lesson is designed to be completed in under 10 minutes—no excuses!
              </p>

              <Link href="/learn/table"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 rounded-xl text-blue-600 font-semibold shadow-lg transition-all hover:scale-105">
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

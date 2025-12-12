"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Eye,
  Keyboard,
  VolumeX,
  Volume2,
  Monitor,
  Smartphone,
  Tablet,
  Users,
  ArrowRight,
  Sparkles,
  Play,
  Pause,
} from "lucide-react";

export function InteractiveHero() {
  const [activeTab, setActiveTab] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Tabs for the interactive demo
  const tabs = [
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Visual",
      description:
        "High contrast and clear typography for users with visual impairments",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: <Keyboard className="h-5 w-5" />,
      title: "Motor",
      description: "Full keyboard navigation for users with motor disabilities",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: <Volume2 className="h-5 w-5" />,
      title: "Auditory",
      description:
        "Screen reader compatibility for users with hearing impairments",
      color: "from-orange-500 to-amber-600",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Cognitive",
      description:
        "Clear layouts and instructions for users with cognitive disabilities",
      color: "from-pink-500 to-rose-600",
    },
  ];

  // Devices for the responsive demo
  const devices = [
    { icon: <Monitor className="h-6 w-6" />, name: "Desktop" },
    { icon: <Tablet className="h-6 w-6" />, name: "Tablet" },
    { icon: <Smartphone className="h-6 w-6" />, name: "Mobile" },
  ];

  // Set isMounted to true after component mounts to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track mouse position for the interactive background effect
  useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMounted]);

  // Toggle animation play/pause
  const toggleAnimation = () => {
    setIsAnimationPlaying((prev) => !prev);
  };

  // Auto-rotate through tabs when animation is playing
  useEffect(() => {
    if (!isMounted) return;

    if (isAnimationPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveTab((prev) => (prev + 1) % tabs.length);
      }, 4000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAnimationPlaying, tabs.length, isMounted]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20"
    >
      {/* Interactive background */}
      {isMounted && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-background to-background/80 z-0"
          style={{
            backgroundImage: `radial-gradient(
              circle at ${mousePosition.x}px ${mousePosition.y}px,
              rgba(59, 130, 246, 0.15) 0%,
              rgba(59, 130, 246, 0.05) 25%,
              rgba(59, 130, 246, 0) 50%
            )`,
          }}
        />
      )}

      {/* Animated particles */}
      {isMounted && (
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/20"
              initial={{
                x: Math.random() * 100 - 50 + "%",
                y: Math.random() * 100 - 50 + "%",
                opacity: 0.1 + Math.random() * 0.3,
                scale: 0.1 + Math.random() * 0.9,
              }}
              animate={{
                x: Math.random() * 100 - 50 + "%",
                y: Math.random() * 100 - 50 + "%",
                opacity: [
                  0.1 + Math.random() * 0.3,
                  0.2 + Math.random() * 0.5,
                  0.1 + Math.random() * 0.3,
                ],
                scale: [
                  0.1 + Math.random() * 0.9,
                  0.2 + Math.random() * 1.2,
                  0.1 + Math.random() * 0.9,
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 10 + Math.random() * 20,
                ease: "easeInOut",
              }}
              style={{
                width: 5 + Math.random() * 20,
                height: 5 + Math.random() * 20,
              }}
            />
          ))}
        </div>
      )}

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern-dark opacity-[0.15] z-0" />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="xs:text-3xl xs2:text-4xl xs3:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Empowering digital{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <span className="relative z-10 text-primary">inclusion</span>
                  <motion.span
                    className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 rounded-full z-0"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </span>{" "}
                for all
              </h1>

              <motion.p
                className="mt-6 text-xl text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Comprehensive resources, tools, and guides to help you build
                inclusive digital experiences that comply with accessibility
                standards.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button asChild size="lg" className="group">
                  <Link href="/tools">
                    Make Your Site Accessible
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/blog">Accessibility Guides</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right column - Interactive demo */}
          <div>
            <motion.div
              className="bg-muted/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex space-x-2">
                  {devices.map((device, i) => (
                    <motion.div
                      key={i}
                      className="p-2 rounded-md hover:bg-muted cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {device.icon}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Animation control button */}
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAnimation}
                  className="flex items-center gap-1 text-xs"
                  aria-label={
                    isAnimationPlaying ? "Pause animation" : "Play animation"
                  }
                >
                  {isAnimationPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" /> Pause Animation
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" /> Play Animation
                    </>
                  )}
                </Button>
              </div>

              {/* Tabs for different accessibility features */}
              <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map((tab, i) => (
                  <motion.button
                    key={i}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      activeTab === i
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setActiveTab(i)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`${tab.title} accessibility tab`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.title}</span>
                  </motion.button>
                ))}
              </div>

              {/* Interactive demo content */}
              <div className="relative w-full bg-background rounded-lg border border-border overflow-hidden">
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${tabs[activeTab].color} opacity-10`}
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  transition={{ duration: 0.5 }}
                />

                <div className="p-4 xs2:p-6 w-full min-h-[260px] xs2:min-h-[300px]">
                  <div className="flex items-center mb-3">
                    {tabs[activeTab].icon}
                    <h2 className="ml-2 text-base xs2:text-lg xs3:text-lg font-medium">
                      {tabs[activeTab].title} Accessibility
                    </h2>
                  </div>

                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 min-h-0 overflow-auto"
                  >
                    <p className="text-muted-foreground mb-3 text-sm xs2:text-base">
                      {tabs[activeTab].description}
                    </p>

                    {/* Demo content based on active tab */}
                    {activeTab === 0 && (
                      <div className="space-y-3">
                        {["bg-primary", "bg-primary/80", "bg-primary/60"].map(
                          (bg, i) => (
                            <div
                              key={i}
                              className="flex items-center space-x-3 min-w-0"
                            >
                              <div
                                className={`w-8 h-8 flex-shrink-0 rounded-full ${bg} flex items-center justify-center text-primary-foreground`}
                              >
                                A
                              </div>
                              <div className="flex-1 min-w-0 h-6 rounded-md bg-muted" />
                            </div>
                          )
                        )}

                        <div className="mt-3 flex xs:flex-col xs:justify-between xs:items-start xs3:flex-row xs3:items-center xs3:justify-between gap-2">
                          <div className="flex items-center min-w-0">
                            <div className="w-4 h-4 bg-green-500 rounded-sm mr-2 flex-shrink-0" />
                            <span className="text-sm truncate">
                              4.5:1 Contrast
                            </span>
                          </div>

                          <div className="flex items-center min-w-0">
                            <Eye className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="text-sm truncate">
                              WCAG AA Compliant
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* MOTOR TAB */}
                    {activeTab === 1 && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 min-w-0">
                          <Keyboard className="w-5 h-5 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0 h-10 bg-muted rounded-md border-2 border-primary flex items-center px-3 text-sm">
                            <span className="truncate">Focused element</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-10 bg-muted rounded-md flex items-center justify-center text-sm">
                            Tab
                          </div>
                          <div className="h-10 bg-muted rounded-md flex items-center justify-center text-sm">
                            Enter
                          </div>
                          <div className="h-10 bg-muted rounded-md flex items-center justify-center text-sm">
                            Space
                          </div>
                        </div>

                        <div className="mt-2 flex xs:flex-col xs:justify-between xs:items-start xs3:flex-row xs3:items-center xs3:justify-between gap-2">
                          <div className="flex items-center text-sm min-w-0">
                            <span className="truncate">
                              Mouse-free navigation
                            </span>
                          </div>
                          <div className="flex items-center text-sm min-w-0">
                            <Keyboard className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              Full keyboard access
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AUDITORY TAB */}
                    {activeTab === 2 && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 min-w-0">
                          <Volume2 className="w-5 h-5 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0 h-10 bg-muted rounded-md flex items-center px-3 text-sm">
                            <span className="truncate">
                              Screen reader announcement
                            </span>
                          </div>
                        </div>

                        <div className="p-2 bg-muted/50 rounded-md border border-border overflow-auto">
                          <code className="text-sm block truncate">
                            &lt;button aria-label="Close dialog"&gt;
                          </code>
                        </div>

                        <div className="mt-2 flex xs:flex-col xs:justify-between xs:items-start xs3:flex-row xs3:items-center xs3:justify-between gap-2">
                          <div className="flex items-center text-sm">
                            <VolumeX className="w-4 h-4 mr-1" />
                            <span className="truncate">Captions available</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Volume2 className="w-4 h-4 mr-1" />
                            <span className="truncate">
                              Screen reader optimized
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* COGNITIVE TAB */}
                    {activeTab === 3 && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 min-w-0">
                          <Users className="w-5 h-5 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0 h-10 bg-muted rounded-md flex items-center px-3 text-sm">
                            <span className="truncate">
                              Clear, simple instructions
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 xs2:grid-cols-2 xs3:grid-cols-2 gap-2">
                          <div className="h-20 bg-muted/50 rounded-md flex flex-col items-center justify-center p-2 text-sm">
                            <Sparkles className="w-5 h-5 mb-1" />
                            <span className="text-sm text-center">
                              Simple language
                            </span>
                          </div>
                          <div className="h-20 bg-muted/50 rounded-md flex flex-col items-center justify-center p-2 text-sm">
                            <Users className="w-5 h-5 mb-1" />
                            <span className="text-sm text-center">
                              Consistent layout
                            </span>
                          </div>
                        </div>

                        <div className="mt-2 flex xs:flex-col xs:justify-between xs:items-start xs3:flex-row xs3:items-center xs3:justify-between gap-2">
                          <div className="flex items-center text-sm min-w-0">
                            <Sparkles className="w-4 h-4 mr-1" />
                            <span className="truncate">Reduced complexity</span>
                          </div>
                          <div className="flex items-center text-sm min-w-0">
                            <Users className="w-4 h-4 mr-1" />
                            <span className="truncate">Inclusive design</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>
                  Accessibility is not just a feature — it's a fundamental right
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

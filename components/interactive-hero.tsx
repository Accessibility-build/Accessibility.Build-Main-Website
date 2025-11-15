"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
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
} from "lucide-react"

export function InteractiveHero() {
  const [activeTab, setActiveTab] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Tabs for the interactive demo
  const tabs = [
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Visual",
      description: "High contrast and clear typography for users with visual impairments",
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
      description: "Screen reader compatibility for users with hearing impairments",
      color: "from-orange-500 to-amber-600",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Cognitive",
      description: "Clear layouts and instructions for users with cognitive disabilities",
      color: "from-pink-500 to-rose-600",
    },
  ]

  // Devices for the responsive demo
  const devices = [
    { icon: <Monitor className="h-6 w-6" />, name: "Desktop" },
    { icon: <Tablet className="h-6 w-6" />, name: "Tablet" },
    { icon: <Smartphone className="h-6 w-6" />, name: "Mobile" },
  ]

  // Set isMounted to true after component mounts to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Track mouse position for the interactive background effect
  useEffect(() => {
    if (!isMounted) return

    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isMounted])

  // Toggle animation play/pause
  const toggleAnimation = () => {
    setIsAnimationPlaying((prev) => !prev)
  }

  // Auto-rotate through tabs when animation is playing
  useEffect(() => {
    if (!isMounted) return

    if (isAnimationPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveTab((prev) => (prev + 1) % tabs.length)
      }, 4000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAnimationPlaying, tabs.length, isMounted])

  return (
    <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
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
                opacity: [0.1 + Math.random() * 0.3, 0.2 + Math.random() * 0.5, 0.1 + Math.random() * 0.3],
                scale: [0.1 + Math.random() * 0.9, 0.2 + Math.random() * 1.2, 0.1 + Math.random() * 0.9],
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
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
                Comprehensive resources, tools, and guides to help you build inclusive digital experiences that comply
                with accessibility standards.
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
                  aria-label={isAnimationPlaying ? "Pause animation" : "Play animation"}
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
                      activeTab === i ? "bg-primary text-primary-foreground" : "hover:bg-muted"
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
              <div className="relative h-[300px] bg-background rounded-lg border border-border overflow-hidden">
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${tabs[activeTab].color} opacity-10`}
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  transition={{ duration: 0.5 }}
                />

                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    {tabs[activeTab].icon}
                    <h2 className="ml-2 text-lg font-medium">{tabs[activeTab].title} Accessibility</h2>
                  </div>

                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1"
                  >
                    <p className="text-muted-foreground mb-4">{tabs[activeTab].description}</p>

                    {/* Demo content based on active tab */}
                    {activeTab === 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                            A
                          </div>
                          <div className="flex-1 h-6 bg-muted rounded-md" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground">
                            A
                          </div>
                          <div className="flex-1 h-6 bg-muted/80 rounded-md" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-primary/60 flex items-center justify-center text-primary-foreground">
                            A
                          </div>
                          <div className="flex-1 h-6 bg-muted/60 rounded-md" />
                        </div>
                        <div className="mt-4 flex justify-between">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-green-500 rounded-sm mr-2" />
                            <span className="text-sm">4.5:1 Contrast</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            <span className="text-sm">WCAG AA Compliant</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 1 && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Keyboard className="w-5 h-5 text-primary" />
                          <div className="flex-1 h-10 bg-muted rounded-md border-2 border-primary flex items-center px-3">
                            <span>Focused element</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-10 bg-muted rounded-md flex items-center justify-center">Tab</div>
                          <div className="h-10 bg-muted rounded-md flex items-center justify-center">Enter</div>
                          <div className="h-10 bg-muted rounded-md flex items-center justify-center">Space</div>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <div className="flex items-center">
                            <span className="text-sm">Mouse-free navigation</span>
                          </div>
                          <div className="flex items-center">
                            <Keyboard className="w-4 h-4 mr-1" />
                            <span className="text-sm">Full keyboard access</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 2 && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Volume2 className="w-5 h-5 text-primary" />
                          <div className="flex-1 h-10 bg-muted rounded-md flex items-center px-3">
                            <span>Screen reader announcement</span>
                          </div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-md border border-border">
                          <code className="text-sm">&lt;button aria-label="Close dialog"&gt;</code>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <div className="flex items-center">
                            <VolumeX className="w-4 h-4 mr-1" />
                            <span className="text-sm">Captions available</span>
                          </div>
                          <div className="flex items-center">
                            <Volume2 className="w-4 h-4 mr-1" />
                            <span className="text-sm">Screen reader optimized</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 3 && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-primary" />
                          <div className="flex-1 h-10 bg-muted rounded-md flex items-center px-3">
                            <span>Clear, simple instructions</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-20 bg-muted/50 rounded-md flex flex-col items-center justify-center p-2">
                            <Sparkles className="w-5 h-5 mb-1" />
                            <span className="text-sm text-center">Simple language</span>
                          </div>
                          <div className="h-20 bg-muted/50 rounded-md flex flex-col items-center justify-center p-2">
                            <Users className="w-5 h-5 mb-1" />
                            <span className="text-sm text-center">Consistent layout</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <div className="flex items-center">
                            <Sparkles className="w-4 h-4 mr-1" />
                            <span className="text-sm">Reduced complexity</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span className="text-sm">Inclusive design</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>Accessibility is not just a feature — it's a fundamental right</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

type NavItem = {
  name: string
  href: string
  children?: { name: string; href: string }[]
}

interface MobileNavProps {
  items: NavItem[]
}

export function MobileNav({ items }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const pathname = usePathname()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close menu when escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const toggleSubmenu = (href: string) => {
    setOpenSubmenu(openSubmenu === href ? null : href)
  }

  return (
    <>
      <button
        className="md:hidden rounded-full p-2 text-foreground/70 hover:text-primary hover:bg-primary/5"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background p-6 shadow-lg md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="flex justify-end mb-8">
                <button
                  className="rounded-full p-2 text-foreground/70 hover:text-primary hover:bg-primary/5"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-6">
                {items.map((item) => (
                  <div key={item.href} className="space-y-3">
                    {item.children ? (
                      <button
                        className={cn(
                          "flex w-full items-center justify-between text-lg font-medium",
                          pathname.startsWith(item.href) ? "text-primary" : "text-foreground/70",
                        )}
                        onClick={() => toggleSubmenu(item.href)}
                      >
                        {item.name}
                        {openSubmenu === item.href ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "block text-lg font-medium",
                          pathname === item.href ? "text-primary" : "text-foreground/70",
                        )}
                      >
                        {item.name}
                      </Link>
                    )}

                    {item.children && openSubmenu === item.href && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-4 space-y-3 overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block text-base",
                              pathname === child.href ? "text-primary" : "text-foreground/70",
                            )}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

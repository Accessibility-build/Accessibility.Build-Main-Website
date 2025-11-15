"use client"

import React from "react"

import { Suspense, lazy, type ComponentType, type ReactNode } from "react"
import { Loader2 } from "lucide-react"

interface LazyComponentProps {
  component: () => Promise<{ default: ComponentType<any> }>
  props?: Record<string, any>
  fallback?: ReactNode
  errorFallback?: ReactNode
}

export function LazyComponent({
  component,
  props = {},
  fallback = <DefaultLoadingFallback />,
  errorFallback = <DefaultErrorFallback />,
}: LazyComponentProps) {
  const LazyComponent = lazy(component)

  return (
    <Suspense fallback={fallback}>
      <ErrorBoundary fallback={errorFallback}>
        <LazyComponent {...props} />
      </ErrorBoundary>
    </Suspense>
  )
}

function DefaultLoadingFallback() {
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

function DefaultErrorFallback() {
  return (
    <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-md">
      <p>Failed to load component. Please try again later.</p>
    </div>
  )
}

// Simple error boundary component
class ErrorBoundary extends React.Component<{ children: ReactNode; fallback: ReactNode }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error("Error loading lazy component:", error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

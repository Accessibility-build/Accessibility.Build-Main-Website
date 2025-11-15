"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewsletterSignupProps {
  source?: 'footer' | 'blog' | 'other'
  className?: string
  placeholder?: string
  buttonText?: string
  compact?: boolean
}

export function NewsletterSignup({ 
  source = 'footer', 
  className = '',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe',
  compact = false
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setMessage('Please enter your email address')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    setMessage('')
    setMessageType(null)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message)
        setMessageType('success')
        if (data.newSubscription) {
          setEmail('')
        }
      } else {
        setMessage(data.error || 'Failed to subscribe. Please try again.')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setMessage('Something went wrong. Please try again later.')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  if (compact) {
    return (
      <div className={cn("space-y-3", className)}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-1 h-10 text-sm"
            disabled={isLoading}
            suppressHydrationWarning
          />
          <Button 
            type="submit" 
            disabled={isLoading || !email.trim()}
            className="px-4 h-10 text-sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              buttonText
            )}
          </Button>
        </form>
        
        {message && (
          <Alert 
            className={cn(
              "text-xs",
              messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : 
              'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
            )}
          >
            {messageType === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription className="text-xs">
              {message}
            </AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Stay Updated
        </h3>
        <p className="text-sm text-muted-foreground">
          Get the latest accessibility insights, WCAG updates, and tool announcements.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
            disabled={isLoading}
            suppressHydrationWarning
          />
          <Button 
            type="submit" 
            disabled={isLoading || !email.trim()}
            className="px-6"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              buttonText
            )}
          </Button>
        </div>

        {message && (
          <Alert 
            className={cn(
              messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' : 
              'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
            )}
          >
            {messageType === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}
      </form>

      <p className="text-xs text-muted-foreground">
        No spam, unsubscribe at any time. We respect your privacy.
      </p>
    </div>
  )
}

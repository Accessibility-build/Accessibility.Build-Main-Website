'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Zap, Lock, Unlock, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react'

export default function UnlimitedAccessClient() {
  const [secretKey, setSecretKey] = useState('')
  const [hasUnlimitedAccess, setHasUnlimitedAccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [checking, setChecking] = useState(true)

  // Check if user already has unlimited access
  useEffect(() => {
    const checkExistingAccess = () => {
      try {
        const unlimitedAccess = localStorage.getItem('unlimited_access')
        const accessTimestamp = localStorage.getItem('unlimited_access_timestamp')
        
        if (unlimitedAccess === 'true' && accessTimestamp) {
          // Check if access is still valid (24 hours)
          const timestamp = parseInt(accessTimestamp)
          const now = Date.now()
          const twentyFourHours = 24 * 60 * 60 * 1000
          
          if (now - timestamp < twentyFourHours) {
            setHasUnlimitedAccess(true)
          } else {
            // Access expired, remove from storage
            localStorage.removeItem('unlimited_access')
            localStorage.removeItem('unlimited_access_timestamp')
          }
        }
      } catch (error) {
        console.error('Error checking unlimited access:', error)
      }
      setChecking(false)
    }

    checkExistingAccess()
  }, [])

  const verifySecretKey = async () => {
    if (!secretKey.trim()) {
      setError('Please enter a secret key')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/verify-unlimited-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretKey: secretKey.trim() }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        // Store unlimited access in localStorage
        localStorage.setItem('unlimited_access', 'true')
        localStorage.setItem('unlimited_access_timestamp', Date.now().toString())
        setHasUnlimitedAccess(true)
        setSecretKey('')
      } else {
        setError(data.message || 'Invalid secret key')
      }
    } catch (error) {
      setError('Failed to verify secret key. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const revokeAccess = () => {
    localStorage.removeItem('unlimited_access')
    localStorage.removeItem('unlimited_access_timestamp')
    setHasUnlimitedAccess(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      verifySecretKey()
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              {hasUnlimitedAccess ? (
                <Unlock className="h-8 w-8 text-white" />
              ) : (
                <Lock className="h-8 w-8 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Unlimited Access
              </CardTitle>
              <CardDescription className="mt-2">
                {hasUnlimitedAccess 
                  ? 'You have unlimited access to all AI features'
                  : 'Enter your secret key to unlock unlimited AI access'
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {hasUnlimitedAccess ? (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Unlimited Access Active</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Zap className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                    <p className="text-sm mt-2">
                      You can now use all AI audit features without any limits. This access will expire in 24 hours.
                    </p>
                  </AlertDescription>
                </Alert>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border">
                  <h3 className="font-semibold text-sm mb-2 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-blue-600" />
                    Unlimited Features Available:
                  </h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• AI Accessibility Audit Helper (No limits)</li>
                    <li>• AI Alt Text Generator (No limits)</li>
                    <li>• All analysis tools (No restrictions)</li>
                    <li>• Priority processing</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open('/tools/accessibility-audit-helper', '_blank')}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Start Using Tools
                  </Button>
                  <Button
                    onClick={revokeAccess}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="secretKey" className="text-sm font-medium">
                    Secret Access Key
                  </label>
                  <div className="relative">
                    <Input
                      id="secretKey"
                      type={showKey ? 'text' : 'password'}
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your secret key..."
                      className="pr-10"
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowKey(!showKey)}
                      disabled={loading}
                    >
                      {showKey ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={verifySecretKey}
                  disabled={loading || !secretKey.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4 mr-2" />
                      Unlock Unlimited Access
                    </>
                  )}
                </Button>

                <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-700 dark:text-blue-300">
                    <p className="font-medium text-sm">What you'll get:</p>
                    <ul className="text-xs mt-1 space-y-1">
                      <li>• Bypass all AI usage limits</li>
                      <li>• Access to premium analysis features</li>
                      <li>• Priority processing for all tools</li>
                      <li>• Valid for 24 hours</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
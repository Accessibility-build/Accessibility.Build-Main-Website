'use client'

import { useState, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, TrendingUp, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import {
  calculatePrice,
  MIN_CREDITS,
  MAX_CREDITS,
  SUGGESTED_AMOUNTS,
  formatCredits,
  formatPrice,
  getNextTierMessage,
} from '@/lib/pricing'

export function CreditSlider() {
  const [credits, setCredits] = useState(1000)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Calculate pricing dynamically
  const pricing = calculatePrice(credits)
  const nextTierMessage = getNextTierMessage(credits)

  const handleSliderChange = (value: number[]) => {
    setCredits(value[0])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || MIN_CREDITS
    setCredits(Math.max(MIN_CREDITS, Math.min(MAX_CREDITS, value)))
  }

  const handleSuggestedAmount = (amount: number) => {
    setCredits(amount)
  }

  const handleCheckout = async () => {
    try {
      setIsLoading(true)

      // Call the checkout API
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credits }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle authentication error
        if (response.status === 401) {
          toast({
            title: 'Sign In Required',
            description: 'Please sign in to purchase credits.',
            variant: 'destructive',
          })
          // Redirect to sign in after a short delay
          setTimeout(() => {
            window.location.href = '/sign-in?redirect=/pricing'
          }, 1500)
          return
        }
        
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: 'Checkout Failed',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="pt-8 pb-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Choose Your Credits</h2>
            </div>
            <p className="text-muted-foreground">
              Drag the slider or enter an amount. Credits never expire.
            </p>
          </div>

          {/* Quick Select Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {SUGGESTED_AMOUNTS.map((suggestion) => (
              <Button
                key={suggestion.credits}
                variant={credits === suggestion.credits ? 'default' : 'outline'}
                onClick={() => handleSuggestedAmount(suggestion.credits)}
                className="relative h-auto py-3 flex flex-col items-center gap-1"
              >
                {suggestion.popular && (
                  <Badge className="absolute -top-2 -right-2 text-xs">Popular</Badge>
                )}
                <span className="font-bold">{formatCredits(suggestion.credits)}</span>
                <span className="text-xs opacity-80">{suggestion.label}</span>
              </Button>
            ))}
          </div>

          {/* Slider */}
          <div className="mb-6">
            <Slider
              value={[credits]}
              onValueChange={handleSliderChange}
              min={MIN_CREDITS}
              max={MAX_CREDITS}
              step={100}
              className="mb-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCredits(MIN_CREDITS)}</span>
              <span>{formatCredits(MAX_CREDITS)}</span>
            </div>
          </div>

          {/* Input Field */}
          <div className="mb-8">
            <label htmlFor="credits-input" className="block text-sm font-medium mb-2">
              Or enter exact amount:
            </label>
            <Input
              id="credits-input"
              type="number"
              value={credits}
              onChange={handleInputChange}
              min={MIN_CREDITS}
              max={MAX_CREDITS}
              step={100}
              className="text-lg font-semibold text-center"
            />
          </div>

          {/* Pricing Display */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Credits</p>
                <p className="text-2xl font-bold">{formatCredits(pricing.credits)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Per Credit</p>
                <p className="text-2xl font-bold">{formatPrice(pricing.pricePerCredit)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-3xl font-bold text-primary">{formatPrice(pricing.total)}</p>
              </div>
            </div>

            {/* Discount Badge */}
            {pricing.discount > 0 && (
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-primary/20">
                <Badge variant="default" className="text-sm">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {pricing.discount}% OFF - {pricing.tier.label} Tier
                </Badge>
                <span className="text-sm text-muted-foreground">
                  You save {formatPrice(pricing.savings)}
                </span>
              </div>
            )}

            {/* Next Tier Message */}
            {nextTierMessage && (
              <div className="mt-3 text-center text-sm text-muted-foreground">
                💡 {nextTierMessage}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>Credits never expire</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>Use across all accessibility tools</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            onClick={handleCheckout}
            disabled={isLoading}
            size="lg"
            className="w-full text-lg h-14 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Buy {formatCredits(credits)} Credits for {formatPrice(pricing.total)}
              </>
            )}
          </Button>

          {/* Trust Signals */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground mb-2">
              🔒 Secure payment powered by Stripe • SSL encrypted
            </p>
            <p className="text-xs text-muted-foreground">
              30-day money-back guarantee • Credits never expire
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


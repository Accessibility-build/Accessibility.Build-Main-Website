import { SignIn } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Shield, 
  Users, 
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Sign In | Access Your Accessibility Dashboard | Accessibility.build",
  description: "Sign in to your accessibility account. Access your credits, tools, and continue building more accessible digital experiences.",
}

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center max-w-5xl mx-auto">
          {/* Left Column - Minimal Hero */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Welcome back
              </h1>
              <p className="text-muted-foreground">
                Sign in to access your accessibility tools and dashboard.
              </p>
            </div>

            {/* Minimal benefits */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span>Access your dashboard and credits</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span>Secure authentication</span>
              </div>
            </div>

            {/* Sign up link */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                New to Accessibility.build?
              </p>
              <Link 
                href="/sign-up" 
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Sparkles className="h-4 w-4" />
                Create account and get 100 free credits
              </Link>
            </div>
          </div>

          {/* Right Column - Sign In Form */}
          <div className="lg:col-span-3 flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Sign In</CardTitle>
                <CardDescription>
                  Access your accessibility dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignIn 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      cardBox: "shadow-none bg-transparent border-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 
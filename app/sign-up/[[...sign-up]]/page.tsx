import { SignUp } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpRedirect } from "@/components/auth/signup-redirect";
import { Gift, UserPlus, CheckCircle, Shield } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Get 100 Free Credits | Accessibility.build",
  description:
    "Create your accessibility account and get 100 free credits. Join thousands building more accessible digital experiences with professional tools.",
};

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignUpRedirect />
      <div className="container-wide py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center max-w-5xl mx-auto">
          {/* Left Column - Minimal Hero */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Start building
                <br />
                accessible apps
              </h1>
              <p className="text-muted-foreground">
                Get professional accessibility tools with 100 free credits to
                start testing.
              </p>
            </div>

            {/* Minimal benefits */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Gift className="h-4 w-4 text-primary" />
                </div>
                <span>
                  <strong>100 free credits</strong> ($10 value)
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <span>Secure authentication</span>
              </div>
            </div>

            {/* Sign in link */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Already have an account?
              </p>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <UserPlus className="h-4 w-4" />
                Sign in to your dashboard
              </Link>
            </div>
          </div>

          {/* Right Column - Sign Up Form */}
          <div className="lg:col-span-3 flex justify-center w-full">
            <div className="w-full px-4 sm:px-0">
              <Card className="w-full max-w-md mx-auto overflow-hidden">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Create Account</CardTitle>
                  <CardDescription>
                    Get started with 100 free credits
                  </CardDescription>

                  {/* Credit highlight */}
                  <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex flex-col md:!flex-row items-center justify-center gap-2 text-primary text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Gift className="h-3 w-3 md:h-4 md:w-4" />
                        <span>100 Credits = $10 Value</span>
                      </div>

                      <span className="hidden md:inline">•</span>

                      <div>
                        <span>No Payment Required</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-6">
                  <div className="w-full min-w-0 max-w-full">
                    <SignUp
                      appearance={{
                        elements: {
                          // enforce shrink & cap widths on clerk root & card internals
                          rootBox: "w-full min-w-0 max-w-full",
                          cardBox: "w-full min-w-0 max-w-full overflow-hidden",
                          headerTitle: "hidden",
                          headerSubtitle: "hidden",
                          formButtonPrimary:
                            "bg-primary hover:bg-primary/90 text-primary-foreground",
                        },
                      }}
                      afterSignUpUrl="/welcome"
                    />
                  </div>

                  {/* Simple trust indicator */}
                  <div className="mt-6 pt-6 border-t text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>
                        Secure signup powered by enterprise authentication
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next"
import { Cookie, Settings, Shield, BarChart, UserCheck, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Cookie Policy | Accessibility.build - How We Use Cookies",
  description: "Learn about how Accessibility.build uses cookies and similar technologies to improve your experience and provide our services.",
  keywords: [
    "cookie policy",
    "cookies",
    "tracking",
    "privacy",
    "data collection",
    "website analytics"
  ],
  openGraph: {
    title: "Cookie Policy - Accessibility.build",
    description: "Learn about how we use cookies and similar technologies.",
    type: "website",
    url: "https://accessibility.build/cookies",
  },
  alternates: {
    canonical: "https://accessibility.build/cookies"
  }
}

const cookieCategories = [
  {
    name: "Essential Cookies",
    description: "Required for the website to function properly",
    icon: Shield,
    required: true,
    cookies: [
      {
        name: "__clerk_session",
        purpose: "User authentication and session management",
        duration: "Session",
        provider: "Clerk"
      },
      {
        name: "csrf_token",
        purpose: "Security protection against cross-site request forgery",
        duration: "Session",
        provider: "Accessibility.build"
      },
      {
        name: "preferences",
        purpose: "Remember your cookie preferences",
        duration: "1 year",
        provider: "Accessibility.build"
      }
    ]
  },
  {
    name: "Analytics Cookies",
    description: "Help us understand how visitors use our website",
    icon: BarChart,
    required: false,
    cookies: [
      {
        name: "_ga",
        purpose: "Distinguish unique users and sessions",
        duration: "2 years",
        provider: "Google Analytics"
      },
      {
        name: "_gid",
        purpose: "Distinguish unique users",
        duration: "24 hours",
        provider: "Google Analytics"
      },
      {
        name: "vercel_analytics",
        purpose: "Website performance and usage analytics",
        duration: "1 year",
        provider: "Vercel"
      }
    ]
  },
  {
    name: "Functional Cookies",
    description: "Enable enhanced functionality and personalization",
    icon: Settings,
    required: false,
    cookies: [
      {
        name: "theme",
        purpose: "Remember your dark/light mode preference",
        duration: "1 year",
        provider: "Accessibility.build"
      },
      {
        name: "language",
        purpose: "Remember your language preference",
        duration: "1 year",
        provider: "Accessibility.build"
      },
      {
        name: "tool_preferences",
        purpose: "Remember your tool settings and preferences",
        duration: "6 months",
        provider: "Accessibility.build"
      }
    ]
  },
  {
    name: "Marketing Cookies",
    description: "Used to track visitors and display relevant ads",
    icon: Eye,
    required: false,
    cookies: [
      {
        name: "_fbp",
        purpose: "Facebook pixel for conversion tracking",
        duration: "3 months",
        provider: "Facebook"
      },
      {
        name: "linkedin_analytics",
        purpose: "LinkedIn conversion tracking and analytics",
        duration: "2 years",
        provider: "LinkedIn"
      }
    ]
  }
]

export default function CookiesPage() {
  return (
    <div className="container-wide py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cookie className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn about how we use cookies and similar technologies to improve your experience.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline">Last updated: January 15, 2024</Badge>
            <Badge variant="outline">GDPR Compliant</Badge>
          </div>
        </div>

        {/* Quick Summary */}
        <Alert className="mb-8">
          <UserCheck className="h-4 w-4" />
          <AlertDescription>
            <strong>Your Choice:</strong> We only use essential cookies by default. You can choose which additional 
            cookies to accept through our cookie banner or the preferences below.
          </AlertDescription>
        </Alert>

        {/* Cookie Preferences */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Cookie Preferences
            </CardTitle>
            <CardDescription>
              Manage your cookie preferences. Changes take effect immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {cookieCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <category.icon className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {category.required ? (
                      <Badge variant="secondary">Required</Badge>
                    ) : (
                      <Switch defaultChecked={false} />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button>Save Preferences</Button>
              <Button variant="outline">Accept All</Button>
              <Button variant="outline">Reject All</Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Cookie Categories</TabsTrigger>
            <TabsTrigger value="manage">Manage Cookies</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What Are Cookies?</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <p>
                  Cookies are small text files that are stored on your device when you visit a website. 
                  They help websites remember information about your visit, which can make it easier to 
                  visit the site again and make the site more useful to you.
                </p>
                
                <h3>How We Use Cookies</h3>
                <p>We use cookies for several purposes:</p>
                <ul>
                  <li><strong>Essential functionality:</strong> To keep you logged in and remember your preferences</li>
                  <li><strong>Performance:</strong> To understand how our website is used and improve it</li>
                  <li><strong>Analytics:</strong> To measure website traffic and user behavior</li>
                  <li><strong>Marketing:</strong> To show you relevant content and measure campaign effectiveness</li>
                </ul>

                <h3>Your Consent</h3>
                <p>
                  We only use essential cookies without your consent, as they're necessary for the website to function. 
                  For all other cookies, we ask for your permission through our cookie banner when you first visit our site.
                </p>

                <h3>Third-Party Cookies</h3>
                <p>
                  Some cookies are set by third-party services that appear on our pages. We don't control these cookies, 
                  but we've carefully selected our partners and ensure they meet our privacy standards.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories */}
          <TabsContent value="categories" className="space-y-6">
            {cookieCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    {category.name}
                    {category.required && <Badge variant="secondary">Required</Badge>}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.cookies.map((cookie, cookieIndex) => (
                      <div key={cookieIndex} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{cookie.name}</h4>
                          <Badge variant="outline">{cookie.provider}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{cookie.purpose}</p>
                        <div className="text-xs text-muted-foreground">
                          Duration: {cookie.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Manage */}
          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Managing Cookies</CardTitle>
                <CardDescription>
                  You have several options for managing cookies on our website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Cookie Banner</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    When you first visit our website, you'll see a cookie banner where you can:
                  </p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li>• Accept all cookies</li>
                    <li>• Reject non-essential cookies</li>
                    <li>• Customize your preferences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Browser Settings</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    You can also manage cookies through your browser settings:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">Chrome</h4>
                      <p className="text-xs text-muted-foreground">
                        Settings → Privacy and security → Cookies and other site data
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">Firefox</h4>
                      <p className="text-xs text-muted-foreground">
                        Settings → Privacy & Security → Cookies and Site Data
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">Safari</h4>
                      <p className="text-xs text-muted-foreground">
                        Preferences → Privacy → Manage Website Data
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium mb-2">Edge</h4>
                      <p className="text-xs text-muted-foreground">
                        Settings → Cookies and site permissions → Cookies and site data
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Account Settings</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you have an account, you can manage some preferences in your account settings:
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/profile">
                      Go to Account Settings
                    </Link>
                  </Button>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Note:</strong> Disabling certain cookies may affect website functionality. 
                    Essential cookies cannot be disabled as they're required for the site to work properly.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Cookie Policies</CardTitle>
                <CardDescription>
                  Links to cookie policies of third-party services we use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Google Analytics</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Website analytics and performance tracking
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://policies.google.com/privacy" target="_blank">
                        View Policy
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Clerk</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      User authentication and session management
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://clerk.com/privacy" target="_blank">
                        View Policy
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Vercel</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Website hosting and performance analytics
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://vercel.com/legal/privacy-policy" target="_blank">
                        View Policy
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Stripe</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Payment processing and fraud prevention
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="https://stripe.com/privacy" target="_blank">
                        View Policy
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Questions About Cookies?</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about our use of cookies, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link href="/contact">
                  Contact Support
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/privacy">
                  View Privacy Policy
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

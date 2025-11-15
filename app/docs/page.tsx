import type { Metadata } from "next"
import { Code, Book, Zap, Key, ExternalLink, Copy, CheckCircle, ArrowRight, Terminal, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export const metadata: Metadata = {
  title: "API Documentation | Accessibility.build - Developer Resources",
  description:
    "Complete API documentation for Accessibility.build. Learn how to integrate accessibility testing into your development workflow with our REST API.",
  keywords: [
    "accessibility API",
    "WCAG API",
    "accessibility testing API",
    "developer documentation",
    "REST API",
    "accessibility integration",
    "API reference"
  ],
  openGraph: {
    title: "API Documentation - Accessibility.build Developer Resources",
    description: "Complete API documentation for integrating accessibility testing into your workflow.",
    type: "website",
    url: "https://accessibility.build/docs",
  },
  twitter: {
    card: "summary_large_image",
    title: "API Documentation - Accessibility.build",
    description: "Complete API documentation for integrating accessibility testing into your workflow.",
  },
  alternates: {
    canonical: "https://accessibility.build/docs"
  }
}

const endpoints = [
  {
    method: "POST",
    path: "/api/v1/alt-text/generate",
    description: "Generate AI-powered alt text for images",
    category: "AI Tools"
  },
  {
    method: "POST", 
    path: "/api/v1/contrast/check",
    description: "Check color contrast ratios for WCAG compliance",
    category: "Accessibility"
  },
  {
    method: "POST",
    path: "/api/v1/audit/accessibility",
    description: "Perform comprehensive accessibility audit",
    category: "Auditing"
  },
  {
    method: "GET",
    path: "/api/v1/user/credits",
    description: "Get current user credit balance",
    category: "Account"
  },
  {
    method: "GET",
    path: "/api/v1/user/usage",
    description: "Get usage statistics and history",
    category: "Account"
  }
]

const sdks = [
  {
    name: "JavaScript/Node.js",
    description: "Official SDK for JavaScript and Node.js applications",
    install: "npm install @accessibility-build/sdk",
    icon: "🟨",
    status: "Available"
  },
  {
    name: "Python",
    description: "Official SDK for Python applications",
    install: "pip install accessibility-build",
    icon: "🐍",
    status: "Available"
  },
  {
    name: "PHP",
    description: "Official SDK for PHP applications",
    install: "composer require accessibility-build/sdk",
    icon: "🐘",
    status: "Coming Soon"
  },
  {
    name: "Ruby",
    description: "Official SDK for Ruby applications",
    install: "gem install accessibility_build",
    icon: "💎",
    status: "Coming Soon"
  }
]

export default function DocsPage() {
  return (
    <div className="container-wide py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Book className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">API Documentation</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Integrate accessibility testing into your development workflow with our comprehensive REST API. 
          Build accessible applications with automated testing and AI-powered tools.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="#getting-started">
              <Zap className="mr-2 h-4 w-4" />
              Get Started
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/sign-up">
              <Key className="mr-2 h-4 w-4" />
              Get API Key
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground">API Uptime</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary mb-2">245ms</div>
            <div className="text-sm text-muted-foreground">Avg Response</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary mb-2">5+</div>
            <div className="text-sm text-muted-foreground">Endpoints</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary mb-2">2M+</div>
            <div className="text-sm text-muted-foreground">API Calls/Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="sdks">SDKs</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-8">
          <div id="getting-started">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Getting Started
                </CardTitle>
                <CardDescription>
                  Follow these steps to start using the Accessibility.build API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">Sign Up</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a free account to get your API key and start testing
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">Get API Key</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate your API key from the dashboard settings
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">Make Requests</h3>
                    <p className="text-sm text-muted-foreground">
                      Start making API calls to test accessibility
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                All API requests require authentication using your API key
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    Include your API key in the <code className="bg-muted px-1 rounded">Authorization</code> header as a Bearer token.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm">
                    curl -H "Authorization: Bearer YOUR_API_KEY" \<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;https://api.accessibility.build/v1/endpoint
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rate Limits</CardTitle>
              <CardDescription>
                API usage limits based on your subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Free Plan</h4>
                  <p className="text-2xl font-bold text-primary mb-1">100</p>
                  <p className="text-sm text-muted-foreground">requests/month</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Pro Plan</h4>
                  <p className="text-2xl font-bold text-primary mb-1">10,000</p>
                  <p className="text-sm text-muted-foreground">requests/month</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Business Plan</h4>
                  <p className="text-2xl font-bold text-primary mb-1">100,000</p>
                  <p className="text-sm text-muted-foreground">requests/month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Endpoints */}
        <TabsContent value="endpoints" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>
                Complete list of available API endpoints and their functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                          {endpoint.method}
                        </Badge>
                        <code className="font-mono text-sm">{endpoint.path}</code>
                      </div>
                      <Badge variant="outline">{endpoint.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Format</CardTitle>
              <CardDescription>
                All API responses follow a consistent JSON format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    // Response data here
  },
  "meta": {
    "credits_used": 1,
    "remaining_credits": 999,
    "request_id": "req_123456"
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SDKs */}
        <TabsContent value="sdks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Official SDKs</CardTitle>
              <CardDescription>
                Use our official SDKs to integrate with your favorite programming language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sdks.map((sdk, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{sdk.icon}</span>
                        <h3 className="font-semibold">{sdk.name}</h3>
                      </div>
                      <Badge variant={sdk.status === 'Available' ? 'default' : 'secondary'}>
                        {sdk.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{sdk.description}</p>
                    <div className="bg-muted p-3 rounded font-mono text-sm mb-4">
                      {sdk.install}
                    </div>
                    {sdk.status === 'Available' && (
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Documentation
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples */}
        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Practical examples to help you get started quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="alt-text" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="alt-text">Alt Text Generation</TabsTrigger>
                  <TabsTrigger value="contrast">Contrast Check</TabsTrigger>
                  <TabsTrigger value="audit">Accessibility Audit</TabsTrigger>
                </TabsList>

                <TabsContent value="alt-text">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Generate Alt Text for an Image</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
{`// JavaScript/Node.js
const response = await fetch('https://api.accessibility.build/v1/alt-text/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image_url: 'https://example.com/image.jpg',
    context: 'Product image for e-commerce site'
  })
});

const result = await response.json();
console.log(result.data.alt_text);`}
                      </pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contrast">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Check Color Contrast</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
{`// JavaScript/Node.js
const response = await fetch('https://api.accessibility.build/v1/contrast/check', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    foreground: '#000000',
    background: '#FFFFFF',
    wcag_version: '2.2',
    text_size: 'normal'
  })
});

const result = await response.json();
console.log(\`Contrast ratio: \${result.data.contrast_ratio}\`);
console.log(\`WCAG AA: \${result.data.wcag_aa ? 'Pass' : 'Fail'}\`);`}
                      </pre>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="audit">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Perform Accessibility Audit</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">
{`// JavaScript/Node.js
const response = await fetch('https://api.accessibility.build/v1/audit/accessibility', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com',
    standards: ['wcag2.2'],
    levels: ['A', 'AA']
  })
});

const result = await response.json();
console.log(\`Issues found: \${result.data.issues.length}\`);
result.data.issues.forEach(issue => {
  console.log(\`- \${issue.description}\`);
});`}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* CTA Section */}
      <Card className="mt-16">
        <CardContent className="p-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Terminal className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Ready to Start Building?</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get your API key and start integrating accessibility testing into your development workflow today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Get API Key
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/help">
                View Help Center
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

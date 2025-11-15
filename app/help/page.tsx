import type { Metadata } from "next"
import { Search, Book, MessageCircle, Mail, Phone, ExternalLink, ChevronRight, HelpCircle, Zap, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Help Center | Accessibility.build - Support & Documentation",
  description:
    "Find answers to your questions about accessibility testing, WCAG compliance, and using our tools. Get help with setup, troubleshooting, and best practices.",
  keywords: [
    "accessibility help",
    "WCAG support",
    "accessibility testing help",
    "documentation",
    "troubleshooting",
    "accessibility guides",
    "support center"
  ],
  openGraph: {
    title: "Help Center - Accessibility.build Support",
    description: "Find answers and get support for all your accessibility testing needs.",
    type: "website",
    url: "https://accessibility.build/help",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help Center - Accessibility.build Support",
    description: "Find answers and get support for all your accessibility testing needs.",
  },
  alternates: {
    canonical: "https://accessibility.build/help"
  }
}

const popularArticles = [
  {
    title: "Getting Started with Accessibility Testing",
    description: "Learn the basics of web accessibility and how to use our tools effectively.",
    category: "Getting Started",
    readTime: "5 min read",
    href: "/help/getting-started"
  },
  {
    title: "Understanding WCAG 2.2 Guidelines",
    description: "Comprehensive guide to WCAG 2.2 principles and success criteria.",
    category: "WCAG Guidelines",
    readTime: "10 min read",
    href: "/help/wcag-guidelines"
  },
  {
    title: "Using the Color Contrast Checker",
    description: "Step-by-step guide to testing color contrast for accessibility compliance.",
    category: "Tools",
    readTime: "3 min read",
    href: "/help/contrast-checker"
  },
  {
    title: "AI Alt Text Generation Best Practices",
    description: "How to get the best results from our AI-powered alt text generator.",
    category: "Tools",
    readTime: "7 min read",
    href: "/help/alt-text-generator"
  },
  {
    title: "API Integration Guide",
    description: "Learn how to integrate our accessibility testing API into your workflow.",
    category: "API",
    readTime: "15 min read",
    href: "/help/api-integration"
  },
  {
    title: "Team Collaboration Features",
    description: "Set up and manage team access, roles, and shared projects.",
    category: "Teams",
    readTime: "8 min read",
    href: "/help/team-collaboration"
  }
]

const categories = [
  {
    name: "Getting Started",
    icon: Book,
    description: "New to accessibility testing? Start here.",
    articleCount: 12,
    href: "/help/category/getting-started"
  },
  {
    name: "Tools & Features",
    icon: Zap,
    description: "Learn how to use our accessibility testing tools.",
    articleCount: 24,
    href: "/help/category/tools"
  },
  {
    name: "WCAG Guidelines",
    icon: Shield,
    description: "Understanding WCAG 2.2 and 3.0 compliance requirements.",
    articleCount: 18,
    href: "/help/category/wcag"
  },
  {
    name: "API Documentation",
    icon: ExternalLink,
    description: "Integrate accessibility testing into your development workflow.",
    articleCount: 15,
    href: "/help/category/api"
  },
  {
    name: "Team Management",
    icon: Users,
    description: "Managing teams, roles, and collaborative workflows.",
    articleCount: 8,
    href: "/help/category/teams"
  },
  {
    name: "Billing & Account",
    icon: MessageCircle,
    description: "Subscription management, billing, and account settings.",
    articleCount: 10,
    href: "/help/category/billing"
  }
]

const faqs = [
  {
    question: "What is web accessibility and why is it important?",
    answer: "Web accessibility ensures that websites and applications are usable by people with disabilities. It's not only a legal requirement in many jurisdictions but also expands your audience and improves user experience for everyone. Our tools help you identify and fix accessibility issues to create more inclusive digital experiences."
  },
  {
    question: "How do I get started with accessibility testing?",
    answer: "Start by signing up for a free account and using our Color Contrast Checker to test your website's color combinations. Then explore our other tools like the Alt Text Generator and Accessibility Audit Helper. We recommend following WCAG 2.2 guidelines as your baseline for compliance."
  },
  {
    question: "What's the difference between WCAG 2.2 and WCAG 3.0?",
    answer: "WCAG 2.2 is the current standard with specific contrast ratio requirements (4.5:1 for AA, 7:1 for AAA). WCAG 3.0 introduces APCA (Advanced Perceptual Contrast Algorithm) which provides more accurate contrast measurements. Our tools support both standards, though WCAG 2.2 should be used for current compliance requirements."
  },
  {
    question: "How many credits do I need for my project?",
    answer: "Credit usage depends on your testing needs. Alt text generation uses 1 credit per image, accessibility audits use 2-5 credits per page depending on complexity. Most users find the Pro plan (1,000 credits/month) sufficient for regular testing. You can always upgrade if you need more."
  },
  {
    question: "Can I use your tools for commercial projects?",
    answer: "Yes! All our plans, including the free tier, can be used for commercial projects. Paid plans offer additional features like custom branding, API access, and priority support that are particularly useful for professional and commercial use."
  },
  {
    question: "Do you offer training or consulting services?",
    answer: "Yes, we offer accessibility training workshops and consulting services for teams and organizations. Our experts can help you develop accessibility strategies, train your team, and ensure compliance with relevant standards. Contact our sales team for more information."
  },
  {
    question: "How do I report a bug or request a feature?",
    answer: "You can report bugs or request features through our support channels. Use the chat widget for immediate assistance, email us at support@accessibility.build, or submit a detailed report through your dashboard. We prioritize feedback from our users and regularly update our tools based on your suggestions."
  },
  {
    question: "Is my data secure and private?",
    answer: "Absolutely. We take data security seriously and follow industry best practices. Your data is encrypted in transit and at rest, we don't store unnecessary information, and we never share your data with third parties. You can read our full privacy policy for detailed information about how we handle your data."
  }
]

export default function HelpPage() {
  return (
    <div className="container-wide py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Help Center</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Find answers to your questions about accessibility testing, WCAG compliance, and using our tools effectively.
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search for help articles, guides, and FAQs..."
            className="pl-10 h-12 text-base"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Live Chat</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get instant help from our support team
          </p>
          <Button variant="outline" size="sm">
            Start Chat
          </Button>
        </Card>
        
        <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Email Support</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Send us a detailed message
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/contact">
              Contact Us
            </Link>
          </Button>
        </Card>
        
        <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <Book className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Documentation</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Browse our comprehensive guides
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/docs">
              View Docs
            </Link>
          </Button>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="articles" className="space-y-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="articles">Popular Articles</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Popular Articles */}
        <TabsContent value="articles">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {article.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href={article.href}>
                      Read Article
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Categories */}
        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <category.icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {category.articleCount} articles
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={category.href}>
                        Browse
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>

      {/* Contact Section */}
      <div className="mt-20">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you succeed 
              with your accessibility testing goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Live Chat
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                For enterprise support and custom solutions, contact our sales team at{" "}
                <Link href="mailto:sales@accessibility.build" className="text-primary hover:underline">
                  sales@accessibility.build
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

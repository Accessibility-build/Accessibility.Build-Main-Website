import type { Metadata } from "next"
import { Shield, Lock, Eye, UserCheck, FileText, Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | Accessibility.build - Data Protection & Privacy",
  description: "Comprehensive privacy policy explaining how Accessibility.build collects, uses, and protects your personal information and data.",
  keywords: [
    "privacy policy",
    "data protection",
    "GDPR compliance",
    "data security",
    "personal information",
    "cookies policy"
  ],
  openGraph: {
    title: "Privacy Policy - Accessibility.build",
    description: "Learn how we protect your privacy and handle your data responsibly.",
    type: "website",
    url: "https://accessibility.build/privacy",
  },
  alternates: {
    canonical: "https://accessibility.build/privacy"
  }
}

export default function PrivacyPage() {
  return (
    <div className="container-wide py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're committed to protecting your privacy and being transparent about how we handle your data.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline">Last updated: January 15, 2024</Badge>
            <Badge variant="outline">GDPR Compliant</Badge>
          </div>
        </div>

        {/* Quick Overview */}
        <Alert className="mb-8">
          <Eye className="h-4 w-4" />
          <AlertDescription>
            <strong>TL;DR:</strong> We collect minimal data to provide our services, never sell your information, 
            and give you full control over your data. You can delete your account and data at any time.
          </AlertDescription>
        </Alert>

        {/* Key Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Data Minimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                We only collect data that's necessary to provide our services
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <UserCheck className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Your Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                You have full control over your data and can delete it anytime
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Security First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Enterprise-grade security protects your information
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3">Account Information</h3>
            <p>When you create an account, we collect:</p>
            <ul>
              <li>Name and email address (required for account creation)</li>
              <li>Profile information you choose to provide</li>
              <li>Billing information for paid plans (processed securely by Stripe)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Usage Data</h3>
            <p>To improve our services, we collect:</p>
            <ul>
              <li>How you interact with our tools and features</li>
              <li>Pages visited and time spent on our platform</li>
              <li>Device and browser information</li>
              <li>IP address and general location (country/region)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Content Data</h3>
            <p>When you use our tools, we may temporarily process:</p>
            <ul>
              <li>URLs you submit for accessibility testing</li>
              <li>Images you upload for alt text generation</li>
              <li>Color codes you test for contrast compliance</li>
              <li>Reports and results you generate</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Service Delivery</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <ul className="space-y-1">
                    <li>• Provide accessibility testing tools</li>
                    <li>• Generate reports and analytics</li>
                    <li>• Process payments and manage subscriptions</li>
                    <li>• Provide customer support</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Improvement & Security</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <ul className="space-y-1">
                    <li>• Improve our tools and features</li>
                    <li>• Detect and prevent fraud</li>
                    <li>• Monitor system performance</li>
                    <li>• Ensure platform security</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Data Sharing and Third Parties</h2>
            
            <Alert className="not-prose mb-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>We never sell your personal data.</strong> We only share data with trusted partners 
                who help us provide our services.
              </AlertDescription>
            </Alert>

            <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
            <p>We work with carefully selected partners:</p>
            <ul>
              <li><strong>Clerk:</strong> Authentication and user management</li>
              <li><strong>Stripe:</strong> Payment processing (PCI DSS compliant)</li>
              <li><strong>Vercel:</strong> Hosting and infrastructure</li>
              <li><strong>OpenAI:</strong> AI-powered features (images processed securely)</li>
              <li><strong>Analytics providers:</strong> Usage analytics (anonymized data)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Legal Requirements</h3>
            <p>We may disclose information when required by law or to:</p>
            <ul>
              <li>Comply with legal processes or government requests</li>
              <li>Protect our rights, property, or safety</li>
              <li>Prevent fraud or security threats</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
              <div>
                <h3 className="text-lg font-semibold mb-3">Technical Measures</h3>
                <ul className="text-sm space-y-1">
                  <li>• End-to-end encryption in transit (TLS 1.3)</li>
                  <li>• Encryption at rest for sensitive data</li>
                  <li>• Regular security audits and monitoring</li>
                  <li>• Secure cloud infrastructure (SOC 2 compliant)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Organizational Measures</h3>
                <ul className="text-sm space-y-1">
                  <li>• Limited access on need-to-know basis</li>
                  <li>• Regular employee security training</li>
                  <li>• Incident response procedures</li>
                  <li>• Data retention policies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Your Rights and Choices</h2>
            
            <p>Under GDPR, CCPA, and other privacy laws, you have the right to:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Access & Portability</h4>
                  <p className="text-sm text-muted-foreground">
                    Request a copy of your personal data in a portable format
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Correction</h4>
                  <p className="text-sm text-muted-foreground">
                    Update or correct inaccurate personal information
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Deletion</h4>
                  <p className="text-sm text-muted-foreground">
                    Request deletion of your account and personal data
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Objection</h4>
                  <p className="text-sm text-muted-foreground">
                    Object to certain types of data processing
                  </p>
                </CardContent>
              </Card>
            </div>

            <Alert className="not-prose mt-4">
              <UserCheck className="h-4 w-4" />
              <AlertDescription>
                You can exercise most of these rights directly from your account settings. 
                For other requests, contact us at <Link href="mailto:privacy@accessibility.build" className="underline">privacy@accessibility.build</Link>.
              </AlertDescription>
            </Alert>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking</h2>
            
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Keep you logged in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze how our platform is used</li>
              <li>Provide personalized experiences</li>
            </ul>

            <p>You can control cookies through your browser settings. Note that disabling certain cookies may affect platform functionality.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. International Data Transfers</h2>
            
            <p>
              Our services are hosted in the United States. If you're accessing our platform from outside the US, 
              your data may be transferred to and processed in the US. We ensure appropriate safeguards are in place 
              for international transfers, including:
            </p>
            <ul>
              <li>Standard Contractual Clauses (SCCs) with service providers</li>
              <li>Adequacy decisions where applicable</li>
              <li>Additional security measures for sensitive data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Data Retention</h2>
            
            <p>We retain your data only as long as necessary:</p>
            <ul>
              <li><strong>Account data:</strong> Until you delete your account</li>
              <li><strong>Usage data:</strong> Up to 2 years for analytics</li>
              <li><strong>Billing data:</strong> 7 years for tax and legal requirements</li>
              <li><strong>Support communications:</strong> 3 years</li>
            </ul>

            <p>When you delete your account, we remove your personal data within 30 days, except where retention is required by law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
            
            <p>
              Our services are not intended for children under 13. We do not knowingly collect personal information 
              from children under 13. If we become aware that we have collected such information, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
            
            <p>
              We may update this privacy policy to reflect changes in our practices or legal requirements. 
              We'll notify you of significant changes by:
            </p>
            <ul>
              <li>Email notification to registered users</li>
              <li>Prominent notice on our website</li>
              <li>In-app notifications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
            
            <Card className="not-prose">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Privacy Questions
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      For privacy-related questions or to exercise your rights:
                    </p>
                    <Link href="mailto:privacy@accessibility.build" className="text-primary hover:underline">
                      privacy@accessibility.build
                    </Link>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Data Protection Officer
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      For formal complaints or data protection matters:
                    </p>
                    <Link href="mailto:dpo@accessibility.build" className="text-primary hover:underline">
                      dpo@accessibility.build
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

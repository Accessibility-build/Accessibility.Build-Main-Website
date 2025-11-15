import type { Metadata } from "next"
import { RefreshCcw, Shield, Clock, CheckCircle, AlertCircle, Mail, FileText, CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | Accessibility.build - Consumer Rights",
  description: "Comprehensive cancellation and refund policy for Accessibility.build services. Fair, transparent, and compliant with Indian consumer protection laws.",
  keywords: [
    "cancellation policy",
    "refund policy",
    "consumer rights India",
    "money back guarantee",
    "accessibility tools refund",
    "digital services refund"
  ],
  openGraph: {
    title: "Cancellation & Refund Policy - Accessibility.build",
    description: "Fair and transparent refund policy in compliance with Indian consumer protection laws.",
    type: "website",
    url: "https://accessibility.build/refund",
  },
  alternates: {
    canonical: "https://accessibility.build/refund"
  }
}

export default function RefundPage() {
  return (
    <div className="container-wide py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <RefreshCcw className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Cancellation & Refund Policy</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We stand behind our services with a fair and transparent refund policy in compliance with Indian consumer protection laws.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline">Last updated: November 9, 2025</Badge>
            <Badge variant="outline">Consumer Protection Act, 2019 Compliant</Badge>
          </div>
        </div>

        {/* Quick Overview */}
        <Alert className="mb-8">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Quick Summary:</strong> We offer a 30-day money-back guarantee on all credit purchases. 
            Unused credits can be refunded in full. Free services and promotional credits are non-refundable.
          </AlertDescription>
        </Alert>

        {/* Key Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">30-Day Guarantee</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Full refund available within 30 days of purchase for unused or partially used credits
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Fair Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Refunds processed to original payment method within 7-10 business days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Protected under the Consumer Protection Act, 2019 and Information Technology Act, 2000
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Overview</h2>
            
            <p>
              This Cancellation and Refund Policy governs the refund and cancellation procedures for services 
              provided by Accessibility.build ("we", "us", or "our"). This policy is established in accordance with:
            </p>
            <ul>
              <li>The Consumer Protection Act, 2019</li>
              <li>The Information Technology Act, 2000</li>
              <li>The Consumer Protection (E-Commerce) Rules, 2020</li>
              <li>Payment and Settlement Systems Act, 2007</li>
            </ul>

            <Alert className="not-prose mt-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                By purchasing our services, you acknowledge that you have read, understood, and agree to be bound 
                by this Cancellation and Refund Policy.
              </AlertDescription>
            </Alert>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Refund Eligibility</h2>
            
            <h3 className="text-xl font-semibold mb-3">2.1 Credit Purchases - Eligible for Refund</h3>
            <p>The following credit purchases are eligible for refunds within the specified timeframes:</p>
            <ul>
              <li><strong>Unused Credits:</strong> 100% refund available within 30 days of purchase for completely unused credit packs</li>
              <li><strong>Partially Used Credits:</strong> Pro-rated refund available within 30 days based on remaining unused credits</li>
              <li><strong>Defective Service:</strong> Full refund available if our services fail to perform as advertised due to technical issues on our end</li>
              <li><strong>Duplicate Charges:</strong> Full refund for any unauthorized or duplicate charges processed immediately upon verification</li>
              <li><strong>Service Dissatisfaction:</strong> Refund available within 7 days if you're not satisfied with our services (subject to fair use policy)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Non-Refundable Items</h3>
            <p>The following are not eligible for refunds:</p>
            <ul>
              <li><strong>Free Credits:</strong> The 100 free credits provided upon signup are promotional and non-refundable</li>
              <li><strong>Promotional Credits:</strong> Any bonus or promotional credits received through offers, referrals, or campaigns</li>
              <li><strong>Expired Credits:</strong> We do not offer refunds on credits; however, our credits never expire</li>
              <li><strong>Used Services:</strong> Credits that have been fully consumed cannot be refunded</li>
              <li><strong>After 30 Days:</strong> Refund requests made after 30 days from the date of purchase (except in cases of technical failure on our part)</li>
              <li><strong>Violation of Terms:</strong> No refunds will be provided if your account is terminated due to violation of our Terms of Service</li>
            </ul>

            <Alert className="not-prose mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Under the Consumer Protection Act, 2019, consumers have the right to 
                seek redressal for deficiency in services. If you believe our services are deficient, you may 
                contact us or approach the Consumer Forum.
              </AlertDescription>
            </Alert>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Refund Process & Timeline</h2>
            
            <h3 className="text-xl font-semibold mb-3">3.1 How to Request a Refund</h3>
            <p>To request a refund, please follow these steps:</p>
            <ol>
              <li>Send an email to <Link href="mailto:refunds@accessibility.build" className="text-primary hover:underline">refunds@accessibility.build</Link> with the subject line "Refund Request"</li>
              <li>Include the following information:
                <ul>
                  <li>Your registered email address and account details</li>
                  <li>Transaction ID or order number</li>
                  <li>Date of purchase</li>
                  <li>Amount paid</li>
                  <li>Reason for refund request</li>
                  <li>Proof of purchase (receipt/invoice)</li>
                </ul>
              </li>
              <li>Our support team will review your request within 2-3 business days</li>
              <li>You will receive an email confirmation once your refund is approved or if additional information is needed</li>
            </ol>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Refund Processing Timeline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Request Review</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-2"><strong>Timeline:</strong> 2-3 business days</p>
                  <p>We review your refund request and verify eligibility based on our policy and applicable laws.</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Refund Processing</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-2"><strong>Timeline:</strong> 7-10 business days</p>
                  <p>Once approved, refunds are processed to your original payment method via our payment gateway (Stripe).</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Bank Credit</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-2"><strong>Timeline:</strong> 5-7 business days</p>
                  <p>After processing, your bank or payment provider may take additional time to credit your account.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Timeline</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-2"><strong>Maximum:</strong> 14-20 business days</p>
                  <p>From request submission to funds appearing in your account. We strive to process faster when possible.</p>
                </CardContent>
              </Card>
            </div>

            <Alert className="not-prose mt-6">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> In compliance with the Consumer Protection Act, 2019, we aim to process 
                all genuine refund requests promptly. If you experience delays beyond 20 business days, please 
                contact us immediately.
              </AlertDescription>
            </Alert>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Cancellation Policy</h2>
            
            <h3 className="text-xl font-semibold mb-3">4.1 Credit Purchases (One-Time Payments)</h3>
            <p>
              Since our credit system operates on a one-time purchase model (not subscription-based), 
              there is no recurring billing to cancel. Once purchased, credits remain available in your 
              account indefinitely until used.
            </p>
            <ul>
              <li>No automatic renewals or recurring charges</li>
              <li>No cancellation required as there are no subscriptions</li>
              <li>Credits never expire and remain available for your use</li>
              <li>You may request a refund as per our refund policy outlined above</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Account Deletion</h3>
            <p>You have the right to delete your account at any time:</p>
            <ul>
              <li>Account deletion can be requested from your account settings or by contacting support</li>
              <li>Upon deletion, your personal data will be removed as per our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link></li>
              <li>Unused credits in your account will be forfeited upon account deletion</li>
              <li>If you wish to receive a refund for unused credits, please request a refund before deleting your account</li>
              <li>Account deletion is irreversible and cannot be undone</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Service Interruption or Discontinuation</h3>
            <p>
              In the unlikely event that we discontinue our services or experience extended service interruption:
            </p>
            <ul>
              <li>Users with unused credits will be notified at least 30 days in advance</li>
              <li>Full refunds will be provided for all unused credits</li>
              <li>No penalties or fees will be charged</li>
              <li>We will assist with data export and migration if requested</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Pro-Rated Refund Calculation</h2>
            
            <p>For partially used credit packs, refunds are calculated as follows:</p>
            
            <div className="not-prose bg-muted/50 p-6 rounded-lg border mb-4">
              <h4 className="font-semibold mb-3">Refund Calculation Formula:</h4>
              <code className="block bg-background p-4 rounded border">
                Refund Amount = (Purchase Price × Unused Credits) ÷ Total Credits Purchased
              </code>
              
              <h4 className="font-semibold mt-6 mb-3">Example:</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Credit Pack Purchased:</strong> 500 credits for ₹1,599</li>
                <li>• <strong>Credits Used:</strong> 100 credits</li>
                <li>• <strong>Credits Remaining:</strong> 400 credits</li>
                <li>• <strong>Refund Calculation:</strong> (₹1,599 × 400) ÷ 500 = ₹1,279.20</li>
                <li>• <strong>Refund Amount:</strong> ₹1,279.20</li>
              </ul>
            </div>

            <p>
              <strong>Note:</strong> A nominal processing fee of up to 3% may be deducted to cover payment 
              gateway charges for pro-rated refunds (as permitted under Indian consumer law), or we may 
              waive this fee at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Payment Method & Currency</h2>
            
            <h3 className="text-xl font-semibold mb-3">6.1 Refund Payment Method</h3>
            <p>Refunds will be processed using the same payment method used for the original purchase:</p>
            <ul>
              <li><strong>Credit/Debit Cards:</strong> Refunded to the original card used for payment</li>
              <li><strong>UPI/Net Banking:</strong> Refunded to the source bank account</li>
              <li><strong>Digital Wallets:</strong> Refunded to the original wallet used</li>
              <li><strong>PayPal:</strong> Refunded to your PayPal account</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Currency and Exchange Rates</h3>
            <p>
              For international transactions, refunds will be processed in the original transaction currency. 
              If currency conversion is involved:
            </p>
            <ul>
              <li>Refund amount will be based on the original purchase amount in your local currency</li>
              <li>Exchange rate fluctuations between purchase and refund date may affect the final amount</li>
              <li>Currency conversion fees charged by banks or payment processors are non-refundable</li>
              <li>We are not responsible for exchange rate differences or third-party conversion fees</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold mb-3">7.1 Internal Dispute Resolution</h3>
            <p>
              We encourage you to contact us first to resolve any issues with refunds or cancellations:
            </p>
            <ul>
              <li>Email us at <Link href="mailto:support@accessibility.build" className="text-primary hover:underline">support@accessibility.build</Link></li>
              <li>We aim to respond to all disputes within 48 hours</li>
              <li>Our team will work with you to find a fair resolution</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.2 Consumer Protection Rights</h3>
            <p>
              As per the Consumer Protection Act, 2019, if you are not satisfied with our resolution, 
              you have the right to:
            </p>
            <ul>
              <li>File a complaint with the National Consumer Helpline (NCH): 1800-11-4000 or 14404</li>
              <li>Approach the Consumer Disputes Redressal Commission at District, State, or National level</li>
              <li>File a complaint on the National Consumer Helpline portal: <a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">consumerhelpline.gov.in</a></li>
              <li>Utilize e-Daakhil facility for online filing of consumer complaints</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.3 Jurisdiction</h3>
            <p>
              Any disputes arising from this policy shall be subject to the exclusive jurisdiction of the 
              courts in Bangalore, Karnataka, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Special Circumstances</h2>
            
            <h3 className="text-xl font-semibold mb-3">8.1 Technical Issues</h3>
            <p>
              If you experience technical issues that prevent you from using our services:
            </p>
            <ul>
              <li>Contact our support team immediately with details of the issue</li>
              <li>We will work to resolve the technical problem as quickly as possible</li>
              <li>If we cannot resolve the issue within 7 days, we will offer a full refund or credit extension</li>
              <li>Credits used during the period of technical issues may be restored to your account</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">8.2 Force Majeure</h3>
            <p>
              In cases of force majeure events (natural disasters, wars, pandemics, government restrictions, etc.) 
              that affect our ability to provide services:
            </p>
            <ul>
              <li>We will notify all users of the situation and expected resolution timeline</li>
              <li>Services may be suspended temporarily without refund obligation</li>
              <li>If services are suspended for more than 30 consecutive days, pro-rated refunds will be offered</li>
              <li>Your unused credits will be protected and remain available once services resume</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">8.3 Fraudulent Activities</h3>
            <p>
              We reserve the right to deny refunds in cases of:
            </p>
            <ul>
              <li>Suspected fraudulent activities or abuse of our refund policy</li>
              <li>Chargeback abuse or filing disputes with banks without contacting us first</li>
              <li>Violation of our Terms of Service or Acceptable Use Policy</li>
              <li>Providing false information in refund requests</li>
            </ul>
            <p>
              Such cases may result in account suspension or termination, and we may take appropriate legal action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Tax Implications</h2>
            
            <p>
              Please note that tax implications of refunds depend on your specific circumstances:
            </p>
            <ul>
              <li>GST charged on original purchase will be refunded proportionally with the refund amount</li>
              <li>If you have claimed input tax credit (ITC) on the original purchase, you may need to reverse it upon refund</li>
              <li>We recommend consulting with a tax professional regarding refund-related tax matters</li>
              <li>Refund invoices will be issued for accounting and tax purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
            
            <p>
              We reserve the right to modify this Cancellation and Refund Policy at any time. Any changes will be:
            </p>
            <ul>
              <li>Posted on this page with an updated "Last Updated" date</li>
              <li>Notified to registered users via email for significant changes</li>
              <li>Effective immediately upon posting unless otherwise stated</li>
              <li>Applied only to purchases made after the effective date of changes</li>
            </ul>
            <p>
              Purchases made before policy changes will be governed by the policy in effect at the time of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
            
            <Card className="not-prose">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Refund Requests
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      For refund and cancellation requests:
                    </p>
                    <Link href="mailto:refunds@accessibility.build" className="text-primary hover:underline">
                      refunds@accessibility.build
                    </Link>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      General Support
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      For other queries and support:
                    </p>
                    <Link href="mailto:support@accessibility.build" className="text-primary hover:underline">
                      support@accessibility.build
                    </Link>
                  </div>

                  <div className="md:col-span-2">
                    <h4 className="font-semibold mb-3">Business Address</h4>
                    <p className="text-sm text-muted-foreground">
                      Accessibility.build<br />
                      Bangalore, Karnataka, India<br />
                      GSTIN: [Your GST Number]
                    </p>
                  </div>
                </div>

                <Alert className="mt-6">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Consumer Rights:</strong> This policy is compliant with the Consumer Protection Act, 2019. 
                    For grievances, you may also contact the National Consumer Helpline: 1800-11-4000 or visit{" "}
                    <a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer" className="underline">
                      consumerhelpline.gov.in
                    </a>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Acknowledgment</h2>
            
            <p>
              By making a purchase on Accessibility.build, you acknowledge that:
            </p>
            <ul>
              <li>You have read and understood this Cancellation and Refund Policy</li>
              <li>You agree to abide by the terms outlined in this policy</li>
              <li>You understand your rights under the Consumer Protection Act, 2019</li>
              <li>You agree that this policy forms an integral part of our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link></li>
            </ul>

            <Alert className="not-prose mt-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                We are committed to providing fair and transparent services. If you have any questions about 
                this policy, please don't hesitate to contact us at{" "}
                <Link href="mailto:support@accessibility.build" className="underline">support@accessibility.build</Link>.
              </AlertDescription>
            </Alert>
          </section>
        </div>
      </div>
    </div>
  )
}


import Link from "next/link"
import { Cookie, ShieldCheck } from "lucide-react"
import { CookieSettingsButton } from "@/components/privacy/analytics-consent"
import { createMetadata } from "@/lib/metadata"
import { company, legalLastUpdated } from "@/lib/company"

export const metadata = createMetadata({
  title: "Cookie Policy",
  path: "/cookies",
  description:
    "The essential storage and optional analytics used by Accessibility.build, including how to accept, decline, or revisit analytics consent.",
  keywords: ["Accessibility.build cookies", "analytics consent", "Google Analytics cookies"],
})

export default function CookiesPage() {
  return (
    <div className="container-wide py-12 lg:py-16">
      <article className="mx-auto max-w-3xl">
        <header className="border-b pb-8">
          <div className="flex items-center gap-3">
            <Cookie className="h-8 w-8 text-primary" aria-hidden="true" />
            <p className="text-sm font-semibold uppercase text-primary">Storage and analytics</p>
          </div>
          <h1 className="mt-3 text-4xl font-semibold">Cookie Policy</h1>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            We distinguish storage needed to operate the service from optional analytics used to understand site usage.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {legalLastUpdated}</p>
        </header>

        <div className="my-8 flex flex-col gap-4 border bg-muted/30 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Your analytics choice</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Reopen the consent notice to allow or decline Google Analytics on this device.
            </p>
          </div>
          <CookieSettingsButton />
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <h2>1. What cookies and browser storage are</h2>
          <p>
            Cookies are small values stored by a browser and returned to a website. The platform may also use local storage, which remains in your browser but is not sent with every request. We use both terms collectively as “storage” on this page.
          </p>

          <h2>2. Essential storage</h2>
          <p>
            Essential storage is used without an analytics opt-in because it supports requested or security-related features. Depending on which features you use, this includes:
          </p>
          <ul>
            <li>Clerk authentication and session security for signed-in accounts;</li>
            <li>security, fraud-prevention, checkout, and payment continuity from Stripe or Razorpay;</li>
            <li>theme, interface, dashboard, and accessibility preferences;</li>
            <li>your saved analytics-consent choice.</li>
          </ul>
          <p>
            Blocking essential storage may prevent sign-in, account, billing, preference, or security features from working correctly.
          </p>

          <h2>3. Optional analytics</h2>
          <p>
            Google Analytics is optional and loads only after you select “Allow analytics”. It may set cookies such as <code>_ga</code> and <code>_ga_*</code> to distinguish browsers and understand aggregated usage. Google determines the precise cookie duration and may update it; browser controls can remove the data earlier.
          </p>
          <p>
            Vercel Analytics and Speed Insights help us understand aggregate traffic and performance. We configure the site so the separately identified Google Analytics script remains consent-controlled.
          </p>

          <h2>4. What we do not currently use</h2>
          <p>
            We do not currently load Facebook advertising pixels or LinkedIn conversion-tracking pixels through the site code. Social sharing links and links to our social profiles do not by themselves install those advertising trackers on Accessibility.build.
          </p>

          <h2>5. Changing or withdrawing your choice</h2>
          <p>
            Use the “Review analytics choice” button above at any time. Declining prevents Google Analytics from loading on future page views on that browser. It does not automatically delete information already processed before withdrawal; browser controls can remove existing cookies and local storage.
          </p>
          <p>
            Consent is stored per browser and device. Private browsing, clearing site data, or using a different browser may cause the preference notice to appear again.
          </p>

          <h2>6. Provider information</h2>
          <ul>
            <li><a href="https://clerk.com/legal/privacy" target="_blank" rel="noopener noreferrer">Clerk privacy information</a></li>
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google privacy information</a></li>
            <li><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel privacy information</a></li>
            <li><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe privacy information</a></li>
            <li><a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer">Razorpay privacy information</a></li>
          </ul>

          <h2>7. Contact</h2>
          <p>
            Questions about storage, analytics, or consent can be sent to <a href={`mailto:${company.privacyEmail}`}>{company.privacyEmail}</a>. See the full <Link href="/privacy">Privacy Policy</Link> for information about the business operator, processing purposes, providers, retention, and your rights.
          </p>
          <div className="not-prose mt-8 flex items-start gap-3 border p-5 text-sm leading-6 text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <p>Analytics consent is a real functional setting on this site, not a visual-only preference control.</p>
          </div>
        </div>
      </article>
    </div>
  )
}

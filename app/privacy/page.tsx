import Link from "next/link"
import { Database, Eye, LockKeyhole, ShieldCheck } from "lucide-react"
import { createMetadata } from "@/lib/metadata"
import { company, legalLastUpdated, registeredBusinessAddress } from "@/lib/company"

export const metadata = createMetadata({
  title: "Privacy Policy",
  path: "/privacy",
  description:
    "How Accessibility.build, operated by Khushwant Parihar, collects, uses, shares, retains, and protects information across its website, tools, accounts, and services.",
  keywords: ["Accessibility.build privacy", "accessibility tools data privacy", "AI tool privacy"],
})

const summaries = [
  {
    icon: Eye,
    title: "No sale of personal data",
    text: "We do not sell personal information. We share it only for service delivery, security, payment, legal, and operational needs described below.",
  },
  {
    icon: Database,
    title: "Feature-specific processing",
    text: "URLs, images, code, and other tool inputs are processed only for the feature you request and related security or support needs.",
  },
  {
    icon: LockKeyhole,
    title: "Practical safeguards",
    text: "We use access controls, hosted payment providers, encrypted transport, and service-provider security features appropriate to the platform.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="container-wide py-12 lg:py-16">
      <article className="mx-auto max-w-4xl">
        <header className="border-b pb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" aria-hidden="true" />
            <p className="text-sm font-semibold uppercase text-primary">Privacy and data use</p>
          </div>
          <h1 className="mt-3 text-4xl font-semibold">Privacy Policy</h1>
          <p className="mt-4 max-w-3xl text-lg leading-7 text-muted-foreground">
            This policy explains what Accessibility.build processes, why it is needed, which providers may receive it, and how to contact the responsible business owner.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {legalLastUpdated}</p>
        </header>

        <section className="grid gap-6 border-b py-10 md:grid-cols-3" aria-label="Privacy summary">
          {summaries.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-3 text-base font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </section>

        <div className="prose prose-lg mt-10 max-w-none dark:prose-invert">
          <h2>1. Who is responsible for your information</h2>
          <p>
            Accessibility.build is owned and operated by <strong>{company.legalName}</strong> as a GST-registered sole proprietorship. Khushwant Parihar is the business operator responsible for the processing described in this policy.
          </p>
          <p>
            Privacy enquiries and rights requests can be sent to <a href={`mailto:${company.privacyEmail}`}>{company.privacyEmail}</a>.
          </p>

          <h2>2. Information we collect</h2>
          <h3>Information you provide</h3>
          <ul>
            <li>name, email address, organization, and profile details;</li>
            <li>messages, project enquiries, support communications, and newsletter choices;</li>
            <li>billing identity and transaction references, while full payment-card details are handled by the payment provider;</li>
            <li>URLs, images, documents, code, color values, prompts, reports, and other material submitted to a tool or professional engagement.</li>
          </ul>

          <h3>Information collected during use</h3>
          <ul>
            <li>IP address, browser, device, pages visited, approximate region, referral source, and event information;</li>
            <li>account authentication, security, tool usage, credit, billing, and error records;</li>
            <li>analytics information when you allow optional Google Analytics.</li>
          </ul>

          <h2>3. Why we use information</h2>
          <ul>
            <li>provide accounts, tools, reports, consulting services, support, and requested communications;</li>
            <li>process payments, issue invoices, administer credits, prevent fraud, and maintain tax records;</li>
            <li>operate, secure, troubleshoot, measure, and improve the website, tools, and account service;</li>
            <li>respond to legal obligations, enforce agreements, and protect users and the service;</li>
            <li>send product or educational updates when you have requested them, with an unsubscribe option.</li>
          </ul>
          <p>
            Depending on where you live, the legal basis may be performance of a contract, your consent, compliance with law, or a legitimate interest such as security and service improvement. Where consent is required, you may withdraw it for future processing.
          </p>

          <h2>4. Tool inputs and AI processing</h2>
          <p>
            Some features send the input needed for your request to an AI or infrastructure provider. Depending on the selected feature and configured provider, this may include OpenAI, Anthropic, or OpenRouter. Do not submit information you are not authorized to process, credentials, or highly sensitive personal data.
          </p>
          <p>
            AI output can be incomplete or incorrect and should be reviewed by a qualified person. We do not use a tool result as a certification of accessibility or legal compliance.
          </p>

          <h2>5. Service providers and disclosures</h2>
          <p>Information may be processed by providers used for the following functions:</p>
          <ul>
            <li><strong>Clerk:</strong> authentication and account management;</li>
            <li><strong>Stripe and Razorpay:</strong> hosted payment, billing, fraud prevention, and refunds;</li>
            <li><strong>Vercel:</strong> website hosting, performance, and privacy-focused site analytics;</li>
            <li><strong>Google Analytics:</strong> optional usage analytics after consent;</li>
            <li><strong>OpenAI, Anthropic, and OpenRouter:</strong> AI-assisted features when the relevant provider is used;</li>
            <li><strong>Sanity:</strong> content management and blog delivery;</li>
            <li><strong>Formspree and Resend:</strong> contact-form processing and transactional or requested email;</li>
            <li><strong>database and infrastructure providers:</strong> account, usage, billing, and application data storage.</li>
          </ul>
          <p>
            Providers receive only the information reasonably needed for their role and process it under their own terms and privacy commitments. We may also disclose information when required by law, to respond to a valid legal request, or to protect rights, safety, and service security.
          </p>

          <h2>6. Cookies and analytics choices</h2>
          <p>
            Essential storage supports authentication, security, preferences, and account features. Google Analytics loads only after you choose “Allow analytics” in our preference notice. You can revisit that choice on the <Link href="/cookies">Cookie Policy</Link> page.
          </p>

          <h2>7. Retention</h2>
          <p>We keep information only for as long as reasonably needed for the purpose described:</p>
          <ul>
            <li>account and service records while the account or engagement is active and for a reasonable period afterward;</li>
            <li>transaction, invoice, and tax records for the period required by applicable law;</li>
            <li>support and contract communications while needed to resolve the matter and establish business records;</li>
            <li>security logs for a limited period appropriate to investigation and service protection;</li>
            <li>tool inputs and generated results according to feature operation, user account storage, support needs, and provider processing.</li>
          </ul>
          <p>
            Backups and records required for fraud prevention, disputes, tax, or legal compliance may remain for a limited period after deletion from active systems.
          </p>

          <h2>8. International processing</h2>
          <p>
            Accessibility.build operates from India and uses providers that may process information in India, the United States, the European Economic Area, and other locations. Where required, providers and contractual safeguards are used to support lawful transfers.
          </p>

          <h2>9. Your choices and rights</h2>
          <p>Depending on applicable law, you may ask us to:</p>
          <ul>
            <li>confirm whether we process your personal information and provide access to it;</li>
            <li>correct inaccurate or incomplete information;</li>
            <li>delete information where no legal or operational exception applies;</li>
            <li>restrict or object to certain processing;</li>
            <li>provide portable information where applicable;</li>
            <li>withdraw consent or unsubscribe from marketing communications.</li>
          </ul>
          <p>
            Send requests to <a href={`mailto:${company.privacyEmail}`}>{company.privacyEmail}</a>. We may need to verify identity and authority before acting. You may also complain to the relevant data-protection or consumer authority in your jurisdiction.
          </p>

          <h2>10. Security</h2>
          <p>
            We use reasonable technical and organizational safeguards appropriate to the service, including encrypted network transport, managed authentication, role-based access where available, hosted payment collection, dependency and platform updates, and restricted administrative access. No internet service can guarantee absolute security.
          </p>

          <h2>11. Children</h2>
          <p>
            The platform is intended for professionals and organizations, not children. We do not knowingly collect personal information from children who cannot legally consent to the relevant processing. Contact us if you believe a child has submitted information.
          </p>

          <h2>12. Changes and contact</h2>
          <p>
            We will update this page and its revision date when our practices materially change. Registered users may receive additional notice when a change significantly affects their account or paid service.
          </p>
          <address className="not-italic">
            <strong>{company.brandName}</strong><br />
            Legal name: {company.legalName}<br />
            {registeredBusinessAddress}<br />
            GSTIN: {company.gstin}<br />
            Email: <a href={`mailto:${company.privacyEmail}`}>{company.privacyEmail}</a>
          </address>
        </div>
      </article>
    </div>
  )
}

import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { company, legalLastUpdated, registeredBusinessAddress } from "@/lib/company"

export const metadata = createMetadata({
  title: "Terms of Service",
  path: "/terms",
  description:
    "Terms governing use of Accessibility.build tools, content, accounts, credit purchases, and professional accessibility services.",
  keywords: ["Accessibility.build terms", "accessibility services terms", "website terms India"],
})

export default function TermsPage() {
  return (
    <div className="container-wide py-12 lg:py-16">
      <article className="mx-auto max-w-3xl">
        <header className="border-b pb-8">
          <p className="text-sm font-semibold uppercase text-primary">Legal</p>
          <h1 className="mt-2 text-4xl font-semibold">Terms of Service</h1>
          <p className="mt-4 text-muted-foreground">Last updated: {legalLastUpdated}</p>
        </header>

        <div className="prose prose-lg mt-10 max-w-none dark:prose-invert">
          <h2>1. Business identity</h2>
          <p>
            Accessibility.build is a founder-owned accessibility practice and technology platform operated by <strong>{company.legalName}</strong> as a sole proprietorship. The business holds regular GST registration {company.gstin}. In these terms, “Accessibility.build”, “we”, “us”, and “our” refer to that business operation.
          </p>

          <h2>2. Acceptance and eligibility</h2>
          <p>
            These terms apply when you visit the website, create an account, use a tool, purchase credits, or engage professional services. By doing so, you agree to these terms and the linked <Link href="/privacy">Privacy Policy</Link>, <Link href="/cookies">Cookie Policy</Link>, and <Link href="/refund">Refund Policy</Link>. If you use the service for an organization, you confirm that you are authorized to accept these terms for it.
          </p>
          <p>You must be legally capable of entering a binding contract in your jurisdiction.</p>

          <h2>3. Platform tools and professional services</h2>
          <p>
            The website includes educational content, automated and AI-assisted tools, account features, and separately scoped professional services. A tool result is informational and does not constitute a complete accessibility audit, certification, legal opinion, or guarantee of WCAG conformance.
          </p>
          <p>
            Consulting engagements are governed by the accepted proposal, statement of work, invoice, or other written agreement. If that agreement conflicts with these website terms, the engagement-specific agreement controls for that work.
          </p>

          <h2>4. Accounts and security</h2>
          <p>
            You are responsible for accurate account information, safeguarding your credentials, and activity under your account. Notify us promptly at <a href={`mailto:${company.email}`}>{company.email}</a> if you suspect unauthorized access. We may suspend access to protect users, investigate misuse, comply with law, or prevent harm to the service.
          </p>

          <h2>5. Submitted content and confidentiality</h2>
          <p>
            You retain ownership of URLs, images, documents, code, and other material you submit. You grant us only the limited permission needed to process that material, provide the requested feature, secure the service, and meet legal obligations. You confirm that you have the right to submit the material and that it does not unlawfully expose personal, confidential, or third-party information.
          </p>
          <p>
            Do not submit secrets, production credentials, health records, financial account data, or other highly sensitive information unless a written engagement specifically provides for it. Client confidentiality terms agreed in a proposal, NDA, or statement of work remain applicable.
          </p>

          <h2>6. Payments, credits, taxes, and refunds</h2>
          <p>
            Prices, currency, included scope, payment milestones, and applicable taxes are shown before purchase or in the relevant proposal. Digital credits are not currency, cannot be transferred unless we approve it, and may be used only for eligible platform features. GST and other applicable tax particulars are shown on valid invoices where required.
          </p>
          <p>
            Refund eligibility and processing are described in our <Link href="/refund">Cancellation and Refund Policy</Link>. Payment processors may apply their own terms and processing times.
          </p>

          <h2>7. Acceptable use</h2>
          <p>You must not:</p>
          <ul>
            <li>break the law, infringe rights, or submit material you are not authorized to process;</li>
            <li>attempt to bypass authentication, usage limits, billing, or security controls;</li>
            <li>probe, disrupt, overload, scrape, or reverse engineer the service except where law expressly permits;</li>
            <li>use results to misrepresent that a product is certified or guaranteed accessible;</li>
            <li>resell or republish substantial parts of our tools, reports, or content without permission.</li>
          </ul>

          <h2>8. Intellectual property</h2>
          <p>
            Accessibility.build retains rights in its original website design, software, tools, reports, methods, and content, excluding your submitted material and third-party content. You may link to public pages and quote limited portions with attribution. Any broader reproduction, commercial redistribution, or removal of attribution requires written permission.
          </p>

          <h2>9. Accessibility and compliance limitations</h2>
          <p>
            Accessibility is contextual. Automated checks find only a subset of potential barriers, and even professional audits reflect an agreed sample, technology matrix, standard, and date. Laws and standards may change. You remain responsible for your product, implementation decisions, legal advice, and ongoing monitoring.
          </p>

          <h2>10. Service availability and changes</h2>
          <p>
            We work to keep the service available but do not promise uninterrupted or error-free operation. Features may be corrected, improved, limited, or retired. When a material paid feature changes, we will take reasonable steps to notify affected customers and preserve applicable consumer rights.
          </p>

          <h2>11. Disclaimers and limitation of liability</h2>
          <p>
            To the extent permitted by law, free tools and public content are provided “as is” and “as available”. We do not warrant that a scan or recommendation will identify every issue or satisfy every legal requirement. Nothing in these terms excludes liability that cannot lawfully be excluded, including mandatory consumer protections.
          </p>
          <p>
            To the extent permitted by law, our aggregate liability arising from a paid platform purchase is limited to the amount you paid for the affected purchase. Liability for professional services is governed by the applicable written engagement. We are not liable for indirect or consequential loss where such exclusion is lawful.
          </p>

          <h2>12. Termination</h2>
          <p>
            You may stop using the service at any time. We may restrict or terminate access for material breach, unlawful use, security risk, non-payment, or harm to others. Provisions concerning ownership, payment obligations, disclaimers, liability, and dispute resolution survive termination where relevant.
          </p>

          <h2>13. Governing law</h2>
          <p>
            These terms are governed by the laws of India. Subject to mandatory consumer rights and any agreed dispute procedure, courts having jurisdiction over the registered office in Rajasthan will have jurisdiction. Before filing a claim, both parties should attempt in good faith to resolve the matter through written notice.
          </p>

          <h2>14. Changes to these terms</h2>
          <p>
            We may update these terms when the service, business, or applicable requirements change. The revision date will be updated on this page. Material changes affecting registered users or paid services will be communicated through reasonable channels.
          </p>

          <h2>15. Contact</h2>
          <address className="not-italic">
            <strong>{company.brandName}</strong><br />
            Legal name: {company.legalName}<br />
            {registeredBusinessAddress}<br />
            GSTIN: {company.gstin}<br />
            Email: <a href={`mailto:${company.email}`}>{company.email}</a>
          </address>
        </div>
      </article>
    </div>
  )
}

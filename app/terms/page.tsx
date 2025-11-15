import Link from "next/link"

export const metadata = {
  title: "Terms of Service | Accessibility.build",
  description: "Our terms of service outline the rules and guidelines for using our website and services.",
}

export default function TermsPage() {
  return (
    <div className="container-wide py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Last updated: May 15, 2023</p>

          <h2>Introduction</h2>
          <p>
            Welcome to Accessibility.build. These terms and conditions outline the rules and regulations for the use of
            our website.
          </p>
          <p>
            By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use
            Accessibility.build if you do not accept all of the terms and conditions stated on this page.
          </p>

          <h2>License</h2>
          <p>
            Unless otherwise stated, Accessibility.build and/or its licensors own the intellectual property rights for
            all material on Accessibility.build. All intellectual property rights are reserved.
          </p>
          <p>
            You may view and/or print pages from the website for your own personal use subject to restrictions set in
            these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from this website</li>
            <li>Sell, rent, or sub-license material from this website</li>
            <li>Reproduce, duplicate, or copy material from this website</li>
            <li>
              Redistribute content from Accessibility.build (unless content is specifically made for redistribution)
            </li>
          </ul>

          <h2>User Content</h2>
          <p>
            In these terms and conditions, "User Content" means material (including without limitation text, images,
            audio material, video material, and audio-visual material) that you submit to this website, for whatever
            purpose.
          </p>
          <p>
            You grant to Accessibility.build a worldwide, irrevocable, non-exclusive, royalty-free license to use,
            reproduce, adapt, publish, translate, and distribute your User Content in any existing or future media. You
            also grant to Accessibility.build the right to sub-license these rights, and the right to bring an action
            for infringement of these rights.
          </p>

          <h2>Payment and Refunds</h2>
          <p>
            All purchases of credits and services are subject to our Cancellation & Refund Policy. By making a 
            purchase, you agree to our refund terms as outlined in our comprehensive refund policy.
          </p>
          <p>
            <strong>Key Points:</strong>
          </p>
          <ul>
            <li>We offer a 30-day money-back guarantee on credit purchases</li>
            <li>Refunds are available for unused or partially used credits within the specified timeframe</li>
            <li>All refund requests are processed in accordance with the Consumer Protection Act, 2019</li>
            <li>For detailed information, please review our <Link href="/refund" className="text-primary hover:underline">Cancellation & Refund Policy</Link></li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>
            The information on this website is provided free-of-charge, and you acknowledge that it would be
            unreasonable to hold us liable in respect of this website and the information on this website.
          </p>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties, and
            conditions relating to our website and the use of this website (including, without limitation, any
            warranties implied by law in respect of satisfactory quality, fitness for purpose, and/or the use of
            reasonable care and skill).
          </p>

          <h2>Acceptable Use</h2>
          <p>
            You must not use this website in any way that causes, or may cause, damage to the website or impairment of
            the availability or accessibility of the website.
          </p>
          <p>
            You must not use this website in any way which is unlawful, illegal, fraudulent, or harmful, or in
            connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.
          </p>

          <h2>Variation</h2>
          <p>
            We may revise these terms and conditions from time-to-time. Revised terms and conditions will apply to the
            use of this website from the date of publication of the revised terms and conditions on this website.
          </p>

          <h2>Entire Agreement</h2>
          <p>
            These terms and conditions, together with our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and{" "}
            <Link href="/refund" className="text-primary hover:underline">Cancellation & Refund Policy</Link>, constitute the entire agreement between you
            and Accessibility.build in relation to your use of this website and services, and supersede all previous agreements in
            respect of your use of this website.
          </p>

          <h2>Contact Us</h2>
          <p>If you have any questions about these terms of service, please contact us at:</p>
          <p>
            <strong>Email:</strong> terms@accessibility.build
            <br />
            <strong>Address:</strong> 123 Accessibility Street, Web City, 12345
          </p>
        </div>
      </div>
    </div>
  )
}

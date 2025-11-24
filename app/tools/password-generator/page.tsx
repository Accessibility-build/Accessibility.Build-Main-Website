import PasswordGenerator from "@/components/tools/password-generator"
import { ToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata = {
  title: "Password Generator | Strong, Secure & Random Passwords | Free Online Tool",
  description: "Generate strong, secure, and random passwords with customizable options. Create unbreakable passwords with uppercase, lowercase, numbers, symbols. Free password generator with strength analysis.",
  keywords: [
    "password generator",
    "strong password generator",
    "secure password",
    "random password generator",
    "password strength checker",
    "create strong password",
    "generate secure passwords",
    "password maker",
    "random password",
    "password security",
    "strong passwords online"
  ],
  openGraph: {
    title: "Password Generator - Create Strong & Secure Passwords",
    description: "Generate unbreakable passwords with customizable length, characters, and security options. Includes password strength analysis and security tips.",
    type: "website",
    url: "https://accessibility.build/tools/password-generator",
    images: [
      {
        url: "https://accessibility.build/images/tools/password-generator-og.png",
        width: 1200,
        height: 630,
        alt: "Password Generator Tool"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Password Generator - Strong & Secure Passwords",
    description: "Generate strong passwords with customizable options. Free online tool with strength analysis.",
    images: ["https://accessibility.build/images/tools/password-generator-og.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/tools/password-generator"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Password Generator", url: "https://accessibility.build/tools/password-generator" }
]

export default function PasswordGeneratorPage() {
  return (
    <>
      <ToolStructuredData
        name="Password Generator"
        description="Generate strong, secure, and random passwords with customizable options. Create unbreakable passwords with strength analysis."
        url="https://accessibility.build/tools/password-generator"
        applicationCategory="UtilityApplication"
        operatingSystem="Any"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        aggregateRating={{
          ratingValue: "4.9",
          reviewCount: "2100"
        }}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50/30">
        <div className="container-wide py-16">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Password Generator
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create strong, secure, and unbreakable passwords with advanced customization options.
              Generate random passwords with strength analysis and security recommendations.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Cryptographically Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Strength Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>No Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Free Tool</span>
              </div>
            </div>
          </div>

          <PasswordGenerator />

          {/* SEO Content */}
          <div className="max-w-4xl mx-auto mt-16 prose prose-gray dark:prose-invert">
            <h2>Why Use a Strong Password Generator?</h2>
            <p>
              In today's digital world, strong passwords are your first line of defense against cyber attacks.
              Our advanced password generator creates cryptographically secure passwords that are virtually
              impossible to crack using brute force or dictionary attacks.
            </p>

            <h3>Password Security Features</h3>
            <ul>
              <li><strong>Cryptographic Randomness:</strong> Uses secure random number generation</li>
              <li><strong>Customizable Length:</strong> 8-128 characters for maximum flexibility</li>
              <li><strong>Character Sets:</strong> Uppercase, lowercase, numbers, and symbols</li>
              <li><strong>Strength Analysis:</strong> Real-time password strength evaluation</li>
              <li><strong>No Storage:</strong> Passwords are generated client-side and never stored</li>
              <li><strong>Multiple Passwords:</strong> Generate multiple passwords at once</li>
            </ul>

            <h3>Password Security Best Practices</h3>
            <p>
              <strong>Use unique passwords</strong> for every account, enable <strong>two-factor authentication</strong>
              where possible, and consider using a <strong>password manager</strong> to store your generated passwords securely.
            </p>

            <h3>What Makes a Password Strong?</h3>
            <ul>
              <li><strong>Length:</strong> At least 12 characters, preferably 16 or more</li>
              <li><strong>Complexity:</strong> Mix of uppercase, lowercase, numbers, and symbols</li>
              <li><strong>Unpredictability:</strong> No dictionary words or personal information</li>
              <li><strong>Uniqueness:</strong> Different password for each account</li>
            </ul>
          </div>

          <div className="mt-16">
            <RelatedContent
              content="password security generator strong secure random"
              title="Related Tools & Resources"
              maxItems={3}
              showDescriptions={true}
            />
          </div>
        </div>
      </div>
    </>
  )
} 
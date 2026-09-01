import type { Metadata } from 'next'
import Link from 'next/link'
import ImageColorPicker from '@/components/tools/image-color-picker'
import { ToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: 'Image Color Picker - Extract Colors from Images',
  description: 'Sample any pixel of an uploaded image and get HEX, RGB, and HSL values. Build a palette and export it as CSS, SCSS, or JSON. Runs in your browser.',
  keywords: [
    'image color picker',
    'color extraction',
    'color palette generator',
    'hex color picker',
    'rgb color picker',
    'hsl color picker',
    'color palette export',
    'design tools',
    'color analysis',
    'web design tools'
  ],
  openGraph: {
    title: 'Image Color Picker - Extract Colors from Images',
    description: 'Upload images and extract color palettes with precision. Get HEX, RGB, and HSL values instantly.',
    type: 'website',
    url: "https://accessibility.build/tools/image-color-picker",
    images: [
      {
        url: "https://accessibility.build/images/tools/image-color-picker-og.png",
        width: 1200,
        height: 630,
        alt: "Image Color Picker Tool"
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Color Picker - Extract Colors from Images',
    description: 'Upload images and extract color palettes with precision. Get HEX, RGB, and HSL values instantly.',
    images: ["https://accessibility.build/images/tools/image-color-picker-og.png"]
  },
  alternates: {
    canonical: "/tools/image-color-picker"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Image Color Picker", url: "https://accessibility.build/tools/image-color-picker" }
]

// Rendered on the page AND emitted as FAQPage schema by <FaqSection>, from this
// one array, so the two can never drift apart.
const faqs: FaqItem[] = [
  {
    question: "Is my image uploaded to a server?",
    answer:
      "No. The file is read with the browser's FileReader API, drawn onto a hidden canvas, and sampled locally with getImageData. Nothing is sent over the network, and reloading the page clears the image and every picked color.",
  },
  {
    question: "Can this tool check color contrast?",
    answer:
      "No. It reports the sampled values and nothing else. Paste the HEX values into the Contrast Checker to test them against WCAG 2.2 success criteria 1.4.3 Contrast (Minimum), 1.4.6 Contrast (Enhanced), and 1.4.11 Non-text Contrast.",
  },
  {
    question: "Why is the sampled color slightly different from my design file?",
    answer:
      "The picker reads exactly one pixel. Anti-aliased edges, JPEG compression, colour profile conversion when the image was exported, and browser scaling can all shift that pixel by a few values. Sample the middle of a flat area, or type the same coordinates twice to confirm you are reading the same spot, and compare the result with the token in your design system rather than trusting the screenshot.",
  },
  {
    question: "Which image formats can I upload?",
    answer:
      "Any format the browser can decode and the file input accepts as an image type, which in practice means PNG, JPEG, GIF, WebP, SVG, and, in browsers that support it, AVIF. Very large images are drawn at their natural size onto the canvas, so a multi-thousand-pixel photograph will work but may take a moment to sample.",
  },
  {
    question: "Do saved palettes persist between visits?",
    answer:
      "No. Save Palette keeps palettes in memory for the current session only; they are gone when you close or reload the tab. Export the palette as CSS, SCSS, or JSON before you leave if you want to keep it.",
  },
]

export default function ImageColorPickerPage() {
  return (
    <>
      <ToolStructuredData
        name="Image Color Picker"
        description="Upload images and extract color palettes with precision. Get HEX, RGB, and HSL values instantly."
        url="https://accessibility.build/tools/image-color-picker"
        applicationCategory="DesignApplication"
        operatingSystem="Any"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="container-wide py-10 sm:py-12">
          <ImageColorPicker />

          {/* Supporting guidance */}
          <div className="mt-16 max-w-3xl mx-auto space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What the Image Color Picker Does
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This tool reads the colour of individual pixels in an image you
                supply. Upload a screenshot, a brand asset, or an exported design
                frame, click any point on it, and the picker reports that
                pixel&apos;s value as HEX, RGB, and HSL. Each pick is added to a
                running list, and the list can be exported as CSS custom
                properties, SCSS variables, or JSON.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The typical accessibility use is recovering the real colours from
                a page or mockup so they can be tested. Designers often know the
                intended token, but the shipped colour after gradients, overlays,
                opacity, and image compression can differ. Sampling the rendered
                pixel tells you what users actually see, which is the value a
                contrast test needs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                How to Use It
              </h2>
              <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">Choose an image.</strong>{" "}
                  Click Choose Image and pick a file. The image dimensions appear
                  as a badge once it loads.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Pick by clicking or by coordinates.</strong>{" "}
                  Press Pick Color, then click anywhere on the image. If you need
                  a repeatable sample, type an X and Y position into the
                  coordinate fields and press Sample coordinate instead. The
                  coordinates are in the image&apos;s own pixels, not the
                  displayed size, so they stay valid at any zoom level.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Copy or export.</strong>{" "}
                  Each picked colour shows its HEX, RGB, and HSL values with a
                  copy button beside each. Use the Export Palette card to download
                  the whole set, or Save Palette to keep a snapshot while you
                  keep sampling.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What It Checks, and What It Does Not
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The picker does not evaluate anything against WCAG. It is a
                measuring instrument: it tells you what colour a pixel is, and it
                stops there. It does not know which of two colours is the text
                and which is the background, it does not compute a contrast
                ratio, and it cannot tell whether a colour is being used to
                convey information on its own.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The values it produces feed directly into four WCAG 2.2 success
                criteria, all of which need a manual step after sampling:
              </p>
              <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-2 mb-4">
                <li>
                  <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">1.4.3 Contrast (Minimum)</Link>{" "}
                  (Level AA): text needs a 4.5:1 ratio against its background, or
                  3:1 for large text. Sample the text colour and the background
                  colour, then test the pair.
                </li>
                <li>
                  <Link href="/wcag/1-4-6" className="text-blue-600 dark:text-blue-400 hover:underline">1.4.6 Contrast (Enhanced)</Link>{" "}
                  (Level AAA): the stricter 7:1 and 4.5:1 thresholds.
                </li>
                <li>
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">1.4.11 Non-text Contrast</Link>{" "}
                  (Level AA): a 3:1 ratio for the visible boundaries of controls
                  and for the parts of graphics needed to understand them. Sample
                  the border or icon colour, not the fill behind it.
                </li>
                <li>
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">1.4.1 Use of Color</Link>{" "}
                  (Level A): knowing the exact colours of, say, a red and a green
                  status dot helps you check that something other than hue also
                  distinguishes them.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                For the ratio itself, paste the HEX values into the{" "}
                <Link href="/tools/contrast-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Contrast Checker
                </Link>
                . Remember that a sample from a screenshot reflects one rendering
                on one display; the authoritative test is against the colours in
                your CSS, and for text on images or gradients you should sample
                the lightest and darkest points the text sits on and test the
                worst case.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Reading the Output
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every entry in the Picked Colors list carries the same
                information in three notations. HEX is the six-digit form most
                CSS uses. RGB gives the red, green, and blue channels from 0 to
                255, which is what the canvas returns before any conversion. HSL
                is derived from the RGB values: hue in degrees, then saturation
                and lightness as percentages, rounded to whole numbers. The
                Position line records the X and Y pixel you sampled so you can
                return to it.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Picking a colour that is already in the list does not add a
                duplicate; the earlier entry is replaced by the new one, so the
                list stays unique by HEX value. Exports number the colours in
                list order: the CSS file declares <code>--color-1</code>,{" "}
                <code>--color-2</code>, and so on inside <code>:root</code>, the
                SCSS file declares <code>$color-1</code> onwards, and the JSON
                file includes the RGB, HSL, and position data for each entry.
                Rename the variables to something meaningful before you commit
                them.
              </p>
            </section>

            <FaqSection faqs={faqs} />
          </div>

          <div className="mt-16">
            <RelatedContent
              content="color picker image extraction design tools palette generator contrast checker WCAG 1.4.3 non-text contrast"
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

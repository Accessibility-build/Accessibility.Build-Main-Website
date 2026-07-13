import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  Code2,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Globe2,
  Keyboard,
  Scale,
  ScanSearch,
  ShieldCheck,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBlogPosts } from "@/lib/sanity"
import { serviceStartingPrices } from "@/lib/service-pricing"
import { getStaticBlogIndexPosts, type BlogIndexPost } from "@/lib/static-blog-posts"
import { cn } from "@/lib/utils"

const portrait = "/images/authors/khushwant-parihar.jpeg"

const services = [
  {
    icon: ScanSearch,
    title: "Accessibility audits",
    description: "Manual and automated evaluation with reproducible evidence, user impact, WCAG mapping, and retest options.",
    price: serviceStartingPrices.audits,
    href: "/services/accessibility-audits",
  },
  {
    icon: Wrench,
    title: "Remediation support",
    description: "Code-level implementation support for agreed findings, shared components, focus, semantics, forms, and interaction patterns.",
    price: serviceStartingPrices.remediation,
    href: "/services/remediation-support",
  },
  {
    icon: BookOpenCheck,
    title: "Training and enablement",
    description: "Role-specific workshops and practical guidance for design, engineering, QA, content, and product teams.",
    price: serviceStartingPrices.training,
    href: "/services/accessibility-training",
  },
]

const deliverySteps = [
  { number: "01", label: "Define scope", detail: "Templates, flows, and environments" },
  { number: "02", label: "Test the product", detail: "Manual, keyboard, and screen reader" },
  { number: "03", label: "Document evidence", detail: "Impact, reproduction, and WCAG mapping" },
  { number: "04", label: "Verify the fix", detail: "Agreed retest in the original environment" },
]

type HomeBlogPost = Pick<
  BlogIndexPost,
  "_id" | "title" | "slug" | "excerpt" | "publishedAt" | "estimatedReadingTime" | "categories"
>

const researchDeskItems = [
  {
    icon: BarChart3,
    label: "Featured synthesis",
    title: "State of Web Accessibility 2026",
    description:
      "A source-linked interpretation of large-scale accessibility datasets, with methodology, limitations, downloadable data, and practical context.",
    href: "/research/state-of-accessibility",
    status: "Reviewed July 2026",
  },
  {
    icon: Scale,
    label: "Litigation data",
    title: "Accessibility Lawsuit Tracker",
    description: "Federal filing trends, reported settlement costs, industry patterns, and documented sources.",
    href: "/research/accessibility-lawsuits",
    status: "Updated regularly",
  },
  {
    icon: Globe2,
    label: "Jurisdiction tracker",
    title: "Accessibility Laws by Jurisdiction",
    description: "Compare requirements, standards, deadlines, enforcement, and penalties across major jurisdictions.",
    href: "/research/accessibility-laws",
    status: "Global coverage",
  },
]

interface EditorialArtworkProps {
  src: string
  alt: string
  sizes: string
  className?: string
  imageClassName?: string
  backingClassName?: string
  surfaceClassName?: string
  clipPath: string
  priority?: boolean
}

function EditorialArtwork({
  src,
  alt,
  sizes,
  className,
  imageClassName,
  backingClassName,
  surfaceClassName,
  clipPath,
  priority = false,
}: EditorialArtworkProps) {
  return (
    <div className={cn("group/art relative", className)}>
      <div
        className={cn(
          "absolute inset-0 translate-x-3 translate-y-3 bg-primary/25 transition-transform duration-500 group-hover/art:translate-x-4 group-hover/art:translate-y-4 dark:bg-primary/35",
          backingClassName,
        )}
        style={{ clipPath }}
        aria-hidden="true"
      />
      <div
        className={cn(
          "absolute inset-0 overflow-hidden bg-white drop-shadow-[0_18px_22px_rgba(15,23,42,0.16)]",
          surfaceClassName,
        )}
        style={{ clipPath }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            "object-cover transition-transform duration-500 group-hover/art:scale-[1.025]",
            imageClassName,
          )}
        />
      </div>
      <span className="absolute left-0 top-4 h-9 w-9 border-l-2 border-t-2 border-primary transition-transform duration-500 group-hover/art:-translate-x-1 group-hover/art:-translate-y-1" aria-hidden="true" />
      <span className="absolute bottom-2 right-0 h-9 w-9 border-b-2 border-r-2 border-a11y-teal transition-transform duration-500 group-hover/art:translate-x-1 group-hover/art:translate-y-1" aria-hidden="true" />
    </div>
  )
}

function formatPostDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "Date unavailable"

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

async function getRecentBlogPosts(): Promise<HomeBlogPost[]> {
  try {
    const posts = (await getBlogPosts()) as HomeBlogPost[]
    const validPosts = posts.filter((post) => post?.slug?.current && post.title && post.publishedAt)

    if (validPosts.length > 0) return validPosts.slice(0, 3)
  } catch {
    // The static index keeps the homepage useful if Sanity is temporarily unavailable.
  }

  return getStaticBlogIndexPosts()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)
}

export default async function HomeClientPage() {
  const recentPosts = await getRecentBlogPosts()

  return (
    <div className="bg-background">
      <section
        className="relative isolate overflow-hidden border-b border-border bg-background text-foreground"
        aria-labelledby="home-hero-heading"
      >
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-y-0 left-1/2 hidden border-l border-primary/10 lg:block" />
          <div className="absolute inset-x-0 top-24 border-t border-border" />
          <div className="absolute -right-16 top-10 h-52 w-52 border border-primary/15" />
        </div>

        <div className="container-wide">
          <div className="grid lg:min-h-[30rem] lg:grid-cols-12">
            <div className="flex flex-col justify-center py-10 sm:py-14 lg:col-span-8 lg:pr-16">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 bg-a11y-teal" aria-hidden="true" />
                  Accessibility.build
                </span>
                <span className="text-muted-foreground">Independent accessibility practice</span>
              </div>

              <h1
                id="home-hero-heading"
                className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] sm:mt-7 sm:text-6xl lg:text-7xl"
              >
                Accessibility work that{" "}
                <span className="relative mt-2 inline-block bg-primary px-2 pb-1 text-primary-foreground sm:mt-0">
                  holds up.
                  <span className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-foreground" aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-foreground" aria-hidden="true" />
                  <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-foreground" aria-hidden="true" />
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-foreground" aria-hidden="true" />
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:mt-7 sm:text-xl sm:leading-8">
                Founder-led audits, remediation, and training with reproducible evidence, clear ownership, and reporting in the format your team uses.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 sm:mt-8">
                <Button asChild className="w-fit">
                  <Link href="/contact">Scope a project <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-fit bg-background/40"
                >
                  <Link href="/sample-audit-report">Sample audit report</Link>
                </Button>
              </div>

              <p className="mt-5 text-sm font-medium text-muted-foreground">
                Fixed-scope audit packages from ${serviceStartingPrices.audits.toLocaleString("en-US")}.
              </p>
            </div>

            <div
              aria-hidden="true"
              className="relative -mx-4 flex min-h-[21rem] items-center justify-center overflow-hidden border-t border-border px-5 py-8 sm:-mx-6 sm:min-h-[25rem] sm:px-10 sm:py-10 lg:col-span-4 lg:mx-0 lg:min-h-full lg:border-l lg:border-t-0 lg:px-6"
            >
              <EditorialArtwork
                src="/images/hero/accessibility-review-collage.webp"
                alt=""
                sizes="(min-width: 1024px) 30vw, 90vw"
                className="h-72 w-full max-w-[23rem] sm:h-80 lg:h-[26rem]"
                imageClassName="object-[center_68%] lg:object-center"
                clipPath="polygon(10% 0, 75% 0, 75% 7%, 100% 7%, 100% 78%, 91% 78%, 91% 100%, 24% 100%, 24% 93%, 0 93%, 0 24%, 10% 24%)"
                priority
              />
            </div>
          </div>

          <ol className="hidden border-t border-border sm:grid sm:grid-cols-2 lg:grid-cols-4" aria-label="Accessibility engagement workflow">
            {deliverySteps.map((step) => (
              <li key={step.number} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-border py-5 sm:px-5 sm:first:pl-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
                <span className="font-mono text-xs font-semibold text-primary">{step.number}</span>
                <span>
                  <span className="block text-sm font-semibold">{step.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">{step.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-wide py-16 lg:py-24" aria-labelledby="services-heading">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Professional services</p>
            <h2 id="services-heading" className="mt-3 text-4xl font-semibold">Defined work, not vague consulting time</h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              Each package publishes its included sample, deliverables, delivery window, assumptions, add-ons, and starting price. Hourly work is used only when a clearly bounded support model is more appropriate.
            </p>
            <Button asChild variant="outline" className="mt-7">
              <Link href="/services">Compare every package</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map(({ icon: Icon, title, description, price, href }, index) => (
              <article
                key={title}
                className="group relative flex flex-col overflow-hidden border p-6 transition-colors duration-300 hover:border-primary/50 hover:bg-primary/[0.035] focus-within:border-primary/50 focus-within:bg-primary/[0.035]"
              >
                <span className="absolute left-0 top-0 h-8 w-8 -translate-x-2 -translate-y-2 border-l-2 border-t-2 border-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:translate-y-0 group-focus-within:opacity-100" aria-hidden="true" />
                <span className="absolute bottom-0 right-0 h-8 w-8 translate-x-2 translate-y-2 border-b-2 border-r-2 border-a11y-teal opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:translate-y-0 group-focus-within:opacity-100" aria-hidden="true" />
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center border bg-background transition-transform duration-300 group-hover:-translate-y-1 group-focus-within:-translate-y-1">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{description}</p>
                <p className="mt-6 border-t pt-4 text-sm text-muted-foreground">Packages from</p>
                <p className="mt-1 text-2xl font-semibold">${price.toLocaleString("en-US")}</p>
                <Link href={href} className="mt-5 inline-flex w-fit items-center font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
                  View scope <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-within:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30" aria-labelledby="paths-heading">
        <div className="container-wide py-16 lg:py-20">
          <h2 id="paths-heading" className="text-4xl font-semibold">Choose the right path</h2>
          <div className="mt-10 grid gap-12 lg:grid-cols-2">
            <div className="group relative border-t pt-6 transition-colors duration-300 hover:border-primary focus-within:border-primary">
              <span className="absolute -top-px left-0 h-0.5 w-16 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 group-focus-within:scale-x-100" aria-hidden="true" />
              <div className="flex items-start justify-between gap-4">
                <FileCheck2 className="h-7 w-7 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-focus-within:-translate-y-1" aria-hidden="true" />
                <span className="font-mono text-xs font-semibold text-muted-foreground">PATH / 01</span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold">For organizations</h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                Commission a scoped audit, remediation sprint, design review, training program, disabled-user study, or conformance documentation engagement.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-a11y-teal" aria-hidden="true" />Named practitioner and written statement of work</li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-a11y-teal" aria-hidden="true" />Reproducible findings and human review</li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-a11y-teal" aria-hidden="true" />Procurement, privacy, and subprocessor information</li>
              </ul>
              <Button asChild className="mt-7"><Link href="/contact">Discuss organizational work</Link></Button>
            </div>
            <div className="group relative border-t pt-6 transition-colors duration-300 hover:border-primary focus-within:border-primary">
              <span className="absolute -top-px left-0 h-0.5 w-16 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 group-focus-within:scale-x-100" aria-hidden="true" />
              <div className="flex items-start justify-between gap-4">
                <Code2 className="h-7 w-7 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-focus-within:-translate-y-1" aria-hidden="true" />
                <span className="font-mono text-xs font-semibold text-muted-foreground">PATH / 02</span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold">For practitioners and teams</h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                Use free testing tools, WCAG references, implementation guides, checklists, and research synthesis while keeping human review in the loop.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-a11y-coral" aria-hidden="true" />Contrast, heading, scope, and audit helpers</li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-a11y-coral" aria-hidden="true" />WCAG 2.2 criterion-level implementation guidance</li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 bg-a11y-coral" aria-hidden="true" />Named authorship and editorial standards</li>
              </ul>
              <Button asChild variant="outline" className="mt-7"><Link href="/tools">Explore free tools</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-slate-950 text-white" aria-labelledby="research-desk-heading">
        <div className="container-wide py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase text-teal-300">Research desk</p>
              <h2 id="research-desk-heading" className="mt-3 max-w-xl text-4xl font-semibold">
                Research that shows its working
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-slate-300">
                Source-linked synthesis, litigation tracking, and jurisdiction research with methodology, limitations, and citation-ready references.
              </p>
              <Button asChild variant="outline" className="mt-7 border-slate-600 bg-transparent text-white hover:bg-white hover:text-slate-950">
                <Link href="/research">Open the research hub <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <EditorialArtwork
                src="/images/home/accessibility-research-collage.webp"
                alt=""
                sizes="(min-width: 1024px) 34vw, 92vw"
                className="mt-10 h-52 w-full max-w-xl lg:h-56"
                imageClassName="object-center"
                backingClassName="bg-teal-300/30 dark:bg-teal-300/30"
                surfaceClassName="bg-slate-950"
                clipPath="polygon(8% 0, 100% 0, 100% 76%, 92% 76%, 92% 100%, 20% 100%, 20% 92%, 0 92%, 0 18%, 8% 18%)"
              />
            </div>

            <div className="border-t border-slate-700 lg:border-l lg:border-t-0 lg:pl-10">
              {researchDeskItems.map(({ icon: Icon, label, title, description, href, status }, index) => (
                <article
                  key={href}
                  className={index === 0
                    ? "group relative -mx-4 px-4 py-8 transition-colors duration-300 hover:bg-white/[0.04] focus-within:bg-white/[0.04] lg:pt-0"
                    : "group relative -mx-4 border-t border-slate-700 px-4 py-8 transition-colors duration-300 hover:bg-white/[0.04] focus-within:bg-white/[0.04]"}
                >
                  <span className="absolute inset-y-6 left-0 w-0.5 origin-center scale-y-0 bg-teal-300 transition-transform duration-300 group-hover:scale-y-100 group-focus-within:scale-y-100" aria-hidden="true" />
                  <div className="grid gap-5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-start">
                    <span className="flex h-10 w-10 items-center justify-center border border-slate-600 text-teal-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-teal-300 group-focus-within:-translate-y-1 group-focus-within:border-teal-300">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase text-blue-300">{label}</p>
                      <h3 className="mt-2 text-2xl font-semibold">{title}</h3>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{description}</p>
                      <Link href={href} className="mt-5 inline-flex items-center border-b border-slate-500 pb-1 text-sm font-semibold hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950">
                        Read research <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-within:translate-x-1" />
                      </Link>
                    </div>
                    <p className="text-xs font-medium text-slate-400 sm:text-right">{status}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide py-16 lg:py-20" aria-labelledby="recent-blogs-heading">
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Recent blogs</p>
            <h2 id="recent-blogs-heading" className="mt-3 text-4xl font-semibold">Current notes for accessibility teams</h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              Recent standards analysis, implementation guidance, testing methods, and practical accessibility decisions.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit shrink-0 sm:justify-self-end">
            <Link href="/blog">View every article <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="mt-10 grid border-t md:grid-cols-3">
          {recentPosts.map((post, postIndex) => {
            const category = post.categories?.[0]?.title || "Accessibility"
            const readingTime = Math.max(1, post.estimatedReadingTime || 1)

            return (
              <article key={post._id} className="group relative flex min-w-0 flex-col overflow-hidden border-b px-4 py-7 transition-colors duration-300 hover:bg-primary/[0.035] focus-within:bg-primary/[0.035] md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                <span
                  className="absolute right-0 top-0 h-16 w-16 translate-x-8 -translate-y-8 bg-primary/[0.08] transition-transform duration-300 group-hover:translate-x-5 group-hover:-translate-y-5 group-focus-within:translate-x-5 group-focus-within:-translate-y-5"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 74%, 74% 74%, 74% 100%, 0 100%)" }}
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-muted-foreground">
                  <span className="font-semibold uppercase text-primary">{category}</span>
                  <span aria-hidden="true">/</span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                  </span>
                  <span className="ml-auto font-mono text-[0.6875rem]" aria-hidden="true">0{postIndex + 1}</span>
                </div>
                <h3 className="mt-5 text-xl font-semibold leading-7">
                  <Link href={`/blog/${post.slug.current}`} className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">{post.title}</Link>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm">
                  <span className="text-muted-foreground">{readingTime} min read</span>
                  <Link href={`/blog/${post.slug.current}`} className="inline-flex items-center font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4" aria-label={`Read ${post.title}`}>
                    Read <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-within:translate-x-1" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="container-wide py-16 lg:py-24" aria-labelledby="delivery-heading">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Delivery formats</p>
            <h2 id="delivery-heading" className="mt-3 text-4xl font-semibold">Receive the findings in the format your team prefers</h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              The reporting format is agreed before work begins. Accessibility.build does not require clients to adopt a proprietary audit platform or move their workflow into an unfamiliar system.
            </p>
            <Button asChild variant="outline" className="mt-7">
              <Link href="/sample-audit-report">Inspect a sample report</Link>
            </Button>
          </div>
          <div>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  icon: FileSpreadsheet,
                  title: "Spreadsheet",
                  text: "A sortable findings register with severity, WCAG mapping, evidence, recommendations, ownership, and status fields agreed for the engagement.",
                },
                {
                  icon: FileText,
                  title: "Accessible PDF",
                  text: "A portable report covering scope, methodology, executive summary, detailed findings, recommendations, limitations, and next steps.",
                },
                {
                  icon: Globe2,
                  title: "Online version",
                  text: "A browser-based report or mutually agreed shared document for teams that prefer online review and collaboration.",
                },
              ].map(({ icon: Icon, title, text }, index) => (
                <article key={title} className="relative border-t pt-5">
                  <span className="absolute -top-px left-0 h-0.5 w-12 bg-primary" aria-hidden="true" />
                  <div className="flex items-start justify-between gap-4">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    <span className="font-mono text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30" aria-labelledby="founder-heading">
        <div className="container-wide grid gap-6 py-10 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center">
          <div className="relative h-24 w-24 shrink-0">
            <span
              className="absolute inset-0 translate-x-2 translate-y-2 bg-primary/20"
              style={{ clipPath: "polygon(0 0, 78% 0, 78% 12%, 100% 12%, 100% 100%, 18% 100%, 18% 88%, 0 88%)" }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 overflow-hidden bg-background"
              style={{ clipPath: "polygon(0 0, 78% 0, 78% 12%, 100% 12%, 100% 100%, 18% 100%, 18% 88%, 0 88%)" }}
            >
              <Image src={portrait} alt="Khushwant Parihar outdoors beside a lake and green hills" fill sizes="96px" className="object-cover" />
            </div>
            <span className="absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase text-primary">About the founder</p>
            <h2 id="founder-heading" className="mt-1 text-2xl font-semibold">Khushwant Parihar</h2>
            <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">
              Founder and accessibility consultant with more than four years of experience across auditing, remediation, accessible development, and software testing.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit shrink-0">
            <Link href="/authors/khushwant-parihar">View profile <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="container-wide py-16 lg:py-20" aria-labelledby="evidence-heading">
        <h2 id="evidence-heading" className="text-4xl font-semibold">Inspect the evidence before engaging</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FileCheck2, title: "Sample audit report", text: "Scope, evidence, severity, limitations, and remediation examples.", href: "/sample-audit-report" },
            { icon: Keyboard, title: "Audit methodology", text: "Manual, automated, keyboard, screen-reader, and retest process.", href: "/methodology" },
            { icon: ShieldCheck, title: "Trust and procurement", text: "Ownership, GST status, providers, policies, and buyer documents.", href: "/procurement" },
            { icon: BookOpenCheck, title: "Editorial standards", text: "Named authorship, sourcing, AI disclosure, updates, and corrections.", href: "/editorial-policy" },
          ].map(({ icon: Icon, title, text, href }, index) => (
            <Link key={href} href={href} className="group relative overflow-hidden border-t px-3 pb-3 pt-5 transition-colors duration-300 hover:border-primary hover:bg-primary/[0.035] hover:text-primary focus-visible:border-primary focus-visible:bg-primary/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
              <span className="absolute -top-px left-0 h-0.5 w-12 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" aria-hidden="true" />
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-10 w-10 items-center justify-center border bg-background transition-transform duration-300 group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </span>
                <span className="font-mono text-xs font-semibold text-muted-foreground">0{index + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              <span className="mt-5 inline-flex items-center text-sm font-semibold text-primary">
                Inspect <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-t border-slate-800 bg-slate-950 text-white" aria-labelledby="project-cta-heading">
        <Image
          src="/images/home/accessibility-cta-background.webp"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover object-[58%_center] lg:object-center"
        />
        <div className="absolute inset-0 -z-10 bg-slate-950/25" aria-hidden="true" />
        <div className="container-wide relative grid gap-8 py-16 lg:grid-cols-12 lg:items-center lg:py-20">
          <div className="lg:col-span-8">
            <p className="text-sm font-semibold uppercase text-teal-300">A clear place to begin</p>
            <h2 id="project-cta-heading" className="mt-3 max-w-3xl text-3xl font-semibold sm:text-4xl">
              Start with a defined accessibility problem
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Share the product, workflows, deadline, and evidence you need. You will receive a scoped recommendation, not an open-ended hourly estimate.
            </p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-teal-300 hover:text-slate-950">
              <Link href="/contact">Contact Khushwant <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

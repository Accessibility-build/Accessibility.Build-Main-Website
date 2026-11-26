# AGENTS.md — Accessibility.build

> AI coding assistant guide for the Accessibility.build project.

## Project Overview

**Accessibility.build** is a web accessibility platform that provides AI-powered auditing tools, WCAG 2.2/3.0 documentation, educational resources, and compliance reporting. The production site serves developers, designers, and organizations working toward WCAG compliance.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16.2** (App Router, Turbopack) |
| Language | **TypeScript 5** (strict mode) |
| UI | **React 19**, **Tailwind CSS 3.4**, **shadcn/ui**, **Radix UI** |
| Animation | **Framer Motion 11** |
| Database | **PostgreSQL** via **Drizzle ORM** |
| Auth | **Clerk** (`@clerk/nextjs`) |
| Payments | **Dodo Payments** (merchant of record; Stripe and Razorpay code kept for past orders only) |
| AI | **OpenAI** (GPT-4 Vision), **Anthropic Claude**, **OpenRouter** |
| CMS | **Sanity** (blog content) |
| A11y Testing | **Axe-core** + **Puppeteer** |
| Email | **Resend**, **Formspree** |
| Analytics | **Vercel Analytics**, **Vercel Speed Insights** |
| Hosting | **Vercel** |

## Project Structure

```
app/                          # Next.js App Router pages & API routes
  api/                        # 34+ API route handlers
  tools/                      # 20 accessibility tools (alt-text, contrast, audit, etc.)
  wcag/                       # WCAG 2.2 guideline pages (23+ criteria)
  wcag-3/                     # WCAG 3.0 documentation
  learn/                      # Educational content (tables, carousels, modals, etc.)
  guides/                     # Implementation guides
  research/                   # Lawsuit tracker, state of accessibility
  blog/                       # Blog (Sanity CMS powered)
  admin/                      # Admin dashboard (protected)
  dashboard/                  # User dashboard (protected)
  billing/                    # Pricing, credits, payment return page
  courses/                    # Paid online courses (sales page + /learn buyers' area)
  account/downloads/          # Purchased template downloads
  sign-in/, sign-up/          # Clerk auth pages
  layout.tsx                  # Root layout (ClerkProvider, ThemeProvider, fonts)

components/                   # 200+ React components
  ui/                         # 50 shadcn/ui primitives (DO NOT modify directly)
  tools/                      # Tool-specific components
  admin/                      # Admin UI
  billing/                    # Payment UI
  blog/                       # Blog components
  header.tsx                  # Main navigation
  footer.tsx                  # Site footer

lib/                          # Shared utilities & business logic
  db/schema.ts                # Drizzle ORM database schema (100+ tables)
  db/index.ts                 # Database connection with retry logic
  utils.ts                    # cn(), formatDate(), createMetadata()
  credits.ts                  # Credit deduction logic
  billing/                    # Payment processing (Stripe, Razorpay)
  email/                      # Email templates
  error-logger.ts             # Structured error logging
  wcag-data.ts                # WCAG guideline data
  url-audit/                  # URL auditor engine: axe-core + keyboard pass, reflow, text spacing, motion, DOM checks (url-audit-processor.ts is unused legacy)
  alt-text-*.ts               # Alt text generation utilities
  clerk-auth*.ts              # Clerk auth helpers

hooks/                        # Custom React hooks
  use-credits.ts              # Credit balance hook
  use-trial-status.ts         # Trial/subscription status
  use-toast.ts                # Toast notifications
  use-media-query.ts          # Responsive breakpoints

types/                        # TypeScript type definitions
scripts/                      # Utility scripts (a11y smoke tests, sitemap gen, etc.)
drizzle/                      # Database migrations
public/                       # Static assets (images, favicon, ads.txt)
_disabled/                    # Shelved features — DO NOT import from this directory
```

## Commands

```bash
npm run dev              # Start dev server (Turbopack, port 3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint
npm run type-check       # TypeScript check (tsc --noEmit)
npm run db:migrate       # Run Drizzle database migrations
npm run a11y:smoke       # Accessibility smoke tests
npm run assistant:index  # Rebuild the Curb assistant's search index (after npm run build)
npm run test:e2e:clerk   # Playwright E2E tests for auth
npm run test:clerk       # Full Clerk test suite (API + webhooks + E2E)
npm run test:courses     # Course state, recovery, activities, and authenticated API tests
```

## Architecture Patterns

### Server vs Client Components
- **Default to Server Components.** Only add `"use client"` when the component needs browser APIs, event handlers, hooks, or state.
- **Tool pages** follow a split pattern:
  - `app/tools/{tool}/page.tsx` — Server Component with metadata export
  - `app/tools/{tool}/client-page.tsx` or inline `"use client"` component — Interactive UI
- WCAG pages follow the same pattern where interactivity is needed.

### API Routes
All API routes use the App Router convention in `app/api/*/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  const user = await currentUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // ... deduct credits, call AI, return response
}
```

### Styling
- **Tailwind CSS** for all styling. Use utility classes directly.
- **`cn()`** from `@/lib/utils` for conditional class merging:
  ```typescript
  import { cn } from "@/lib/utils"
  <div className={cn("base-classes", isActive && "active-classes")} />
  ```
- **shadcn/ui** components live in `components/ui/` — extend via composition, not modification.
- **Dark mode** via `next-themes` (class-based). Use `dark:` Tailwind variants.

### Database
- **Drizzle ORM** with PostgreSQL. Schema in `lib/db/schema.ts`.
- Import the `db` instance from `@/lib/db`:
  ```typescript
  import { db } from "@/lib/db"
  import { users, credits } from "@/lib/db/schema"
  ```
- Migrations via `drizzle-kit`: `npm run db:migrate`

### Metadata & SEO
- Every page must export metadata. Use the `createMetadata()` helper from `@/lib/utils`:
  ```typescript
  import { createMetadata } from "@/lib/utils"
  export const metadata = createMetadata({
    title: "Page Title | Accessibility.build",
    description: "...",
    keywords: ["accessibility", "WCAG"],
  })
  ```
- Include OpenGraph and Twitter card data for all public pages.
- Use JSON-LD structured data where appropriate.

### Path Alias
```
@/* → project root (e.g., @/lib/utils, @/components/ui/button)
```

## Authentication (Clerk)

- **Server-side:** `currentUser()` or `auth()` from `@clerk/nextjs/server`
- **Client-side:** `useUser()`, `useAuth()` from `@clerk/nextjs`
- **No middleware.ts** — auth checks are done in individual routes and pages
- Sign-in/sign-up pages at `/sign-in` and `/sign-up` (Clerk hosted components)
- Webhooks at `/api/webhooks/clerk/route.ts`
- **Account UI:** `/dashboard` uses compact account navigation; `/sign-in` and `/sign-up` (including Clerk verification/recovery steps) use a dedicated auth shell. Keep marketing navigation, the global footer, assistant, consent banner and document-viewer overlays out of these routes. Preserve stored consent choices, Clerk's step-specific headings, and safe return destinations through sign-in, sign-up and onboarding. Run `npm run test:account` and `npm run test:courses` after changing shared route/layout behavior.

## Billing & Credits

- **Payment provider: Dodo Payments** (merchant of record, so it handles sales tax and VAT). `BILLING_PROVIDER` defaults to `dodo`; the Stripe and Razorpay code stays only for historical orders and refunds.
- **One key format for everything sold** (`lib/billing/sellables.ts`), stored in `billing_orders.catalog_key` and as each Dodo product's `metadata.sku`: credit packs (`starter_50`...), course licences (`course:<slug>:<individual|team>`), templates (`template:<slug>:<licence>`).
- **Checkout:** credit packs via `/api/billing/checkout-session`, courses and templates via `/api/checkout`; both create a pending order and a Dodo hosted checkout session (`lib/billing/dodo-service.ts`). Buyers return to `/billing/return`, which waits for the webhook.
- **Guest checkout:** courses and templates can be bought without an account; credit packs require sign-in. Guest orders have `user_id = NULL`, with status access restricted by an HttpOnly cookie whose digest is stored in order metadata. The signed payment webhook supplies the buyer email. Courses and templates are held by that email until Clerk verifies it on sign-in; never claim a purchase from an unverified email. Migration `0020_guest_product_checkout.sql` permits only Dodo digital products to have no user. Run `npm run billing:test-guest` for the full flow against temporary tables (no payments or emails).
- **Fulfilment happens only in the webhook** `/api/webhooks/dodo` (signature checked, deduped on `webhook-id` in `dodo_webhook_events`): credits are added, a course licence is granted, or a template entitlement is created. Refunds and lost disputes reverse them, matched by the stored Dodo `payment_id`.
- **Setup:** Admin → Billing has a Dodo panel that registers the webhook endpoint (and shows its signing secret) and creates or updates the Dodo products. Run it in test mode, then again with live keys.
- **Courses** live under `/courses/<slug>` (sales page) and `/courses/<slug>/learn` (buyers' area, gated by `lib/courses/access.ts`). Course text and questions are in `course_content`, loaded from the owner's private folder with `scripts/courses/seed-course.mjs`; never commit course content. Template files are in `product_files` (`scripts/billing/load-product-files.mjs`) and download from `/account/downloads`.
- **Course release status:** Keep `inDevelopment: true` for both CPACC and WAS in `lib/products.ts`, including their badges and development notices, until the owner explicitly asks to release them. Course improvements or deployments do not authorize removing this status.
- **Course workspace:** `/courses/<slug>/learn` and its descendants use an edge-to-edge course layout with course-only navigation. Keep the website header/footer, global assistant, consent banner and toast overlays out of this workspace; consent choices must remain unchanged. `SiteOnly` unmounts site overlays. Course entry uses a fresh document so the public document-viewer script's persistent observers and dialogs cannot carry into private lessons. Keep public course sales pages and their development badges in the normal website layout.
- **Course learning:** practice saves use revision checks and idempotent request IDs; study notes, activities, bookmarks and inline checks merge atomically. Keep `progress-contract.ts`, `progress-model.ts` and both save controllers aligned. Never revert to replacing progress without a revision. Detailed attempt snapshots are immutable in `course_attempts` (migration `0021_course_attempts.sql`); all attempt/search/tutor routes require course access. Ordinary quizzes and lesson checks use drills, reserving mocks. Flashcard IDs and original `legacyIndex` mappings must survive reordered editions; new cards must not receive old positions. Authored cases/labs remain in private course JSON; only generic activity code and aggregate manifests belong in Git. Validate private course files with `seed-course.mjs --dry-run`, regenerate `lib/courses/manifests/*.json` using `--manifest=<path>`, and seed compatible content with the application release. The lesson study coach receives selected lesson excerpts only and is blocked during an active mock; the general site assistant is hidden from the buyers' area.
- **Skills courses and certificates:** `kind: "skills"` in `lib/courses/config.ts` (currently `accessible-design`) means a learning course: no practice area, flashcards or mock exams (the practice route redirects), a few inline "check your understanding" questions per lesson, and a completion certificate. Lessons can use `figure`, `compare` (avoid/prefer) and `widget` blocks; widgets live in `components/courses/widgets/` and SVG is validated by `safeSvg` in `scripts/courses/course-content.mjs`. A certificate is earned when every lesson is read and every activity is completed in its current version (`lib/courses/certificate-rules.ts`, re-checked server-side in `/api/courses/<slug>/certificate`). Certificates are valid for `validityMonths` (24) and renewed by a paid renewal exam (`renewal:<slug>` sellable, signed-in only, fulfilled in the Dodo webhook as `renewal_attempts_left`; 24 questions, window 60 days before to 12 months after expiry; passing extends expiry by 24 months from the later of expiry or today, same code). Expired certificates cannot download the PDF; past the window the learner restarts the course (`restartCourse`). A final exam gates the certificate (`finalExam` in config: 48 questions shared evenly across the course's sections by `spreadCounts`, so adding a section never lengthens the paper; 80%, 3 attempts per round; after a failed round, completion resets via `applyCompletionReset` (notes and written work kept) and a 30-day cooldown starts). Papers are drawn server-side from `course_content` kind `exam` (seeded from `examQuestions`, never sent to browsers whole) plus generated questions (`lib/courses/exam-variants.ts`); grading is server-only and learners see per-topic scores, never answers. Exam code: `lib/courses/exam*.ts`, `/api/courses/<slug>/exam`, `/courses/<slug>/learn/exam`, admin support at `/api/admin/exams`; tests in `scripts/courses/test-exam.mjs`. Certificates live in `course_certificates` (migration `0022_course_certificates_and_exam.sql`, which also adds `course_exam_status` and `course_exam_attempts`), have a responsive credential page at `/certificates/<code>` (noindex; deliberately not a copy of the certificate), and download as a tagged A4 landscape PDF from `/certificates/<code>/pdf`, which renders the fixed-size design (`CertificateDocument`, 1123 by 794 CSS px, never responsive) from the chrome-free render target `/certificates/<code>/print` with `launchBrowser()`. Show the design elsewhere only through `CertificateScaled` (uniform scaling), and are managed at Admin → Certificates (rename, revoke, reinstate, manual issue; every change is kept in the row's `history`). Lessons can also contain `audit` blocks ("spot the issues": `components/courses/design-audit.tsx` draws the screen from private element data; the checkbox list is the full accessible control and the drawing is a pointer shortcut) and activities can carry a `figure` (design labs). Seventeen widgets live in `components/courses/widgets/`. Lessons can embed a third-party demonstration with a `video` block (`components/courses/lesson-video.tsx`): nothing loads from the video host until the learner presses play, and the block's written `summary` must carry the lesson without it. A course's `capstone` in config names the lesson whose `audit` screens become downloadable design files: `lib/courses/audit-svg.ts` draws them as named-layer SVG, served from the toolkit route as `capstone-screens.svg` and, once the capstone activity is complete, `capstone-solution.svg`. Questions marked `use: "readiness"` are kept out of lessons and the exam bank and feed the optional readiness check at `/courses/<slug>/learn/readiness` (one per section, drawn per visit, never saved). Team licence owners get a completion report on the team page and as CSV (`lib/courses/team-report*.ts`, `/api/courses/<slug>/team-report`): completion facts only, never notes, answers or scores, and seat holders are told on their course home page. Buyers download an annotation kit SVG and a tagged checklist PDF from `/courses/<slug>/learn/toolkit` via `/api/courses/<slug>/toolkit/<file>`; the PDF renders `/toolkit/<slug>/checklist` with a short-lived HMAC token (`lib/courses/toolkit-token.ts`, `TOOLKIT_SIGNING_SECRET` or the Clerk secret). Private content and pipeline: `~/accessibility-build-products/design/` (`EDITION-1.1-BRIEF.md` adds the edition 1.1 lessons, capstone and reference chapters; `build/assemble.py` holds the lesson order and sections).
- **Credit-based system:** Users purchase credits, AI tool usage deducts credits. Core logic in `lib/credits.ts` and `lib/billing/`. API routes check credit balance before making AI calls.

## AI Integrations

- **OpenAI:** GPT-4 Vision for image accessibility analysis, text generation for code/reports
- **Anthropic Claude:** Via `@ai-sdk/anthropic` for advanced analysis
- **Streaming:** Some routes use Web Streams API (`ReadableStream`) for streaming AI responses
- **Rate limiting:** Applied to AI-powered endpoints to prevent abuse
- **Curb assistant:** the site-wide chat widget (`components/assistant/curb-assistant.tsx`, mounted in `app/layout.tsx`) posts to `app/api/assistant/route.ts`, which searches `lib/assistant/site-index.json` and streams an answer from `anthropic/claude-haiku-5.5` via OpenRouter (`ASSISTANT_MODEL` overrides). The index is built from prerendered HTML: run `npm run build && npm run assistant:index` after content changes and commit the JSON. Name, limits and private routes live in `lib/assistant/config.ts`.

## Important Rules

1. **Never commit secrets.** Use `.env.local` for all API keys. The `.env` file must not contain real credentials.
2. **`typescript.ignoreBuildErrors: true`** is set in `next.config.mjs` — this is known tech debt. Do not rely on builds catching type errors; run `npm run type-check` separately.
3. **`serverExternalPackages`** in `next.config.mjs` must include `razorpay`, `puppeteer-core`, `@sparticuz/chromium`, `puppeteer`, and `axe-core`. These packages break if bundled by Turbopack.
4. **`_disabled/` directory** contains shelved features. Never import from it.
5. **Accessibility first.** This is an accessibility platform — all components must meet WCAG 2.2 Level AA. Use semantic HTML, ARIA attributes, keyboard navigation, and sufficient color contrast.
6. **Use `cn()` for classes.** Always use `cn()` from `@/lib/utils` when combining Tailwind classes conditionally.
7. **Font:** Mona Sans via `next/font/google` with `--font-sans` CSS variable.
8. **Images:** `next/image` with remote patterns allowing all HTTPS hosts. SVG allowed via `dangerouslyAllowSVG`.
9. **Component library:** shadcn/ui components in `components/ui/` are generated code. Extend by wrapping, not editing.
10. **Turbopack** is the default bundler for dev. If a package fails in dev but works in production build, check if it needs adding to `serverExternalPackages`.

## Environment Variables

Required env vars (set in `.env.local`):

```
# App
NEXT_PUBLIC_APP_URL=

# Database
DATABASE_URL=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=

# OpenAI
OPENAI_API_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Dodo Payments (payment provider)
DODO_PAYMENTS_API_KEY=          # dodo_test_... or dodo_live_...
DODO_PAYMENTS_WEBHOOK_KEY=      # whsec_..., from Admin > Billing > Set up webhook
DODO_PAYMENTS_ENVIRONMENT=      # test_mode | live_mode (optional; inferred from the key)
BILLING_PROVIDER=dodo

# Razorpay (legacy, past orders only)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

# Email
RESEND_API_KEY=

# OpenRouter (optional)
OPENROUTER_API_KEY=
```

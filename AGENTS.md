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
| Payments | **Stripe** (international) + **Razorpay** (India) |
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
  billing/                    # Pricing & credit management
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
  url-audit-processor.ts      # Website audit engine
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
npm run test:e2e:clerk   # Playwright E2E tests for auth
npm run test:clerk       # Full Clerk test suite (API + webhooks + E2E)
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

## Billing & Credits

- **Dual payment providers:** Stripe (international) + Razorpay (India region)
- **Credit-based system:** Users purchase credits, AI tool usage deducts credits
- Core logic in `lib/credits.ts` and `lib/billing/`
- Webhooks at `/api/webhooks/stripe/route.ts` and `/api/webhooks/razorpay/route.ts`
- API routes check credit balance before making AI calls

## AI Integrations

- **OpenAI:** GPT-4 Vision for image accessibility analysis, text generation for code/reports
- **Anthropic Claude:** Via `@ai-sdk/anthropic` for advanced analysis
- **Streaming:** Some routes use Web Streams API (`ReadableStream`) for streaming AI responses
- **Rate limiting:** Applied to AI-powered endpoints to prevent abuse

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

# Razorpay
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

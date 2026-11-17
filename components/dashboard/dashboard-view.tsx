import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import {
  Activity, AlertCircle, ArrowDownLeft, ArrowRight, ArrowUpRight, BookOpen,
  Check, Coins, Contrast, FileDown, Heading, Image, LifeBuoy, ReceiptText,
  RefreshCw, ScanLine,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CreditTransaction, ToolUsage } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

export interface DashboardStats {
  currentCredits: number
  recentTransactions: CreditTransaction[]
  recentUsage: ToolUsage[]
}

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-slate-950"
const textLink = cn("inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-blue-700 underline-offset-4 hover:underline dark:text-blue-300", focus)
const primaryLink = cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 dark:bg-blue-400 dark:text-slate-950 dark:hover:bg-blue-300", focus)
const tab = "min-h-11 rounded-none border-b-2 border-transparent bg-transparent px-1 py-3 font-semibold text-slate-600 shadow-none transition-none focus-visible:ring-blue-700 data-[state=active]:border-blue-700 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 data-[state=active]:shadow-none dark:text-slate-400 dark:focus-visible:ring-blue-300 dark:data-[state=active]:border-blue-300 dark:data-[state=active]:text-blue-300"

const shortcuts = [
  { title: "Color contrast", description: "Check text and background colors.", href: "/tools/contrast-checker", icon: Contrast, label: "Free" },
  { title: "Alt text", description: "Write useful image descriptions.", href: "/tools/alt-text-generator", icon: Image, label: "AI tool" },
  { title: "Heading structure", description: "Review the outline of a page.", href: "/tools/heading-analyzer", icon: Heading, label: "Free" },
]

const resources = [
  { title: "Your purchases", description: "Open your courses and template downloads.", href: "/account/downloads", icon: FileDown },
  { title: "Billing and receipts", description: "Review payments and credit purchases.", href: "/billing", icon: ReceiptText },
  { title: "Browse courses", description: "Explore CPACC and WAS study resources.", href: "/courses", icon: BookOpen },
]

const toolDetails: Partial<Record<ToolUsage["tool"], { label: string; href: string }>> = {
  alt_text_generator: { label: "Alt text generator", href: "/tools/alt-text-generator" },
  contrast_checker: { label: "Color contrast checker", href: "/tools/contrast-checker" },
  accessibility_audit_helper: { label: "Accessibility audit helper", href: "/tools/accessibility-audit-helper" },
  url_accessibility_auditor: { label: "Website accessibility audit", href: "/tools/url-accessibility-auditor" },
  accessibility_code_generator: { label: "Accessibility code generator", href: "/tools/accessibility-code-generator" },
  heading_analyzer: { label: "Heading analyzer", href: "/tools/heading-analyzer" },
  color_palette_generator: { label: "Color palette generator", href: "/tools/color-palette-generator" },
  mobile_accessibility_checker: { label: "Mobile accessibility checker", href: "/tools/mobile-accessibility-checker" },
  password_generator: { label: "Password generator", href: "/tools/password-generator" },
  json_formatter: { label: "JSON formatter", href: "/tools/json-formatter" },
  base64_converter: { label: "Base64 converter", href: "/tools/base64-converter" },
  image_color_picker: { label: "Image color picker", href: "/tools/image-color-picker" },
  url_encoder_decoder: { label: "URL encoder / decoder", href: "/tools/url-encoder-decoder" },
  pdf_accessibility_checker: { label: "PDF accessibility checker", href: "/tools/pdf-accessibility-checker" },
  overlay_detector: { label: "Overlay detector", href: "/tools/overlay-detector" },
  alt_text_checker: { label: "Alt text checker", href: "/tools/alt-text-checker" },
}

const number = new Intl.NumberFormat("en-US")
const fullDate = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })

function ActivityTime({ date }: { date: Date }) {
  return <time dateTime={date.toISOString()} title={`${fullDate.format(date)} UTC`}>{formatDistanceToNow(date, { addSuffix: true })}</time>
}

/** Data stays server-rendered; only the composed history tabs need client interaction. */
export function DashboardView({ firstName, stats }: { firstName: string | null; stats: DashboardStats | null }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8 sm:mb-10">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Your workspace</p>
        <h1 className="mt-2 break-words text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">{firstName ? `Welcome back, ${firstName}.` : "Your dashboard"}</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">Start a check, pick up your learning, or review your recent work.</p>
      </div>

      {!stats ? (
        <div role="alert" className="mb-6 flex items-start gap-3 rounded-lg border border-amber-600 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950 dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-100">
          <AlertCircle aria-hidden="true" focusable="false" strokeWidth={1.75} className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">We couldn’t load your account activity.</p>
            <p>You can still open the tools below. Reload to try your account data again.</p>
            <a href="/dashboard" className={cn("mt-2 inline-flex min-h-11 items-center gap-2 rounded font-semibold underline underline-offset-4", focus)}><RefreshCw aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4" />Reload dashboard</a>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <section aria-labelledby="start-check-heading" className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-700 dark:border-slate-700 dark:bg-slate-950 dark:text-blue-300"><ScanLine aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-5 w-5" /></span>
            <div className="min-w-0">
              <h2 id="start-check-heading" className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Check a website</h2>
              <p className="mt-2 max-w-xl leading-relaxed text-slate-600 dark:text-slate-400">Find accessibility issues on a web page and get guidance on what to fix next.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/tools/url-accessibility-auditor" className={primaryLink}>Start website audit<ArrowRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4" /></Link>
            <Link href="/tools" className={textLink}>Explore all tools<ArrowUpRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4" /></Link>
          </div>
        </section>

        <section aria-labelledby="credit-balance-heading" className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <h2 id="credit-balance-heading" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400"><Coins aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4" />Available credits</h2>
          <p className={cn("mt-3 break-words font-semibold tabular-nums tracking-tight text-slate-950 dark:text-white", stats ? "text-4xl" : "text-2xl")} data-credit-balance>{stats ? number.format(stats.currentCredits) : "Unavailable"}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{stats?.currentCredits === 0 ? "Add credits for AI tools. Free tools are still available." : "Use credits with AI-powered tools. Free tools don’t use your balance."}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 pt-4">
            <Link href="/pricing" className={textLink}>Add credits<ArrowRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4" /></Link>
            <Link href="/billing" className={cn("inline-flex min-h-11 items-center rounded text-sm font-medium text-slate-600 underline underline-offset-4 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white", focus)}>Billing</Link>
          </div>
        </section>
      </div>

      <section aria-labelledby="useful-tools-heading" className="mt-8 sm:mt-10">
        <h2 id="useful-tools-heading" className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">Useful tools</h2>
        <ul role="list" className="mt-4 grid gap-3 md:grid-cols-3">
          {shortcuts.map((tool) => (
            <li key={tool.href} className="min-w-0">
              <Link href={tool.href} className={cn("group flex h-full min-h-11 items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-500 dark:hover:bg-slate-900", focus)}>
                <tool.icon aria-hidden="true" focusable="false" strokeWidth={1.75} className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
                <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-x-2 gap-y-1"><span className="font-semibold text-slate-950 dark:text-white">{tool.title}</span><span className="text-xs text-slate-500 dark:text-slate-400">{tool.label}</span></span><span className="mt-1 block text-sm leading-relaxed text-slate-600 dark:text-slate-400">{tool.description}</span></span>
                <ArrowUpRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 group-hover:text-blue-700 dark:text-slate-400 dark:group-hover:text-blue-300" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 grid gap-10 border-t border-slate-200 pt-8 dark:border-slate-800 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-8">
        <section aria-labelledby="recent-activity-heading" className="min-w-0">
          <h2 id="recent-activity-heading" className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">Recent activity</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Your latest recorded tool activity and credit changes.</p>
          {!stats ? <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-6 dark:border-slate-700"><p className="font-medium">Your activity is unavailable</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Reload the dashboard to retrieve your recent records.</p></div> : (
            <Tabs defaultValue="usage" className="mt-5">
              <TabsList aria-label="Recent activity type" className="h-auto w-full justify-start gap-4 rounded-none border-b border-slate-200 bg-transparent p-0 dark:border-slate-800">
                <TabsTrigger value="usage" className={tab}>Tool activity</TabsTrigger>
                <TabsTrigger value="transactions" className={tab}>Credit history</TabsTrigger>
              </TabsList>
              <TabsContent value="usage" className="mt-0 focus-visible:ring-blue-700 dark:focus-visible:ring-blue-300">
                <h3 className="sr-only">Recent tool activity</h3>
                {stats.recentUsage.length ? <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-800">{stats.recentUsage.map((usage) => <UsageRow key={usage.id} usage={usage} />)}</ul> : <div className="py-8"><Activity aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-6 w-6 text-slate-500 dark:text-slate-400" /><p className="mt-3 font-medium text-slate-950 dark:text-white">No tool activity yet</p><p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Start with a website audit or try a tool above. Your recent recorded activity will appear here.</p></div>}
              </TabsContent>
              <TabsContent value="transactions" className="mt-0 focus-visible:ring-blue-700 dark:focus-visible:ring-blue-300">
                <h3 className="sr-only">Recent credit transactions</h3>
                {stats.recentTransactions.length ? <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-800">{stats.recentTransactions.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />)}</ul> : <div className="py-8"><ReceiptText aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-6 w-6 text-slate-500 dark:text-slate-400" /><p className="mt-3 font-medium text-slate-950 dark:text-white">No credit activity yet</p><p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">Credit additions, tool usage, and refunds will appear here when recorded.</p></div>}
              </TabsContent>
            </Tabs>
          )}
        </section>

        <aside aria-labelledby="your-account-heading" className="min-w-0 lg:border-l lg:border-slate-200 lg:pl-8 dark:lg:border-slate-800">
          <h2 id="your-account-heading" className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">Your account</h2>
          <ul role="list" className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
            {resources.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={cn("group flex min-h-11 items-start gap-3 rounded-md py-4", focus)}>
                  <item.icon aria-hidden="true" focusable="false" strokeWidth={1.75} className="mt-0.5 h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-950 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">{item.title}</span><span className="mt-1 block text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.description}</span></span>
                  <ArrowUpRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800"><p className="text-sm text-slate-600 dark:text-slate-400">Need a hand with your account?</p><Link href="/contact" className={textLink}><LifeBuoy aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4" />Get help</Link></div>
        </aside>
      </div>
    </div>
  )
}

function UsageRow({ usage }: { usage: ToolUsage }) {
  const detail = toolDetails[usage.tool]
  const label = detail?.label ?? usage.tool.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  return (
    <li className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 py-4">
      <div className="min-w-0 flex-1 basis-52">
        <p className="break-words font-medium text-slate-950 dark:text-white">{label}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400"><ActivityTime date={usage.createdAt} /><span className={cn("inline-flex items-center gap-1", usage.success ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300")}>{usage.success ? <Check aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-3.5 w-3.5" /> : <AlertCircle aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-3.5 w-3.5" />}{usage.success ? "Completed" : "Failed"}</span></div>
      </div>
      <div className="flex shrink-0 items-center gap-4"><span className="text-sm tabular-nums text-slate-600 dark:text-slate-400">{number.format(usage.creditsUsed)} {usage.creditsUsed === 1 ? "credit" : "credits"}</span>{detail ? <Link href={detail.href} aria-label={`Open ${detail.label}`} className={cn("inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-700 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-300", focus)}><ArrowUpRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4" /></Link> : null}</div>
    </li>
  )
}

function TransactionRow({ transaction }: { transaction: CreditTransaction }) {
  const positive = transaction.amount > 0
  const complete = transaction.status === "completed"
  return (
    <li className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 py-4">
      <div className="flex min-w-0 flex-1 basis-52 items-start gap-3">
        <span className="mt-0.5 text-slate-500 dark:text-slate-400">{positive ? <ArrowDownLeft aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4" /> : <ArrowUpRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4" />}</span>
        <div className="min-w-0"><p className="break-words text-sm font-medium leading-relaxed text-slate-950 dark:text-white">{transaction.description}</p><div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400"><ActivityTime date={transaction.createdAt} />{!complete ? <span className="font-medium capitalize">{transaction.status}</span> : null}</div></div>
      </div>
      <div className="shrink-0 text-right"><p className={cn("text-sm font-semibold tabular-nums", positive && complete ? "text-emerald-700 dark:text-emerald-300" : "text-slate-900 dark:text-slate-100")}>{positive ? "+" : ""}{number.format(transaction.amount)} <span className="font-normal">{Math.abs(transaction.amount) === 1 ? "credit" : "credits"}</span></p><p className="mt-1 text-xs tabular-nums text-slate-600 dark:text-slate-400">Balance: {number.format(transaction.balanceAfter)}</p></div>
    </li>
  )
}

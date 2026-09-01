import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpenText, Home, ListChecks, Wrench } from "lucide-react"

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you requested does not exist on Accessibility.build.",
  robots: { index: false, follow: true },
}

const startingPoints = [
  { href: "/tools", label: "Free accessibility tools", icon: Wrench },
  { href: "/guides", label: "Implementation guides", icon: BookOpenText },
  { href: "/wcag", label: "WCAG 2.2 success criteria", icon: ListChecks },
]

export default function NotFound() {
  return (
    <div className="container-wide flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Error 404</p>
      <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Page not found</h1>
      <p className="mt-6 max-w-md text-muted-foreground">
        The address may be mistyped, or the page may have moved. Nothing here was deleted recently, so a
        link that brought you here is probably out of date.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact?topic=website">Report a broken link</Link>
        </Button>
      </div>

      <nav aria-label="Starting points" className="mt-12 w-full max-w-md">
        <ul className="grid gap-3 text-left">
          {startingPoints.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-3 rounded-md border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

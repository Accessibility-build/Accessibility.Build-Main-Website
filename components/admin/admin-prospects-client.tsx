"use client"

import { useEffect, useId, useMemo, useState } from "react"
import Link from "next/link"
import { Filter, ListChecks, Search, Sparkles } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import {
  isAddedToday,
  isAddedWithinDays,
  LiveRegion,
  NewTodayBadge,
  STATUS_LABELS,
  StatusBadge,
  TIER_LABELS,
  TierBadge,
  useAnnouncer,
  type ProspectRecord,
} from "@/components/admin/prospect-ui"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type SortKey = "newest" | "score-desc" | "score-asc" | "company-asc" | "scanned-desc"

const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest first",
  "score-desc": "Score, highest first",
  "score-asc": "Score, lowest first",
  "company-asc": "Company, A to Z",
  "scanned-desc": "Most recently scanned",
}

type AddedKey = "all" | "today" | "week"

const ADDED_LABELS: Record<AddedKey, string> = {
  all: "Any time",
  today: "Added today",
  week: "Added in the last 7 days",
}

const SELECT_CLASSES =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

function compare(a: ProspectRecord, b: ProspectRecord, sort: SortKey) {
  switch (sort) {
    case "newest":
      return (b.createdAt ?? "").localeCompare(a.createdAt ?? "") || b.score - a.score
    case "score-asc":
      return a.score - b.score
    case "company-asc":
      return a.company.localeCompare(b.company)
    case "scanned-desc":
      return (b.scannedAt ?? "").localeCompare(a.scannedAt ?? "")
    case "score-desc":
    default:
      return b.score - a.score
  }
}

export function AdminProspectsClient({
  prospects,
  loadError,
}: {
  prospects: ProspectRecord[]
  loadError: string | null
}) {
  const [search, setSearch] = useState("")
  const [tier, setTier] = useState("all")
  const [status, setStatus] = useState("all")
  const [country, setCountry] = useState("all")
  const [added, setAdded] = useState<AddedKey>("all")
  const [sort, setSort] = useState<SortKey>("score-desc")

  const { message, announce } = useAnnouncer()

  const searchId = useId()
  const tierId = useId()
  const statusId = useId()
  const countryId = useId()
  const addedId = useId()
  const sortId = useId()

  // The daily routine drops a couple of prospects in each morning. Those are the
  // ones to act on first, so they get their own panel above the table rather
  // than being left to surface through a filter nobody remembers to set.
  const todays = useMemo(
    () => prospects.filter(isAddedToday).sort((a, b) => b.score - a.score),
    [prospects]
  )

  const countries = useMemo(() => {
    const set = new Set<string>()
    prospects.forEach((prospect) => {
      if (prospect.country) set.add(prospect.country)
    })
    return [...set].sort((a, b) => a.localeCompare(b))
  }, [prospects])

  const counts = useMemo(() => {
    const byStatus: Record<string, number> = {}
    Object.keys(STATUS_LABELS).forEach((key) => {
      byStatus[key] = 0
    })

    let sendNow = 0
    let withAddress = 0
    let thisWeek = 0

    prospects.forEach((prospect) => {
      byStatus[prospect.status] = (byStatus[prospect.status] ?? 0) + 1
      if (prospect.tier === "send-now") sendNow += 1
      if (prospect.emailAddress) withAddress += 1
      if (isAddedWithinDays(prospect, 7)) thisWeek += 1
    })

    return { total: prospects.length, sendNow, withAddress, byStatus, thisWeek, today: todays.length }
  }, [prospects, todays.length])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    return prospects
      .filter((prospect) => {
        if (tier !== "all" && (prospect.tier ?? "") !== tier) return false
        if (status !== "all" && prospect.status !== status) return false
        if (country !== "all" && (prospect.country ?? "") !== country) return false
        if (added === "today" && !isAddedToday(prospect)) return false
        if (added === "week" && !isAddedWithinDays(prospect, 7)) return false
        if (term && !prospect.company.toLowerCase().includes(term)) return false
        return true
      })
      .sort((a, b) => compare(a, b, sort))
  }, [prospects, search, tier, status, country, added, sort])

  const filtersActive =
    search.trim() !== "" || tier !== "all" || status !== "all" || country !== "all" || added !== "all"

  // Announce the result count whenever the filtered set changes, so keyboard
  // and screen reader users learn the effect of a filter without hunting for it.
  useEffect(() => {
    if (!filtersActive) return
    announce(`${filtered.length} of ${prospects.length} prospects match the current filters.`)
  }, [filtered.length, prospects.length, filtersActive, announce])

  const resetFilters = () => {
    setSearch("")
    setTier("all")
    setStatus("all")
    setCountry("all")
    setAdded("all")
    announce("Filters cleared.")
  }

  const showTodaysOnly = () => {
    setSearch("")
    setTier("all")
    setStatus("all")
    setCountry("all")
    setAdded("today")
    setSort("newest")
    announce(`Filtered to the ${todays.length} prospect${todays.length === 1 ? "" : "s"} added today.`)
  }

  return (
    <div className="space-y-6">
      <LiveRegion message={message} />

      <AdminPageHeader
        eyebrow="Outreach"
        title="Prospects"
        description="Researched leads, each with a verified accessibility finding and a written email. Open a prospect to read it and copy the text into your mail client. Nothing is sent from here."
      />

      {loadError ? (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
        >
          <p>
            <strong>Prospects could not be loaded.</strong> {loadError}
          </p>
        </div>
      ) : null}

      {/* Today's arrivals. Deliberately the first thing on the page and the only
          panel with a filled heading bar, because acting on these the day they
          land is the entire point of the daily routine. */}
      <section
        aria-labelledby="prospects-today-heading"
        className="overflow-hidden rounded-md border-2 border-teal-500 bg-white dark:border-teal-500 dark:bg-slate-900"
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b-2 border-teal-500 bg-teal-600 px-5 py-3 text-white dark:bg-teal-700">
          <Sparkles className="h-5 w-5 shrink-0" aria-hidden="true" />
          <h2 id="prospects-today-heading" className="text-base font-semibold">
            Fresh today
          </h2>
          <span className="text-sm text-teal-50">
            {todays.length === 0
              ? "Nothing new yet"
              : `${todays.length} new prospect${todays.length === 1 ? "" : "s"}`}
          </span>
        </div>

        <div className="p-5">
          {todays.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No prospects have been added today. The daily routine adds two each morning, and they
              appear here first.{" "}
              {counts.thisWeek > 0 ? (
                <>
                  {counts.thisWeek.toLocaleString()} arrived in the last 7 days.
                </>
              ) : null}
            </p>
          ) : (
            <>
              <ul className="space-y-3">
                {todays.map((prospect) => (
                  <li
                    key={prospect.id}
                    className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 rounded-md border border-slate-200 p-4 dark:border-slate-800"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/prospects/${prospect.id}`}
                          className="font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-300"
                        >
                          {prospect.company}
                        </Link>
                        <NewTodayBadge />
                        <TierBadge tier={prospect.tier} />
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {[prospect.country, prospect.sector].filter(Boolean).join(" · ") || "Details pending"}
                      </p>
                      {prospect.caution ? (
                        <p className="mt-2 text-sm font-semibold text-red-700 dark:text-red-300">
                          Caution: {prospect.caution}
                        </p>
                      ) : null}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {prospect.emailAddress ? (
                        <span className="break-all">{prospect.emailAddress}</span>
                      ) : (
                        "No published address, use LinkedIn"
                      )}
                    </p>
                  </li>
                ))}
              </ul>
              {todays.length > 3 ? (
                <Button type="button" variant="outline" className="mt-4" onClick={showTodaysOnly}>
                  Show only today&rsquo;s prospects
                </Button>
              ) : null}
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="prospect-counts-heading">
        <h2 id="prospect-counts-heading" className="sr-only">
          Pipeline summary
        </h2>
        <dl className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 xl:grid-cols-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 sm:border-r xl:border-b-0 dark:border-slate-800">
            <dt className="text-sm text-slate-500">Total prospects</dt>
            <dd className="mt-2 text-2xl font-semibold">{counts.total.toLocaleString()}</dd>
          </div>
          <div className="border-b border-slate-200 p-5 xl:border-b-0 xl:border-r dark:border-slate-800">
            <dt className="text-sm text-slate-500">Added today</dt>
            <dd className="mt-2 text-2xl font-semibold">{counts.today.toLocaleString()}</dd>
            <p className="mt-1 text-xs text-slate-500">
              {counts.thisWeek.toLocaleString()} in the last 7 days
            </p>
          </div>
          <div className="border-b border-slate-200 p-5 xl:border-b-0 xl:border-r dark:border-slate-800">
            <dt className="text-sm text-slate-500">Tier: send now</dt>
            <dd className="mt-2 text-2xl font-semibold">{counts.sendNow.toLocaleString()}</dd>
          </div>
          <div className="border-b border-slate-200 p-5 sm:border-r xl:border-b-0 dark:border-slate-800">
            <dt className="text-sm text-slate-500">With a published address</dt>
            <dd className="mt-2 text-2xl font-semibold">{counts.withAddress.toLocaleString()}</dd>
            <p className="mt-1 text-xs text-slate-500">
              {(counts.total - counts.withAddress).toLocaleString()} need LinkedIn instead
            </p>
          </div>
          <div className="p-5">
            <dt className="text-sm text-slate-500">By status</dt>
            <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <span key={key}>
                  <span className="font-semibold">{(counts.byStatus[key] ?? 0).toLocaleString()}</span>{" "}
                  <span className="text-slate-500">{label.toLowerCase()}</span>
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </section>

      <Card>
        <CardHeader>
          <h2 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
            <Filter className="h-5 w-5" aria-hidden="true" />
            Filter and search
          </h2>
        </CardHeader>
        <CardContent>
          {/* Filtering happens as you type; the submit button is here so the
              Enter key has somewhere to go and nothing depends on JS focus tricks. */}
          <form
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
            onSubmit={(event) => {
              event.preventDefault()
              announce(`${filtered.length} of ${prospects.length} prospects match the current filters.`)
            }}
          >
            <div className="xl:col-span-2">
              <Label htmlFor={searchId}>Search by company</Label>
              <div className="relative mt-1.5">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <Input
                  id={searchId}
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Company name"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={tierId}>Tier</Label>
              <select
                id={tierId}
                className={`${SELECT_CLASSES} mt-1.5`}
                value={tier}
                onChange={(event) => setTier(event.target.value)}
              >
                <option value="all">All tiers</option>
                {Object.entries(TIER_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor={statusId}>Status</Label>
              <select
                id={statusId}
                className={`${SELECT_CLASSES} mt-1.5`}
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="all">All statuses</option>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor={countryId}>Country</Label>
              <select
                id={countryId}
                className={`${SELECT_CLASSES} mt-1.5`}
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              >
                <option value="all">All countries</option>
                {countries.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor={sortId}>Sort by</Label>
              <select
                id={sortId}
                className={`${SELECT_CLASSES} mt-1.5`}
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
              >
                {Object.entries(SORT_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor={addedId}>Added</Label>
              <select
                id={addedId}
                className={`${SELECT_CLASSES} mt-1.5`}
                value={added}
                onChange={(event) => setAdded(event.target.value as AddedKey)}
              >
                {Object.entries(ADDED_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2 xl:col-span-2">
              <Button type="submit">Apply</Button>
              <Button type="button" variant="outline" onClick={resetFilters} disabled={!filtersActive}>
                Clear filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
            <ListChecks className="h-5 w-5" aria-hidden="true" />
            Showing {filtered.length.toLocaleString()} of {counts.total.toLocaleString()}
          </h2>
        </CardHeader>
        <CardContent>
          {counts.total === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <p className="font-medium">No prospects yet.</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Load your researched leads with{" "}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
                  node --env-file=.env.local scripts/seed-prospects.mjs --file ./data/prospects.seed.json
                </code>
                . The data file is gitignored and never leaves this machine.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <p className="font-medium">No prospects match these filters.</p>
              <Button type="button" variant="outline" className="mt-4" onClick={resetFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableCaption className="mt-0 caption-top pb-4 text-left">
                  Researched prospects, {SORT_LABELS[sort].toLowerCase()}. Select a company name to read its
                  finding and copy its email.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">Company</TableHead>
                    <TableHead scope="col">Country</TableHead>
                    <TableHead scope="col">Sector</TableHead>
                    <TableHead scope="col">Tier</TableHead>
                    <TableHead scope="col">Email address</TableHead>
                    <TableHead scope="col">Status</TableHead>
                    <TableHead scope="col" className="text-right">
                      Score
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((prospect) => (
                    <TableRow key={prospect.id}>
                      <TableHead scope="row" className="h-auto py-4 font-normal text-foreground">
                        <Link
                          href={`/admin/prospects/${prospect.id}`}
                          className="font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-300"
                        >
                          {prospect.company}
                        </Link>
                        {isAddedToday(prospect) ? <NewTodayBadge className="ml-2 align-middle" /> : null}
                        {prospect.caution ? (
                          <span className="mt-1 block text-xs font-semibold text-red-700 dark:text-red-300">
                            Caution: {prospect.caution}
                          </span>
                        ) : null}
                      </TableHead>
                      <TableCell>{prospect.country ?? "Unknown"}</TableCell>
                      <TableCell className="max-w-[18rem]">{prospect.sector ?? "Unknown"}</TableCell>
                      <TableCell>
                        <TierBadge tier={prospect.tier} />
                      </TableCell>
                      <TableCell>
                        {prospect.emailAddress ? (
                          <span className="break-all">{prospect.emailAddress}</span>
                        ) : (
                          <span className="text-slate-600 dark:text-slate-400">None — use LinkedIn</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={prospect.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{prospect.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

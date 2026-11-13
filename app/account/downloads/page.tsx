import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Download } from "lucide-react"
import { getCourseViewer } from "@/lib/courses/access"
import { getDownloadEntitlements, listProductFiles } from "@/lib/downloads/access"
import { getTemplateProduct } from "@/lib/billing/sellables"
import { getCourseAccess } from "@/lib/courses/access"
import { COURSES } from "@/lib/courses/config"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Your purchases", robots: { index: false, follow: false } }

function size(n: number) {
  return n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`
}

export default async function DownloadsPage() {
  const viewer = await getCourseViewer()
  if (!viewer) redirect(`/sign-in?redirect_url=${encodeURIComponent("/account/downloads")}`)
  const ents = await getDownloadEntitlements(viewer)
  const slugs = [...new Set(ents.map((e) => e.productSlug))]
  const products = await Promise.all(slugs.map(async (slug) => ({ slug, product: getTemplateProduct(slug), files: await listProductFiles(slug) })))
  const courses = (await Promise.all(Object.values(COURSES).map(async (c) => ({ c, access: await getCourseAccess(c.slug) })))).filter((x) => x.access.hasAccess)

  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Your purchases</h1>
        <p className="mt-3 text-slate-700 dark:text-slate-300">Everything you have bought with {viewer.email}. Files stay available here whenever you sign in.</p>

        {courses.length ? (
          <section aria-labelledby="courses-h" className="mt-10">
            <h2 id="courses-h" className="text-xl font-semibold text-slate-900 dark:text-white">Courses</h2>
            <ul className="mt-3 space-y-2" role="list">
              {courses.map(({ c }) => (
                <li key={c.slug}>
                  <Link href={c.homeRoute} className="font-medium text-blue-700 dark:text-blue-400 underline underline-offset-2">Open the {c.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="files-h" className="mt-10">
          <h2 id="files-h" className="text-xl font-semibold text-slate-900 dark:text-white">Templates</h2>
          {!products.length ? (
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              No template purchases yet. <Link href="/templates" className="underline underline-offset-2">Browse the templates</Link>.
            </p>
          ) : (
            products.map(({ slug, product, files }) => (
              <div key={slug} className="mt-5 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{product?.name ?? slug}</h3>
                {files.length ? (
                  <ul className="mt-3 space-y-2" role="list">
                    {files.map((f) => (
                      <li key={f.filename}>
                        <a href={`/api/downloads/${slug}/${encodeURIComponent(f.filename)}`} className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border-2 border-blue-700 px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                          <Download className="h-4 w-4" aria-hidden="true" />
                          Download {f.filename} <span className="font-normal">({size(f.sizeBytes)}, version {f.version})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-slate-700 dark:text-slate-300">The files are being prepared. Please check back shortly or contact us.</p>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  )
}

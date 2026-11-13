import { NextRequest, NextResponse } from "next/server"
import { AdminAccessError, requireAdminApi } from "@/lib/admin-auth"
import { isDodoConfigured } from "@/lib/billing/dodo"
import { syncDodoProducts } from "@/lib/billing/dodo-products"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** GET: dry run (what would be created or updated). POST { apply: true }: create and update products. */
async function handle(apply: boolean) {
  try {
    await requireAdminApi()
    if (!isDodoConfigured()) return NextResponse.json({ error: "DODO_PAYMENTS_API_KEY is not set" }, { status: 503 })
    return NextResponse.json(await syncDodoProducts(apply))
  } catch (e) {
    if (e instanceof AdminAccessError) return NextResponse.json({ error: e.message }, { status: e.statusCode })
    return NextResponse.json({ error: e instanceof Error ? e.message : "Sync failed" }, { status: 500 })
  }
}

export async function GET() {
  return handle(false)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  return handle(body.apply === true)
}

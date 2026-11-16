/**
 * Exercises the real routes, fulfilment, receipts and verified-email access claims.
 * Uses empty PostgreSQL TEMP tables inside a rolled-back transaction. Dodo, Clerk
 * and Resend are replaced at the network boundary: no charges or emails are sent.
 * Run: npm run billing:test-guest (DATABASE_URL or BILLING_TEST_DATABASE_URL required).
 */
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import Module from "node:module"
import { fileURLToPath } from "node:url"
import { build } from "esbuild"
import { parse } from "dotenv"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { eq, sql } from "drizzle-orm"
import { NextRequest } from "next/server.js"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const local = Object.assign({}, ...[".env", ".env.local"].map((name) => {
  const file = path.join(root, name)
  return fs.existsSync(file) ? parse(fs.readFileSync(file)) : {}
}))
const databaseUrl = process.env.BILLING_TEST_DATABASE_URL || process.env.DATABASE_URL || local.DATABASE_URL
if (!databaseUrl) throw new Error("Set BILLING_TEST_DATABASE_URL or DATABASE_URL before running the guest checkout test")
process.env.BILLING_PROVIDER = "dodo"
process.env.BILLING_ENABLED = "true"
process.env.DODO_PAYMENTS_API_KEY = "test-network-is-stubbed"
process.env.NEXT_PUBLIC_APP_URL = "https://accessibility.build"
process.env.NODE_ENV = "production"

const state = {
  db: null, user: null, emails: [], sessions: [], failCheckout: false, payments: new Map(),
  client: {
    checkoutSessions: { create: async (input) => {
      if (state.failCheckout) throw new Error("Simulated checkout outage")
      state.sessions.push(input)
      return { session_id: `test_session_${state.sessions.length}`, checkout_url: "https://checkout.example.test/session" }
    } },
    payments: { retrieve: async (id) => state.payments.get(id) },
  },
}
globalThis.__guestCheckoutTest = state

const replacements = new Map([
  ["lib/db", `export const db = new Proxy({}, {get: (_, key) => {
    const db = globalThis.__guestCheckoutTest.db; const value = db[key];
    return typeof value === 'function' ? value.bind(db) : value;
  }});`],
  ["lib/billing/dodo", `export const getDodoClient = () => globalThis.__guestCheckoutTest.client;
    export const resolveDodoProductId = async sku => 'test_product_' + sku;
    export const isDodoConfigured = () => true;`],
  ["lib/email/resend", `export const getEmailFromAddress = () => 'Accessibility.build <hello@updates.accessibility.build>';
    export const isEmailServiceEnabled = () => true;
    export const getResendClient = () => ({emails:{send:async message => {globalThis.__guestCheckoutTest.emails.push(message); return {data:{id:'test_email'},error:null}}}});`],
  ["lib/email/service", `export const formatAmountForEmail = () => '$4.99';
    export const sendPurchaseConfirmationEmail = async () => {};
    export const sendRefundNotificationEmail = async () => {};
    export const sendPaymentFailedEmail = async () => {};`],
  ["lib/posthog-server", "export const getPostHogClient = () => null"],
])
const bundled = await build({
  stdin: { contents: `
    export * as schema from './lib/db/schema';
    export * from './lib/billing/dodo-service';
    export * from './lib/billing/guest-checkout';
    export * from './lib/courses/access';
    export * from './lib/downloads/access';
    export { POST as checkout } from './app/api/checkout/route';
    export { GET as orderStatus } from './app/api/billing/orders/[orderId]/route';
    export { POST as creditCheckout } from './app/api/billing/checkout-session/route';`, resolveDir: root, loader: "ts" },
  bundle: true, write: false, platform: "node", format: "cjs", packages: "external", logLevel: "silent",
  tsconfig: path.join(root, "tsconfig.json"),
  plugins: [{ name: "network-boundaries", setup(b) {
    b.onResolve({ filter: /.*/ }, (args) => {
      if (args.path === "server-only") return { path: "server-only", namespace: "boundary" }
      if (args.path === "@clerk/nextjs/server") return { path: "clerk", namespace: "boundary" }
      const resolved = args.path.startsWith("@/") ? args.path.slice(2)
        : args.path.startsWith(".") ? path.relative(root, path.resolve(args.resolveDir, args.path)).replace(/\.ts$/, "") : ""
      return replacements.has(resolved) ? { path: resolved, namespace: "boundary" } : undefined
    })
    b.onLoad({ filter: /.*/, namespace: "boundary" }, (args) => ({ contents: args.path === "server-only" ? ""
      : args.path === "clerk" ? `export const currentUser = async () => globalThis.__guestCheckoutTest.user;
        export const auth = async () => ({userId:globalThis.__guestCheckoutTest.user?.id ?? null,sessionClaims:{}});`
      : replacements.get(args.path), loader: "js" }))
  } }],
})

const client = postgres(databaseUrl, { max: 1, prepare: false, connect_timeout: 10, idle_timeout: 5 })
const filename = path.join(root, "scripts/billing/.guest-test-bundle.cjs")
const mod = new Module(filename)
mod.filename = filename
mod.paths = Module._nodeModulePaths(root)
mod._compile(bundled.outputFiles[0].text, filename)
const app = mod.exports
const rollback = new Error("ROLL_BACK_GUEST_TEST")
let passed = false
try {
  await drizzle(client, { schema: app.schema }).transaction(async (tx) => {
    const tables = ["users", "billing_orders", "credit_transactions", "dodo_webhook_events", "billing_funnel_events", "course_licences", "course_seats", "product_entitlements", "product_files"]
    for (const table of tables) await tx.execute(sql.raw(`CREATE TEMP TABLE ${table} (LIKE public.${table} INCLUDING ALL) ON COMMIT DROP`))
    await tx.execute(sql.raw("SET LOCAL search_path = pg_temp, public"))
    const migration = fs.readFileSync(path.join(root, "drizzle/0020_guest_product_checkout.sql"), "utf8").replaceAll("billing_orders", "pg_temp.billing_orders")
    await tx.execute(sql.raw("ALTER TABLE pg_temp.billing_orders DROP CONSTRAINT IF EXISTS billing_orders_guest_products_only"))
    // Qualify only table references; the constraint identifier remains unqualified.
    await tx.execute(sql.raw(migration.replace("pg_temp.billing_orders_guest_products_only", "billing_orders_guest_products_only")))
    const visible = await tx.execute(sql.raw("SELECT count(*)::int AS total FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.oid=pg_my_temp_schema() AND c.relkind='r'"))
    assert.equal(visible[0].total, tables.length, "All writes must resolve to empty temporary tables")
    state.db = tx
    const { billingOrders, users, courseLicences, productEntitlements, dodoWebhookEvents, creditTransactions } = app.schema
    const request = (item, ip = "192.0.2.1") => new NextRequest("https://accessibility.build/api/checkout", {
      method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": ip }, body: JSON.stringify({ item }),
    })
    const orderRow = async (id) => (await tx.select().from(billingOrders).where(eq(billingOrders.id, id)))[0]
    const webhook = (type, order, extra = {}) => ({ type, data: { payment_id: `test_payment_${order.id}`, metadata: { order_id: order.id }, ...extra } })
    const status = async (id, cookie) => app.orderStatus(new NextRequest(`https://accessibility.build/api/billing/orders/${id}`, { headers: cookie ? { cookie } : {} }), { params: Promise.resolve({ orderId: id }) })

    for (const key of ["course:cpacc-crash-course:individual", "template:wcag-audit-workbook:individual"]) {
      const response = await app.checkout(request(key))
      assert.equal(response.status, 200)
      const checkout = await response.json()
      const name = app.guestCheckoutCookieName(checkout.orderId)
      const token = response.cookies.get(name)?.value
      const cookie = `${name}=${token}`
      assert.match(response.headers.get("set-cookie"), /HttpOnly/i)
      assert.match(response.headers.get("set-cookie"), /Secure/i)
      assert.match(response.headers.get("set-cookie"), /SameSite=lax/i)
      assert.equal(JSON.stringify(checkout).includes(token), false, "Token stays out of response bodies and URLs")
      let order = await orderRow(checkout.orderId)
      assert.equal(order.userId, null)
      assert.equal(order.status, "pending")
      assert.notEqual(order.metadata.guestCheckoutTokenHash, token)
      assert.equal((await tx.select().from(users)).length, 0, "Guest checkout creates no user or bonus credits")
      assert.equal(state.sessions.at(-1).customer, undefined, "Dodo collects the guest's checkout email")
      assert.equal((await status(order.id)).status, 404)
      assert.equal((await status(order.id, `${name}=${app.createGuestCheckoutToken().token}`)).status, 404)
      const pending = await (await status(order.id, cookie)).json()
      assert.equal(pending.status, "pending")
      assert.equal(pending.requiresSignIn, true)
      assert.equal("buyerEmail" in pending, false)
      await app.processDodoWebhook(`processing_${order.id}`, webhook("payment.processing", order))
      assert.equal((await orderRow(order.id)).status, "pending")
      const emailCount = state.emails.length
      const paid = webhook("payment.succeeded", order, { customer: { email: "Buyer@Example.test" }, total_amount: order.amountTotal + 100, tax: 100, currency: "USD" })
      const eventId = `paid_${order.id}`
      await app.processDodoWebhook(eventId, paid)
      assert.equal((await app.processDodoWebhook(eventId, paid)).duplicate, true)
      await app.processDodoWebhook(`${eventId}_redelivery`, paid)
      order = await orderRow(order.id)
      assert.equal(order.status, "paid")
      assert.equal(order.metadata.buyerEmail, "buyer@example.test")
      assert.equal(state.emails.length, emailCount + 1, "One receipt per fulfilled order")
      assert.deepEqual(state.emails.at(-1).to, ["buyer@example.test"])
      assert.match(state.emails.at(-1).html, /Sign in with this email address/)
      const entitlement = key.startsWith("course:") ? courseLicences : productEntitlements
      assert.equal((await tx.select().from(entitlement)).length, 1, "Duplicate events grant no extra access")
      const confirmed = await (await status(order.id, cookie)).json()
      assert.equal(confirmed.status, "paid")
      assert.equal(confirmed.requiresSignIn, true)
      assert.equal((await tx.select().from(creditTransactions)).length, 0)
    }
    console.log("PASS anonymous product checkout, private status, fulfilment, receipts and duplicate delivery")
    assert.equal((await app.getFileForViewer("wcag-audit-workbook", "private.pdf")).status, 401)
    assert.equal((await app.checkout(request("starter_50"))).status, 400)
    assert.equal((await app.creditCheckout(new NextRequest("https://accessibility.build/api/billing/checkout-session", { method: "POST", body: JSON.stringify({ catalogKey: "starter_50" }) }))).status, 401)
    await assert.rejects(() => app.createDodoCheckout({ userId: null, key: "starter_50", guestTokenHash: app.createGuestCheckoutToken().hash }), /only available for courses and templates/)
    await assert.rejects(() => tx.transaction(async (t) => {
      await t.insert(billingOrders).values({ userId: null, paymentProvider: "dodo", catalogKey: "starter_50", credits: 50, currency: "USD", amountSubtotal: 499, amountTotal: 499 })
    }), (err) => err.cause?.constraint_name === "billing_orders_guest_products_only")
    assert.equal((await status("invalid-order-id")).status, 404)

    // A missing email fails fulfilment and can be retried with the same event ID.
    const retry = await (await app.checkout(request("template:title-ii-compliance-kit:entity"))).json()
    const retryOrder = await orderRow(retry.orderId)
    await assert.rejects(() => app.processDodoWebhook("retry_email", webhook("payment.succeeded", retryOrder)), /valid buyer email/)
    assert.equal((await orderRow(retry.orderId)).status, "pending")
    await app.processDodoWebhook("retry_email", webhook("payment.succeeded", retryOrder, { customer: { email: "retry@example.test" } }))
    assert.equal((await tx.select().from(dodoWebhookEvents).where(eq(dodoWebhookEvents.eventId, "retry_email")))[0].processingStatus, "processed")
    console.log("PASS guest credit rejection, database constraint and failed-event retry")

    const clerkUser = (id, email, verified) => ({ id, primaryEmailAddressId: "primary", firstName: "Test", lastName: null, imageUrl: "", emailAddresses: [{ id: "primary", emailAddress: email, verification: { status: verified ? "verified" : "unverified" } }] })
    state.user = clerkUser("test_verified_buyer", "buyer@example.test", true)
    const viewer = await app.getCourseViewer()
    assert.equal((await app.getCourseAccess("cpacc-crash-course")).hasAccess, true)
    assert.equal((await app.getDownloadEntitlements(viewer)).length, 1)
    const courseOrder = (await tx.select().from(billingOrders)).find((o) => o.catalogKey.startsWith("course:"))
    assert.equal((await orderRow(courseOrder.id)).userId, viewer.userId)
    assert.equal((await (await status(courseOrder.id)).json()).requiresSignIn, false)
    assert.equal((await app.checkout(request(courseOrder.catalogKey))).status, 409, "Existing individual course access prevents a duplicate purchase")

    // Even an unverified email matching the now-claimed buyer cannot recover their row.
    state.user = clerkUser("test_unverified_attacker", "buyer@example.test", false)
    const unverified = await app.getCourseViewer()
    assert.notEqual(unverified.userId, viewer.userId)
    assert.equal((await app.getCourseAccess("cpacc-crash-course")).hasAccess, false)
    assert.equal((await app.getDownloadEntitlements(unverified)).length, 0)
    assert.equal((await status(courseOrder.id)).status, 404)
    state.user = clerkUser("test_other_buyer", "other@example.test", true)
    assert.equal((await app.getCourseAccess("cpacc-crash-course")).hasAccess, false)
    console.log("PASS verified-email claims and rejection of unverified or different emails")

    // Refunds revoke email-held access before it can be claimed.
    await app.processDodoWebhook("refund_unclaimed", webhook("refund.succeeded", retryOrder, { amount: retryOrder.amountTotal, is_partial: false, refund_id: "test_refund" }))
    state.user = clerkUser("test_refunded_buyer", "retry@example.test", true)
    assert.equal((await app.getDownloadEntitlements(await app.getCourseViewer())).length, 0)
    await app.processDodoWebhook("lost_course_dispute", webhook("dispute.lost", courseOrder))
    state.user = clerkUser("test_verified_buyer", "buyer@example.test", true)
    assert.equal((await app.getCourseAccess("cpacc-crash-course")).hasAccess, false)

    // Signed-in credit fulfilment and refunds still change the balance exactly once.
    const before = (await tx.select().from(users).where(eq(users.id, viewer.userId)))[0].credits
    const credit = await app.createDodoCheckout({ userId: viewer.userId, email: viewer.email, key: "starter_50" })
    const creditOrder = await orderRow(credit.orderId)
    const creditPaid = webhook("payment.succeeded", creditOrder)
    await app.processDodoWebhook("credits_paid", creditPaid)
    await app.processDodoWebhook("credits_paid_again", creditPaid)
    assert.equal((await tx.select().from(users).where(eq(users.id, viewer.userId)))[0].credits, before + 50)
    await app.processDodoWebhook("credits_refund", webhook("refund.succeeded", creditOrder, { amount: creditOrder.amountTotal, is_partial: false }))
    assert.equal((await tx.select().from(users).where(eq(users.id, viewer.userId)))[0].credits, before)

    state.user = null
    state.failCheckout = true
    assert.equal((await app.checkout(request("template:wcag-audit-workbook:individual"))).status, 500)
    state.failCheckout = false
    for (let i = 0; i < 12; i++) assert.equal((await app.checkout(request("unknown", "192.0.2.99"))).status, 400)
    assert.equal((await app.checkout(request("unknown", "192.0.2.99"))).status, 429)
    passed = true
    throw rollback
  })
} catch (err) {
  if (err !== rollback) throw err
} finally {
  delete globalThis.__guestCheckoutTest
  await client.end()
}
assert.equal(passed, true)
console.log("Guest checkout passed: anonymous courses/templates, private status, receipts, verified claims, replay safety, refunds, authenticated credits and rate limiting. All temporary data rolled back; no charges or emails sent.")
process.exit(0) // The application's shared rate-limit stores maintain cleanup timers.

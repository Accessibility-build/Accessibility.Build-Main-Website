import "server-only"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { billingOrders, users } from "@/lib/db/schema"
import { getCourse, parseCourseCatalogKey } from "@/lib/courses/config"
import { getTemplateProduct, parseTemplateKey } from "@/lib/billing/sellables"
import { getEmailFromAddress, getResendClient, isEmailServiceEnabled } from "./resend"

const SITE = "https://accessibility.build"

function esc(v: string) {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function layout(title: string, preheader: string, body: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)}</title>
<style>body{margin:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1f2937}.c{max-width:560px;margin:0 auto;padding:40px 24px}.k{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:32px}h1{font-size:22px;margin:0 0 16px;color:#111827}p{font-size:15px;line-height:1.6;margin:0 0 12px;color:#374151}.b{display:inline-block;background:#1d4ed8;color:#fff!important;padding:12px 20px;border-radius:6px;font-weight:600;text-decoration:none}.m{font-size:13px;color:#4b5563}a{color:#1d4ed8}</style></head>
<body><span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span><div class="c"><div class="k">${body}</div>
<p class="m" style="text-align:center;margin-top:16px">Accessibility.build</p></div></body></html>`
}

async function send(to: string, subject: string, html: string, key: string) {
  if (!isEmailServiceEnabled() || !to || to.endsWith("@users.accessibility.build")) return
  try {
    await getResendClient().emails.send({ from: getEmailFromAddress(), to: [to], subject, html, headers: { "X-Entity-Ref-ID": key } })
  } catch (err) {
    console.error("[email:course] send failed", key, err instanceof Error ? err.message : String(err))
  }
}

/** Receipt and access link after a course purchase. Never throws. */
export async function sendCoursePurchaseEmail(orderId: string) {
  try {
    const [order] = await db.select().from(billingOrders).where(eq(billingOrders.id, orderId)).limit(1)
    const parsed = parseCourseCatalogKey(order?.catalogKey)
    if (!order || !parsed) return
    const course = getCourse(parsed.slug)!
    const [user] = await db.select({ email: users.email, firstName: users.firstName }).from(users).where(eq(users.id, order.userId)).limit(1)
    if (!user) return
    const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency || "USD" }).format(order.amountTotal / 100)
    const licence = course.licences[parsed.licence]
    const teamLine =
      parsed.licence === "team"
        ? `<p>Your Team licence has ${licence.seats} seats, including yours. Add your colleagues by email on the <a href="${SITE}${course.homeRoute}/team">team page</a>; each of them gets access when they sign in with that email.</p>`
        : ""
    const html = layout(
      `${course.title}: you are in`,
      `Your ${course.title} access is ready.`,
      `<h1>You are in</h1><p>${user.firstName ? `Hi ${esc(user.firstName)},` : "Hi,"}</p>
<p>Thank you for buying the ${esc(course.title)} (${esc(licence.name)} licence). Your access is ready now. Sign in with this email address to start.</p>
<p><a class="b" href="${SITE}${course.homeRoute}">Open the course</a></p>${teamLine}
<p class="m">Amount paid: ${esc(amount)}. Order ID: ${esc(order.id)}.</p>
<p class="m">This is an independent study course. It is not affiliated with, approved by or endorsed by IAAP.</p>`
    )
    await send(user.email, `Your ${course.title} access is ready`, html, `course_purchase_${order.id}`)
  } catch (err) {
    console.error("[email:course] purchase email failed", err instanceof Error ? err.message : String(err))
  }
}

/** Invitation to a team seat. Never throws. */
export async function sendCourseSeatInviteEmail(input: { to: string; courseSlug: string; inviterName: string | null; seatId: string }) {
  const course = getCourse(input.courseSlug)
  if (!course) return
  const who = input.inviterName ? esc(input.inviterName) : "A colleague"
  const html = layout(
    `You have a seat on the ${course.title}`,
    `${who} added you to the ${course.title}.`,
    `<h1>You have a seat on the ${esc(course.title)}</h1>
<p>${who} added you to their team licence for the ${esc(course.title)} on Accessibility.build.</p>
<p>Sign in or create a free account with <strong>${esc(input.to)}</strong>, then open the course.</p>
<p><a class="b" href="${SITE}${course.homeRoute}">Open the course</a></p>
<p class="m">If you were not expecting this, you can ignore this email.</p>`
  )
  await send(input.to, `You have a seat on the ${course.title}`, html, `course_seat_${input.seatId}`)
}

/** Receipt and download link after a template purchase. Never throws. */
export async function sendTemplatePurchaseEmail(orderId: string) {
  try {
    const [order] = await db.select().from(billingOrders).where(eq(billingOrders.id, orderId)).limit(1)
    const parsed = parseTemplateKey(order?.catalogKey)
    if (!order || !parsed) return
    const product = getTemplateProduct(parsed.slug)!
    const licence = product.licences.find((l) => l.id === parsed.licence)
    const [user] = await db.select({ email: users.email, firstName: users.firstName }).from(users).where(eq(users.id, order.userId)).limit(1)
    if (!user) return
    const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: order.currency || "USD" }).format(order.amountTotal / 100)
    const html = layout(
      `${product.name}: your download`,
      `Your ${product.name} is ready to download.`,
      `<h1>Your download is ready</h1><p>${user.firstName ? `Hi ${esc(user.firstName)},` : "Hi,"}</p>
<p>Thank you for buying the ${esc(product.name)}${licence ? ` (${esc(licence.name)} licence)` : ""}. Sign in with this email address to download the files at any time.</p>
<p><a class="b" href="${SITE}/account/downloads">Go to your downloads</a></p>
<p class="m">Amount paid: ${esc(amount)}. Order ID: ${esc(order.id)}.</p>`
    )
    await send(user.email, `Your ${product.name} is ready to download`, html, `template_purchase_${order.id}`)
  } catch (err) {
    console.error("[email:course] template email failed", err instanceof Error ? err.message : String(err))
  }
}

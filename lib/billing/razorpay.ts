import crypto from 'crypto'
import { getPublicAppUrl } from './stripe'

type RazorpayOrderInput = {
  amountMinor: number
  currency: 'USD' | 'INR'
  receipt: string
  notes: Record<string, string>
}

type RazorpayPaymentLinkInput = {
  amountMinor: number
  currency: 'USD' | 'INR'
  description: string
  referenceId: string
  customer?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
}

type RazorpayCustomerInput = {
  name?: string
  email?: string
  contact?: string
  notes?: Record<string, string>
}

type RazorpayOrderResponse = {
  id: string
  amount: number
  currency: 'USD' | 'INR'
  status: string
  receipt: string
  notes?: Record<string, string>
}

type RazorpayPaymentLinkResponse = {
  id: string
  short_url: string
  status: string
}

type RazorpayCustomerResponse = {
  id: string
}

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1'

function getRazorpayAuthHeader() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId) {
    throw new Error('RAZORPAY_KEY_ID is not configured')
  }

  if (!keySecret) {
    throw new Error('RAZORPAY_KEY_SECRET is not configured')
  }

  const basicToken = Buffer.from(`${keyId}:${keySecret}`, 'utf8').toString('base64')

  return {
    keyId,
    authorization: `Basic ${basicToken}`,
  }
}

function sanitizeCustomer(input?: RazorpayPaymentLinkInput['customer']) {
  if (!input) {
    return undefined
  }

  const customer = {
    name: input.name?.trim() || undefined,
    email: input.email?.trim() || undefined,
    contact: input.contact?.trim() || undefined,
  }

  if (!customer.name && !customer.email && !customer.contact) {
    return undefined
  }

  return customer
}

async function razorpayRequest<TResponse>(
  path: string,
  method: 'GET' | 'POST',
  payload?: Record<string, unknown>
): Promise<TResponse> {
  const LOG_PREFIX = '[razorpay:api]'
  const startMs = Date.now()

  const { authorization } = getRazorpayAuthHeader()

  console.log(`${LOG_PREFIX} ▶ ${method} ${path}`, JSON.stringify({
    hasPayload: Boolean(payload),
  }))

  let response: Response
  try {
    response = await fetch(`${RAZORPAY_API_BASE}${path}`, {
      method,
      headers: {
        Authorization: authorization,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: payload ? JSON.stringify(payload) : undefined,
      cache: 'no-store',
    })
  } catch (networkError) {
    const durationMs = Date.now() - startMs
    console.error(`${LOG_PREFIX} ✗ NETWORK_ERROR ${method} ${path}`, JSON.stringify({
      durationMs,
      error: networkError instanceof Error ? networkError.message : String(networkError),
      errorType: networkError instanceof Error ? networkError.constructor.name : typeof networkError,
    }))
    throw networkError
  }

  const durationMs = Date.now() - startMs
  const data = (await response.json().catch(() => null)) as
    | (TResponse & { error?: { description?: string; code?: string; reason?: string } })
    | null

  if (!response.ok) {
    const message =
      data?.error?.description ||
      `Razorpay API request failed (${response.status}) at ${method} ${path}`

    console.error(`${LOG_PREFIX} ✗ API_ERROR ${method} ${path}`, JSON.stringify({
      status: response.status,
      durationMs,
      errorDescription: data?.error?.description,
      errorCode: data?.error?.code,
      errorReason: data?.error?.reason,
    }))

    throw new Error(message)
  }

  if (!data) {
    console.error(`${LOG_PREFIX} ✗ EMPTY_RESPONSE ${method} ${path}`, JSON.stringify({
      status: response.status,
      durationMs,
    }))
    throw new Error(`Razorpay API returned empty response for ${method} ${path}`)
  }

  console.log(`${LOG_PREFIX} ✓ ${method} ${path}`, JSON.stringify({
    status: response.status,
    durationMs,
  }))

  return data
}

export function getRazorpayKeyId() {
  return getRazorpayAuthHeader().keyId
}

export function getRazorpayWebhookSecret() {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) {
    throw new Error('RAZORPAY_WEBHOOK_SECRET is not configured')
  }

  return secret
}

export function verifyRazorpayWebhookSignature(rawBody: string, signature: string) {
  const digest = crypto
    .createHmac('sha256', getRazorpayWebhookSecret())
    .update(rawBody, 'utf8')
    .digest('hex')

  const left = Buffer.from(digest, 'utf8')
  const right = Buffer.from(signature, 'utf8')

  if (left.length !== right.length) {
    return false
  }

  return crypto.timingSafeEqual(left, right)
}

export async function createRazorpayOrder(
  input: RazorpayOrderInput
): Promise<RazorpayOrderResponse> {
  return razorpayRequest<RazorpayOrderResponse>('/orders', 'POST', {
    amount: input.amountMinor,
    currency: input.currency,
    receipt: input.receipt,
    notes: input.notes,
  })
}

export async function createRazorpayPaymentLink(
  input: RazorpayPaymentLinkInput
): Promise<RazorpayPaymentLinkResponse> {
  const appUrl = getPublicAppUrl()
  const customer = sanitizeCustomer(input.customer)

  return razorpayRequest<RazorpayPaymentLinkResponse>('/payment_links', 'POST', {
    amount: input.amountMinor,
    currency: input.currency,
    accept_partial: false,
    description: input.description,
    reference_id: input.referenceId,
    customer,
    notify: {
      sms: false,
      email: Boolean(customer?.email),
    },
    reminder_enable: false,
    callback_url: `${appUrl}/billing?checkout=success&order=${encodeURIComponent(input.referenceId)}`,
    callback_method: 'get',
    notes: input.notes || {},
  })
}

export async function createRazorpayCustomer(
  input: RazorpayCustomerInput
): Promise<RazorpayCustomerResponse | null> {
  const payload = {
    name: input.name?.trim() || undefined,
    email: input.email?.trim() || undefined,
    contact: input.contact?.trim() || undefined,
    notes: input.notes || {},
  }

  if (!payload.name && !payload.email && !payload.contact) {
    return null
  }

  return razorpayRequest<RazorpayCustomerResponse>('/customers', 'POST', payload)
}

export async function fetchRazorpayPayment(paymentId: string) {
  return razorpayRequest<{
    id: string
    amount: number
    currency: 'USD' | 'INR'
    order_id?: string
    notes?: Record<string, string>
    status?: string
  }>(`/payments/${encodeURIComponent(paymentId)}`, 'GET')
}

#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import { createClerkClient } from '@clerk/backend'
import pg from 'pg'

const { Client } = pg

const SERVER_BOOT_TIMEOUT_MS = 120_000

export function loadEnv() {
  const cwd = process.cwd()

  for (const filename of ['.env.local', '.env']) {
    const filePath = path.join(cwd, filename)
    if (fs.existsSync(filePath)) {
      dotenv.config({ path: filePath, override: true })
    }
  }

  if (!process.env.CLERK_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    process.env.CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  }
}

export function requiredEnv(name) {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`${name} is required`)
  }
  return value
}

export function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')
}

export function deriveUrl(baseUrl, portOffset) {
  const url = new URL(baseUrl)
  const currentPort =
    Number(url.port || (url.protocol === 'https:' ? '443' : '80'))
  url.port = String(currentPort + portOffset)
  return url.toString().replace(/\/$/, '')
}

export function createTestId(prefix = 'clerk') {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(4).toString('hex')}`
}

export function createClerkTestEmail(label = 'signup') {
  return `accessibility.build+clerk_test_${label}_${Date.now().toString(36)}_${randomBytes(2).toString('hex')}@example.com`
}

export function createStrongPassword() {
  return `A11yTest!${randomBytes(6).toString('hex')}Aa1`
}

export function getClerkClient() {
  return createClerkClient({
    secretKey: requiredEnv('CLERK_SECRET_KEY'),
  })
}

export async function getClerkUserByEmail(clerkClient, email) {
  const result = await clerkClient.users.getUserList({
    emailAddress: [email],
    limit: 1,
  })

  return result.data[0] || null
}

export async function createSessionToken(clerkClient, userId, expiresInSeconds = 300) {
  const session = await clerkClient.sessions.createSession({ userId })
  const tokenPayload = await clerkClient.sessions.getToken(
    session.id,
    undefined,
    expiresInSeconds
  )
  const token = tokenPayload.jwt || tokenPayload.token

  if (!token) {
    throw new Error(`Clerk did not return a session token for ${userId}`)
  }

  return {
    sessionId: session.id,
    token,
  }
}

export async function waitForServer(baseUrl, readyPath = '/sign-in', timeoutMs = SERVER_BOOT_TIMEOUT_MS) {
  const deadline = Date.now() + timeoutMs
  const targetUrl = `${baseUrl}${readyPath}`
  let lastError = null

  while (Date.now() < deadline) {
    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        redirect: 'manual',
      })

      if (response.status > 0 && response.status < 500) {
        return
      }
    } catch (error) {
      lastError = error
    }

    await sleep(1_000)
  }

  throw new Error(
    `Timed out waiting for ${targetUrl}${lastError instanceof Error ? ` (${lastError.message})` : ''}`
  )
}

export async function ensureServer({
  baseUrl,
  readyPath = '/sign-in',
  label = 'next-server',
  envOverrides = {},
}) {
  const requiresDedicatedServer = Object.keys(envOverrides).length > 0

  if (!requiresDedicatedServer) {
    try {
      await waitForServer(baseUrl, readyPath, 3_000)
      return {
        baseUrl,
        started: false,
        stop: async () => {},
      }
    } catch {
      // Fall through and boot a local dev server.
    }
  }

  const url = new URL(baseUrl)
  const hostname = url.hostname
  const port = url.port || (url.protocol === 'https:' ? '443' : '80')
  const logs = []
  const child = spawn(
    'npm',
    ['run', 'dev', '--', '--hostname', hostname, '--port', String(port)],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NEXT_PUBLIC_APP_URL: baseUrl,
        ...envOverrides,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  )

  const pushLog = (chunk) => {
    const text = chunk.toString()
    if (!text.trim()) {
      return
    }

    logs.push(text)
    if (logs.length > 50) {
      logs.shift()
    }
  }

  child.stdout.on('data', pushLog)
  child.stderr.on('data', pushLog)

  try {
    await Promise.race([
      waitForServer(baseUrl, readyPath),
      new Promise((_, reject) => {
        child.once('exit', (code) => {
          reject(
            new Error(
              `${label} exited before becoming ready (code ${code ?? 'unknown'})\n${logs.join('')}`
            )
          )
        })
      }),
    ])
  } catch (error) {
    if (child.exitCode === null) {
      child.kill('SIGTERM')
    }
    throw error
  }

  return {
    baseUrl,
    started: true,
    stop: async () => {
      if (child.exitCode !== null) {
        return
      }

      child.kill('SIGTERM')
      const exitCode = await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          child.kill('SIGKILL')
        }, 5_000)

        child.once('exit', (code) => {
          clearTimeout(timeout)
          resolve(code)
        })
      })

      if (typeof exitCode === 'number' && exitCode !== 0 && exitCode !== 143) {
        throw new Error(`${label} exited with code ${exitCode}\n${logs.join('')}`)
      }
    },
  }
}

export async function appRequest({
  baseUrl,
  pathname,
  method = 'GET',
  token,
  body,
  headers = {},
  responseType = 'auto',
}) {
  const requestHeaders = new Headers(headers)

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`)
  }

  if (body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: 'manual',
  })

  if (responseType === 'arrayBuffer') {
    const buffer = Buffer.from(await response.arrayBuffer())
    return {
      ok: response.ok,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      buffer,
      text: null,
      json: null,
    }
  }

  const text = await response.text()
  let json = null

  if (responseType === 'json' || responseType === 'auto') {
    try {
      json = text ? JSON.parse(text) : null
    } catch {
      json = null
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    text,
    json,
    buffer: null,
  }
}

export async function connectDb() {
  const client = new Client({
    connectionString: requiredEnv('DATABASE_URL'),
  })

  await client.connect()
  return client
}

export async function deleteDbUser({ db, userId, email }) {
  if (userId && email) {
    await db.query('delete from users where id = $1 or email = $2', [userId, email.toLowerCase()])
    return
  }

  if (userId) {
    await db.query('delete from users where id = $1', [userId])
    return
  }

  if (email) {
    await db.query('delete from users where email = $1', [email.toLowerCase()])
  }
}

export async function deleteBillingEventsByRunIds(db, runIds) {
  if (runIds.length === 0) {
    return
  }

  await db.query(
    "delete from billing_funnel_events where metadata->>'testRunId' = any($1::text[])",
    [runIds]
  )
}

export async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
